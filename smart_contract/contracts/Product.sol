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
        string ipfsHash; // IPFS hash for product image/metadata
        uint256 price; // Price in Wei (Ether)
        uint256 quantity;
        uint256[] nftIds; // Array of NFT IDs for this product
        bool available;
        string origin; // Country/region of origin
        string roastLevel; // Light, Medium, Dark, etc.
        string beanType; // Arabica, Robusta, etc.
        string processMethod; // Washed, Natural, Honey, etc.
        uint256 roastDate; // Timestamp of roasting
        bool isFeaturedCoffee;
    }

    // Mapping to store products
    mapping(uint256 => ProductDetails) public products;

    // Mapping to track NFT to Product relationship
    mapping(uint256 => uint256) public nftToProduct;

    // Events
    event ProductAdded(
        uint256 productId,
        address indexed roaster,
        string name,
        uint256 price,
        uint256 quantity,
        string origin,
        string roastLevel
    );

    event ListingQuantityUpdated(
        uint256 productId,
        uint256 oldQuantity,
        uint256 newQuantity
    );

    event ProductMetadataUpdated(
        uint256 indexed productId,
        string name,
        string description,
        string ipfsHash
    );

    constructor(
        address[] memory _roasters,
        string[] memory _names,
        string[] memory _descriptions,
        string[] memory _ipfsHashes,
        uint256[] memory _prices,
        uint256[] memory _quantities,
        uint256[][] memory _nftIds,
        string[] memory _origins,
        string[] memory _roastLevels,
        string[] memory _beanTypes,
        string[] memory _processMethods,
        uint256[] memory _roastDates
    ) {
        require(_roasters.length > 0, 'Must provide at least one product');
        require(
            _roasters.length == _names.length &&
                _names.length == _descriptions.length &&
                _descriptions.length == _ipfsHashes.length &&
                _ipfsHashes.length == _prices.length &&
                _prices.length == _quantities.length &&
                _quantities.length == _nftIds.length &&
                _nftIds.length == _origins.length &&
                _origins.length == _roastLevels.length &&
                _roastLevels.length == _beanTypes.length &&
                _beanTypes.length == _processMethods.length &&
                _processMethods.length == _roastDates.length,
            'Array lengths must match'
        );

        for (uint256 i = 0; i < _roasters.length; i++) {
            productCounter++;
            products[productCounter] = ProductDetails({
                productId: productCounter,
                roaster: _roasters[i],
                name: _names[i],
                description: _descriptions[i],
                ipfsHash: _ipfsHashes[i],
                price: _prices[i],
                quantity: _quantities[i],
                nftIds: _nftIds[i],
                available: true,
                origin: _origins[i],
                roastLevel: _roastLevels[i],
                beanType: _beanTypes[i],
                processMethod: _processMethods[i],
                roastDate: _roastDates[i],
                isFeaturedCoffee: false
            });

            // Map each NFT to this product
            for (uint256 j = 0; j < _nftIds[i].length; j++) {
                nftToProduct[_nftIds[i][j]] = productCounter;
            }
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
        uint256[] memory _nftIds,
        string memory _origin,
        string memory _roastLevel,
        string memory _beanType,
        string memory _processMethod
    ) public returns (uint256) {
        require(_price > 0, 'Price must be greater than zero');
        require(_quantity > 0, 'Quantity must be greater than zero');
        require(bytes(_name).length > 0, 'Name cannot be empty');
        require(bytes(_ipfsHash).length > 0, 'Image URI cannot be empty');

        productCounter++;

        products[productCounter] = ProductDetails({
            productId: productCounter,
            roaster: _roaster,
            name: _name,
            description: _description,
            ipfsHash: _ipfsHash,
            price: _price,
            quantity: _quantity,
            nftIds: _nftIds,
            available: true,
            origin: _origin,
            roastLevel: _roastLevel,
            beanType: _beanType,
            processMethod: _processMethod,
            roastDate: block.timestamp,
            isFeaturedCoffee: false
        });

        // Map each NFT to this product
        for (uint256 i = 0; i < _nftIds.length; i++) {
            nftToProduct[_nftIds[i]] = productCounter;
        }

        emit ProductAdded(
            productCounter,
            _roaster,
            _name,
            _price,
            _quantity,
            _origin,
            _roastLevel
        );
        return productCounter;
    }

    // Function to get product details
    function getProduct(
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
        ProductDetails memory product = products[_productId];
        require(product.productId > 0, 'Product does not exist.');

        return (
            product.name,
            product.description,
            product.ipfsHash,
            product.price,
            product.quantity,
            product.nftIds,
            product.available,
            product.origin,
            product.roastLevel,
            product.beanType,
            product.processMethod,
            product.roastDate
        );
    }

    function getProductRoaster(
        uint256 _productId
    ) public view returns (address) {
        require(products[_productId].productId > 0, 'Product does not exist.');
        return products[_productId].roaster;
    }

    function getProductIdByNFT(uint256 _tokenId) public view returns (uint256) {
        uint256 productId = nftToProduct[_tokenId];
        require(productId > 0, 'NFT not associated with any product');
        return productId;
    }

    function updateListingQuantity(
        uint256 _productId,
        uint256 _newQuantity
    ) public {
        require(products[_productId].productId != 0, 'Product does not exist');
        require(_newQuantity >= 0, 'Quantity cannot be negative');

        uint256 oldQuantity = products[_productId].quantity;
        products[_productId].quantity = _newQuantity;

        emit ListingQuantityUpdated(_productId, oldQuantity, _newQuantity);
    }

    function updateQuantityAfterTransfer(uint256 _productId) public {
        require(products[_productId].productId != 0, 'Product does not exist');
        uint256 oldQuantity = products[_productId].quantity;
        require(oldQuantity > 0, 'No quantity available');

        uint256 newQuantity = oldQuantity - 1;
        products[_productId].quantity = newQuantity;
        if (newQuantity == 0) {
            products[_productId].available = false;
        }

        emit ListingQuantityUpdated(_productId, oldQuantity, newQuantity);
    }

    function updateProductMetadata(
        uint256 _productId,
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        string memory _origin,
        string memory _roastLevel,
        string memory _beanType,
        string memory _processMethod
    ) public {
        require(products[_productId].productId != 0, 'Product does not exist');
        require(
            msg.sender == products[_productId].roaster,
            'Only roaster can update metadata'
        );

        ProductDetails storage product = products[_productId];
        product.name = _name;
        product.description = _description;
        product.ipfsHash = _ipfsHash;
        product.origin = _origin;
        product.roastLevel = _roastLevel;
        product.beanType = _beanType;
        product.processMethod = _processMethod;

        emit ProductMetadataUpdated(_productId, _name, _description, _ipfsHash);
    }
}
