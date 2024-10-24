pragma solidity ^0.8.0;

contract Product {
    // Counter for product IDs
    uint256 public productCounter = 0;

    // Struct to store product details
    struct ProductDetails {
        uint256 productId;
        address roaster;
        string name;
        string description;
        string ipfsHash;  // IPFS hash for product image/metadata
        uint256 price;     // Price in Wei (Ether)
        uint256 quantity;
        uint256[] nftIds;  // Array of NFT IDs for this product
        bool available;
        bool isFeaturedCoffee;
    }

    // Mapping to store products
    mapping(uint256 => ProductDetails) public products;

    // Events
    event ProductAdded(uint256 productId, address indexed roaster, string name, uint256 price, uint256 quantity);
    event ListingQuantityUpdated(uint256 productId, uint256 oldQuantity, uint256 newQuantity);
    
    constructor(address[] memory _roasters, 
                string[] memory _names, 
                string[] memory _descriptions, 
                string[] memory _ipfsHashes, 
                uint256[] memory _prices, 
                uint256[] memory _quantities, 
                uint256[][] memory _nftIds) 
    {
        for (uint256 i = 0; i < _roasters.length; i++) {
            productCounter++;
            products[productCounter] = ProductDetails(
                productCounter,
                _roasters[i],
                _names[i],
                _descriptions[i],
                _ipfsHashes[i],
                _prices[i],
                _quantities[i],
                _nftIds[i],
                true,
                false
            );
        }
    }

    // Function to add a new product
    function addProduct(
        address _roaster,
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        uint256 _price,
        uint256 _quantity,
        uint256[] memory _nftIds
    ) public returns (uint256) {
        require(_price > 0, "Price must be greater than zero.");
        require(_quantity > 0, "Quantity must be greater than zero.");

        productCounter++;

        products[productCounter] = ProductDetails(
            productCounter,
            _roaster,
            _name,
            _description,
            _ipfsHash,
            _price,
            _quantity,
            _nftIds,
            true,
            false
        );

        emit ProductAdded(productCounter, _roaster, _name, _price, _quantity);
        return productCounter;
    }

    // Function to get product details
    function getProduct(uint256 _productId) public view returns (
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 price,
        uint256 quantity,
        uint256[] memory nftIds,
        bool available
    ) {
        ProductDetails memory product = products[_productId];
        require(product.productId > 0, "Product does not exist.");

        return (
            product.name,
            product.description,
            product.ipfsHash,
            product.price,
            product.quantity,
            product.nftIds,
            product.available
        );
    }

    function updateListingQuantity(uint256 _productId, uint256 _newQuantity) public {
        require(products[_productId].productId != 0, "Product does not exist");
        require(_newQuantity >= 0, "Quantity cannot be negative");
        
        uint256 oldQuantity = products[_productId].quantity;
        products[_productId].quantity = _newQuantity;

        emit ListingQuantityUpdated(_productId, oldQuantity, _newQuantity);
    }
}
