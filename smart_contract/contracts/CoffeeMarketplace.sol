pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Product.sol";

contract CoffeeMarketplace is ERC721URIStorage, Ownable, IERC721Receiver, Product {
    uint256 public tokenCounter = 0;   // Counter for NFT IDs

    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event ListingAdded(uint256 productId, address indexed roaster, string name, uint256 price, uint256 quantity);

    // Constructor for initializing ERC721 with a name and symbol and passing msg.sender to Ownable
    constructor() ERC721("CoffeeNFT", "COFFEE") Ownable(msg.sender) {}

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

        // Add product to the mapping via the inherited Product contract
        addProduct(msg.sender, _name, _description, _ipfsHash, _price, _quantity, nftIds);
        emit ListingAdded(productCounter, msg.sender, _name, _price, _quantity);
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
