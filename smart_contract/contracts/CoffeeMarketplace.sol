pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import {AutomationCompatibleInterface} from '@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol';
import './Product.sol';
import './Leaderboard.sol';
import './CoffeeNFT.sol';

contract CoffeeMarketplace is
    ERC721URIStorage,
    Ownable,
    IERC721Receiver,
    AutomationCompatibleInterface
{
    Product public productContract;
    Leaderboard public leaderboardContract;
    CoffeeNFT public nftContract;
    uint256 public lastRewardTime; // Timestamp of the last reward distribution

    // Mapping from productId to array of tokenIds
    mapping(uint256 => uint256[]) public productTokens;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string ipfsHash,
        uint256 price
    );

    event ListingAdded(
        uint256 productId,
        address indexed roaster,
        string name,
        uint256 price,
        uint256 quantity
    );

    event NFTPurchased(
        uint256 indexed productId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event NFTTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price
    );

    event MonthlyRewardDistributed(address customer, uint256 tokenId);

    // Constructor for initializing ERC721 with a name and symbol, and setting the product contract address
    constructor(
        address _productContractAddress,
        address _leaderboardContractAddress,
        address _nftContractAddress
    ) ERC721('CoffeeNFT', 'COFFEE') Ownable(msg.sender) {
        require(
            _productContractAddress != address(0),
            'Invalid Product contract address'
        );
        require(
            _leaderboardContractAddress != address(0),
            'Invalid Leaderboard contract address'
        );
        require(
            _nftContractAddress != address(0),
            'Invalid NFT contract address'
        );

        productContract = Product(_productContractAddress);
        leaderboardContract = Leaderboard(_leaderboardContractAddress);
        nftContract = CoffeeNFT(_nftContractAddress);
        lastRewardTime = block.timestamp; // Initialize with contract deployment timestamp
    }

    // Add a new product and mint NFTs for the product
    function addRoasterListing(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        uint256 _price,
        uint256 _quantity,
        string memory _origin,
        string memory _roastLevel,
        string memory _beanType,
        string memory _processMethod
    ) public {
        require(_price > 0, 'Price must be greater than zero.');
        require(_quantity > 0, 'Quantity must be greater than zero.');
        require(bytes(_name).length > 0, 'Name cannot be empty');
        require(bytes(_ipfsHash).length > 0, 'Image URI cannot be empty');

        uint256[] memory nftIds = new uint256[](_quantity);

        // Get the product ID before minting
        uint256 newProductId = productContract.productCounter() + 1;

        // Mint NFTs through the NFT contract
        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = nftContract.mint(
                address(this),
                _name,
                _description,
                _ipfsHash,
                newProductId,
                _price,
                _origin,
                _roastLevel,
                _beanType,
                _processMethod
            );

            nftIds[i] = tokenId;
            productTokens[newProductId].push(tokenId);
        }

        // Add product to the Product contract
        productContract.addProduct(
            msg.sender,
            _name,
            _description,
            _ipfsHash,
            _price,
            _quantity,
            nftIds,
            _origin,
            _roastLevel,
            _beanType,
            _processMethod
        );
        emit ListingAdded(newProductId, msg.sender, _name, _price, _quantity);
    }

    // Function to get product details
    function getListing(
        uint256 _productId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            string memory ipfsHash,
            uint256 price,
            uint256 quantity,
            uint256[] memory nftIds,
            bool available,
            string memory origin,
            string memory roastLevel,
            string memory beanType,
            string memory processMethod,
            uint256 roastDate
        )
    {
        return productContract.getProduct(_productId);
    }

    // Implement the onERC721Received function to accept NFTs
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // Contract-to-user transfer (purchase from marketplace)
    function purchaseNFT(uint256 productId, uint256 tokenId) public payable {
        require(
            nftContract.ownerOf(tokenId) == address(this),
            'NFT not owned by marketplace'
        );

        // Get NFT metadata
        (, , , , uint256 price, bool isActive, , , , , ) = nftContract
            .getNFTMetadata(tokenId);
        require(isActive, 'NFT not active for sale');
        require(msg.value >= price, 'Insufficient payment');

        // Get roaster address and transfer payment
        address roaster = productContract.getProductRoaster(productId);
        require(roaster != address(0), 'Invalid roaster address');

        // Transfer payment to roaster
        (bool sent, ) = payable(roaster).call{value: msg.value}('');
        require(sent, 'Failed to send payment');

        // Transfer NFT
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);

        // Update product state
        productContract.updateQuantityAfterTransfer(productId);

        emit NFTPurchased(productId, tokenId, msg.sender, msg.value);
    }

    // User-to-user transfer (secondary market)
    function transferNFT(
        uint256 tokenId,
        address to,
        uint256 price
    ) public payable {
        // Get the current owner of the NFT (seller)
        address seller = nftContract.ownerOf(tokenId);
        require(
            to != address(0) && to != address(this),
            'Invalid recipient address'
        );
        require(msg.sender == to, 'Only buyer can initiate transfer');

        if (price > 0) {
            // Require payment from the recipient (to)
            require(msg.value >= price, 'Insufficient payment');

            // Send payment to the seller
            (bool sent, ) = payable(seller).call{value: msg.value}('');
            require(sent, 'Failed to send payment');
        }

        // Transfer NFT
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);
        emit NFTTransferred(tokenId, seller, msg.sender, price);
    }

    // Bulk purchase function
    function bulkPurchaseNFTs(
        uint256 productId,
        uint256[] memory tokenIds
    ) public payable {
        require(tokenIds.length > 0, 'No tokens specified');

        uint256 totalPrice = 0;
        address roaster = productContract.getProductRoaster(productId);
        require(roaster != address(0), 'Invalid roaster address');

        // Calculate total price and validate tokens
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                nftContract.ownerOf(tokenIds[i]) == address(this),
                'NFT not owned by marketplace'
            );

            (, , , , uint256 price, bool isActive, , , , , ) = nftContract
                .getNFTMetadata(tokenIds[i]);
            require(isActive, 'NFT not active for sale');

            totalPrice += price;
        }

        require(msg.value >= totalPrice, 'Insufficient payment');

        // Transfer payment to roaster
        (bool sent, ) = payable(roaster).call{value: msg.value}('');
        require(sent, 'Failed to send payment');

        // Transfer NFTs
        for (uint256 i = 0; i < tokenIds.length; i++) {
            nftContract.safeTransferFrom(
                address(this),
                msg.sender,
                tokenIds[i]
            );
            (, , , , uint256 price, , , , , , ) = nftContract.getNFTMetadata(
                tokenIds[i]
            );
            emit NFTPurchased(productId, tokenIds[i], msg.sender, price);
        }

        // Update product quantity
        productContract.updateQuantityAfterTransfer(productId);
    }

    // Helper functions
    function isNFTAvailableForPurchase(
        uint256 tokenId
    ) public view returns (bool) {
        try nftContract.ownerOf(tokenId) returns (address owner) {
            if (owner != address(this)) {
                return false;
            }
            (, , , , uint256 price, bool isActive, , , , , ) = nftContract
                .getNFTMetadata(tokenId);
            return isActive && price > 0;
        } catch {
            return false;
        }
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        require(
            nftContract.ownerOf(tokenId) == address(this),
            'NFT not owned by marketplace'
        );
        (, , , , uint256 price, , , , , ,) = nftContract.getNFTMetadata(
            tokenId
        );
        return price;
    }

    // Chainlink Keeper-compatible checkUpkeep function to check if upkeep is needed
    function checkUpkeep(
        bytes calldata
    ) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp >= lastRewardTime + 30 days);
    }

    // Chainlink Keeper-compatible performUpkeep function to perform upkeep (distribute reward)
    function performUpkeep(bytes calldata) external override {
        require(
            block.timestamp >= lastRewardTime + 30 days,
            'Reward distribution is not available yet'
        );
        distributeMonthlyReward();
    }

    // Distribute rewards to customers every month
    function distributeMonthlyReward() public {
        // Ensure at least 30 days have passed since the last reward distribution
        require(
            block.timestamp >= lastRewardTime + 30 days,
            'Reward distribution is not available yet'
        );

        // Retrieve the top 3 customers from the leaderboard to reward them
        Leaderboard.LeaderboardEntry[10]
            memory leaderboardEntries = leaderboardContract.viewLeaderboard();

        // Get first available product for rewards
        uint256 latestProductId = productContract.productCounter();
        require(latestProductId > 0, 'No products available for rewards');

        // Get product details for the reward NFT
        (
            string memory name,
            string memory description,
            string memory ipfsHash,
            uint256 price,
            ,
            ,
            ,
            string memory origin,
            string memory roastLevel,
            string memory beanType,
            string memory processMethod,

        ) = productContract.getProduct(latestProductId);

        for (uint256 i = 0; i < 3; i++) {
            address topCustomer = leaderboardEntries[i].customer;

            if (topCustomer != address(0)) {
                // ! When NFT is completed to finish this logic
                // TODO: Assume the product to be rewarded has already been listed and to transfer to the top customer?
                uint256 tokenId = nftContract.mint(
                    topCustomer,
                    name,
                    string.concat(description, ' (Reward NFT)'),
                    'ipfs://reward_metadata',
                    latestProductId,
                    0, // Free for reward
                    origin,
                    roastLevel,
                    beanType,
                    processMethod
                );

                emit MonthlyRewardDistributed(topCustomer, tokenId);
            }
        }

        // Update last reward time
        lastRewardTime = block.timestamp;
    }
}
