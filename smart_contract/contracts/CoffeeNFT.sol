pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract CoffeeNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    uint256 public tokenCounter = 0; // Counter for NFT IDs
    address public marketplaceContract;

    struct NFTMetadata {
        uint256 tokenId;
        string name;
        string description;
        string ipfsHash;
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

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string ipfsHash,
        uint256 price
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string name,
        string description,
        string ipfsHash,
        string origin,
        string roastLevel
    );

    modifier onlyMarketplace() {
        require(
            msg.sender == marketplaceContract,
            'Only marketplace can call this function'
        );
        _;
    }

    constructor() ERC721('CoffeeNFT', 'COFFEE') Ownable(msg.sender) {}

    function setMarketplaceContract(
        address _marketplaceContract
    ) external onlyOwner {
        require(
            _marketplaceContract != address(0),
            'Invalid marketplace address'
        );
        marketplaceContract = _marketplaceContract;
    }

    function mint(
        address to,
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 productId,
        uint256 price,
        string memory origin,
        string memory roastLevel,
        string memory beanType,
        string memory processMethod
    ) external onlyMarketplace returns (uint256) {
        tokenCounter++;
        uint256 tokenId = tokenCounter;

        // Create metadata for this token
        tokenMetadata[tokenId] = NFTMetadata({
            tokenId: tokenId,
            name: name,
            description: description,
            ipfsHash: ipfsHash,
            productId: productId,
            price: price,
            isActive: true,
            origin: origin,
            roastLevel: roastLevel,
            beanType: beanType,
            processMethod: processMethod,
            roastDate: block.timestamp
        });

        _safeMint(to, tokenId); // Assign NFT to the smart contract itself
        _setTokenURI(tokenId, ipfsHash); // IPFS hash as the token URI (metadata link)

        emit NFTMinted(tokenId, to, name, ipfsHash, price);

        return tokenId;
    }

    // Update NFT metadata (only by owner or product roaster)
    function updateNFTMetadata(
        uint256 tokenId,
        string memory newName,
        string memory newDescription,
        string memory newipfsHash,
        string memory newOrigin,
        string memory newRoastLevel,
        string memory newBeanType,
        string memory newProcessMethod
    ) external onlyMarketplace {
        ownerOf(tokenId); // This inherently checks if token exists

        NFTMetadata storage metadata = tokenMetadata[tokenId];
        metadata.name = newName;
        metadata.description = newDescription;
        metadata.ipfsHash = newipfsHash;
        metadata.origin = newOrigin;
        metadata.roastLevel = newRoastLevel;
        metadata.beanType = newBeanType;
        metadata.processMethod = newProcessMethod;

        emit MetadataUpdated(
            tokenId,
            newName,
            newDescription,
            newipfsHash,
            newOrigin,
            newRoastLevel
        );
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
            string memory ipfsHash,
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
        ownerOf(tokenId); // This inherently checks if token exists
        NFTMetadata memory metadata = tokenMetadata[tokenId];

        return (
            metadata.name,
            metadata.description,
            metadata.ipfsHash,
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
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    tokenIds[index] = i;
                    metadataArray[index] = tokenMetadata[i];
                    index++;
                }
            } catch {
                // Skip if token doesn't exist
                continue;
            }
        }
    }

    function setNFTPrice(
        uint256 tokenId,
        uint256 newPrice
    ) external onlyMarketplace {
        require(ownerOf(tokenId) != address(0), 'Token does not exist');
        tokenMetadata[tokenId].price = newPrice;
    }

    function setNFTActive(
        uint256 tokenId,
        bool isActive
    ) external onlyMarketplace {
        require(ownerOf(tokenId) != address(0), 'Token does not exist');
        tokenMetadata[tokenId].isActive = isActive;
    }
}
