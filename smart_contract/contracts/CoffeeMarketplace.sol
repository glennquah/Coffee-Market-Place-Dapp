pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import {AutomationCompatibleInterface} from '@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol';
import './Product.sol';
import './Leaderboard.sol';

contract CoffeeMarketplace is
    ERC721URIStorage,
    Ownable,
    IERC721Receiver,
    AutomationCompatibleInterface
{
    using Strings for uint256;
    uint256 public tokenCounter = 0; // Counter for NFT IDs
    Product public productContract;
    Leaderboard public leaderboardContract;
    uint256 public lastRewardTime; // Timestamp of the last reward distribution

    struct NFTMetadata {
        uint256 tokenId;
        string name;
        string description;
        string tokenURI;
        uint256 productId;
        uint256 price;
        bool isActive;
        string origin;
        string roastLevel;
        string beanType;
        string processMethod;
        uint256 roastDate;
    }

    // Mapping from tokenId to NFTMetadata
    mapping(uint256 => NFTMetadata) public tokenMetadata;

    // Mapping from productId to array of tokenIds
    mapping(uint256 => uint256[]) public productTokens;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string tokenURI,
        uint256 price
    );

    event ListingAdded(
        uint256 productId,
        address indexed roaster,
        string name,
        uint256 price,
        uint256 quantity
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string name,
        string description,
        string tokenURI,
        string origin,
        string roastLevel
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
        address _productContractAddress
        // address _leaderboardContractAddress
    ) ERC721('CoffeeNFT', 'COFFEE') Ownable(msg.sender) {
        require(
            _productContractAddress != address(0),
            'Invalid Product contract address'
        );
        // require(
        //     _leaderboardContractAddress != address(0),
        //     'Invalid Leaderboard contract address'
        // );

        productContract = Product(_productContractAddress);
        // leaderboardContract = Leaderboard(_leaderboardContractAddress);
        lastRewardTime = block.timestamp; // Initialize with contract deployment timestamp
    }

    // Add a new product and mint NFTs for the product
    function addRoasterListing(
        string memory _name,
        string memory _description,
        string memory _tokenURI,
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
        require(bytes(_tokenURI).length > 0, 'Image URI cannot be empty');

        uint256[] memory nftIds = new uint256[](_quantity);

        // Get the product ID before minting
        uint256 newProductId = productContract.productCounter() + 1;

        // Mint NFTs for each unit of the product and store their IDs
        for (uint256 i = 0; i < _quantity; i++) {
            tokenCounter++;
            uint256 tokenId = tokenCounter;

            // Create metadata for this token
            tokenMetadata[tokenId] = NFTMetadata({
                tokenId: tokenId,
                name: _name,
                description: _description,
                tokenURI: _tokenURI,
                productId: newProductId,
                price: _price,
                isActive: true,
                origin: _origin,
                roastLevel: _roastLevel,
                beanType: _beanType,
                processMethod: _processMethod,
                roastDate: block.timestamp
            });

            _safeMint(address(this), tokenId); // Assign NFT to the smart contract itself
            _setTokenURI(tokenId, _tokenURI); // IPFS hash as the token URI (metadata link)

            nftIds[i] = tokenId;
            productTokens[newProductId].push(tokenId);

            emit NFTMinted(tokenId, address(this), _name, _tokenURI, _price);
        }

        // Add product to the Product contract
        productContract.addProduct(
            msg.sender,
            _name,
            _description,
            _tokenURI,
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
            string memory tokenURI,
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
        for (uint256 i = 0; i < 3; i++) {
            address topCustomer = leaderboardEntries[i].customer;

            if (topCustomer != address(0)) {
                // ! When NFT is completed to finish this logic
                // TODO: Assume the product to be rewarded has already been listed and to transfer to the top customer?
                tokenCounter++;
                uint256 tokenId = tokenCounter;
                _safeMint(topCustomer, tokenId);
                _setTokenURI(tokenId, 'ipfs://reward_metadata'); // Placeholder IPFS URI

                emit MonthlyRewardDistributed(topCustomer, tokenId);
            }
        }

        // Update last reward time
        lastRewardTime = block.timestamp;
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

    // Get NFT metadata
    function getNFTMetadata(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            string memory tokenURI,
            uint256 productId,
            uint256 price,
            bool isActive,
            string memory origin,
            string memory roastLevel,
            string memory beanType,
            string memory processMethod,
            uint256 roastDate
        )
    {
        // This will revert if token doesn't exist
        ownerOf(tokenId); // This inherently checks if token exists
        NFTMetadata memory metadata = tokenMetadata[tokenId];

        return (
            metadata.name,
            metadata.description,
            metadata.tokenURI,
            metadata.productId,
            metadata.price,
            metadata.isActive,
            metadata.origin,
            metadata.roastLevel,
            metadata.beanType,
            metadata.processMethod,
            metadata.roastDate
        );
    }

    // Get all NFTs owned by an address with their metadata
    function getNFTsByOwner(
        address owner
    )
        public
        view
        returns (uint256[] memory tokenIds, NFTMetadata[] memory metadataArray)
    {
        uint256 balance = balanceOf(owner);
        tokenIds = new uint256[](balance);
        metadataArray = new NFTMetadata[](balance);
        uint256 index = 0;

        for (uint256 i = 1; i <= tokenCounter; i++) {
            if (ownerOf(i) == owner) {
                tokenIds[index] = i;
                metadataArray[index] = tokenMetadata[i];
                index++;
            }
        }
    }

    // Update NFT metadata (only by owner or product roaster)
    function updateNFTMetadata(
        uint256 tokenId,
        string memory newName,
        string memory newDescription,
        string memory newTokenURI,
        string memory newOrigin,
        string memory newRoastLevel,
        string memory newBeanType,
        string memory newProcessMethod
    ) public {
        ownerOf(tokenId); // This inherently checks if token exists
        uint256 productId = tokenMetadata[tokenId].productId;
        address roaster = productContract.getProductRoaster(productId);
        require(
            msg.sender == owner() || msg.sender == roaster,
            'Not authorized to update metadata'
        );

        NFTMetadata storage metadata = tokenMetadata[tokenId];
        metadata.name = newName;
        metadata.description = newDescription;
        metadata.tokenURI = newTokenURI;
        metadata.origin = newOrigin;
        metadata.roastLevel = newRoastLevel;
        metadata.beanType = newBeanType;
        metadata.processMethod = newProcessMethod;

        emit MetadataUpdated(
            tokenId,
            newName,
            newDescription,
            newTokenURI,
            newOrigin,
            newRoastLevel
        );
    }

    // Contract-to-user transfer (purchase from marketplace)
    function purchaseNFT(uint256 productId, uint256 tokenId) public payable {
        require(
            ownerOf(tokenId) == address(this),
            'NFT not owned by marketplace'
        );

        // Get product details and validate
        NFTMetadata memory metadata = tokenMetadata[tokenId];
        require(metadata.isActive, 'NFT not active for sale');
        require(metadata.productId == productId, 'NFT not from this product');
        require(msg.value >= metadata.price, 'Insufficient payment');

        // Get roaster address and transfer payment
        address roaster = productContract.getProductRoaster(productId);
        require(roaster != address(0), 'Invalid roaster address');

        // Transfer payment to roaster
        (bool sent, ) = payable(roaster).call{value: msg.value}('');
        require(sent, 'Failed to send payment');

        // Transfer NFT
        _safeTransfer(address(this), msg.sender, tokenId, '');

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
        address seller = ownerOf(tokenId);
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
        _safeTransfer(seller, msg.sender, tokenId, '');
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
                ownerOf(tokenIds[i]) == address(this),
                'NFT not owned by marketplace'
            );

            NFTMetadata memory metadata = tokenMetadata[tokenIds[i]];
            require(metadata.isActive, 'NFT not active for sale');
            require(
                metadata.productId == productId,
                'NFT not from this product'
            );

            totalPrice += metadata.price;
        }

        require(msg.value >= totalPrice, 'Insufficient payment');

        // Transfer payment to roaster
        (bool sent, ) = payable(roaster).call{value: msg.value}('');
        require(sent, 'Failed to send payment');

        // Transfer NFTs
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _safeTransfer(address(this), msg.sender, tokenIds[i], '');
            emit NFTPurchased(
                productId,
                tokenIds[i],
                msg.sender,
                tokenMetadata[tokenIds[i]].price
            );
        }

        // Update product quantity
        productContract.updateQuantityAfterTransfer(productId);
    }

    // Helper functions
    function isNFTAvailableForPurchase(
        uint256 tokenId
    ) public view returns (bool) {
        if (ownerOf(tokenId) != address(this)) {
            return false;
        }

        NFTMetadata memory metadata = tokenMetadata[tokenId];
        return metadata.isActive;
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        require(
            ownerOf(tokenId) == address(this),
            'NFT not owned by marketplace'
        );
        return tokenMetadata[tokenId].price;
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
}
