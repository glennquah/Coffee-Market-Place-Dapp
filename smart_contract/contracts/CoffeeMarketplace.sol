pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Product.sol";

contract CoffeeMarketplace is ERC721URIStorage, Ownable, IERC721Receiver {
    uint256 public tokenCounter = 0;   // Counter for NFT IDs
    Product public productContract;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event ListingAdded(uint256 productId, address indexed roaster, string name, uint256 price, uint256 quantity);

    // Constructor for initializing ERC721 with a name and symbol, and setting the product contract address
    constructor(address _productContractAddress) ERC721("CoffeeNFT", "COFFEE") Ownable(msg.sender) {
        require(_productContractAddress != address(0), "Invalid Product contract address");
        
        productContract = Product(_productContractAddress);
    }

    // Add a new product and mint NFTs for the product
    function addRoasterListing(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        uint256 _price,
        uint256 _quantity
    ) public {
        require(_price > 0, "Price must be greater than zero.");
        require(_quantity > 0, "Quantity must be greater than zero.");

        uint256[] memory nftIds = new uint256[](_quantity);

        // Mint NFTs for each unit of the product and store their IDs
        for (uint256 i = 0; i < _quantity; i++) {
            tokenCounter++;
            uint256 tokenId = tokenCounter;
            _safeMint(address(this), tokenId); // Assign NFT to the smart contract itself
            _setTokenURI(tokenId, _ipfsHash); // IPFS hash as the token URI (metadata link)
            nftIds[i] = tokenId;

            emit NFTMinted(tokenId, address(this), _ipfsHash);
        }

        // Add product to the Product contract using its function
        productContract.addProduct(msg.sender, _name, _description, _ipfsHash, _price, _quantity, nftIds);
        emit ListingAdded(productContract.productCounter(), msg.sender, _name, _price, _quantity);
    }

    // Function to get product details
    function getListing(uint256 _productId) public view returns (
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 price,
        uint256 quantity,
        uint256[] memory nftIds,
        bool available
    ) {
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
}
