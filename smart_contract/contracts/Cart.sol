pragma solidity ^0.8.0;

import './CoffeeMarketplace.sol';
import './Product.sol';
import './Order.sol';

contract Cart {
    CoffeeMarketplace public coffeeMarketplace;
    Order public orderContract;

    struct CartProduct {
        uint256 productId;
        uint256 quantity;
        string name;
        string ipfsHash;
        uint256 price;
        string origin;
        string roastLevel;
        string beanType;
        string processMethod;
    }

    mapping(address => CartProduct[]) public carts;
    mapping(address => Order[]) public orders;
    // mapping(address => mapping(uint256 => CartProduct[])) public customerCheckouts; // customers who have placed an order
    // mapping(address => uint256[]) public customerFinalisedCartIds;
    uint256 public nextFinalisedCartId = 1;

    event ProductAddedToCart(
        address customer,
        uint256 productId,
        uint256 quantity
    );
    event ProductUpdatedInCart(
        address customer,
        uint256 productId,
        uint256 newQuantity
    );
    event ProductRemovedFromCart(address customer, uint256 productId);
    event CartCleared(address customer);
    event CartCheckout(address customer, uint256 finalisedCartId);
    event OrderCreated(address customer, uint256 orderId, bool isCompleted);

    constructor(
        address _coffeeMarketplaceContractAddress,
        address _orderContractAddress
    ) {
        require(
            _coffeeMarketplaceContractAddress != address(0),
            'Invalid CoffeeMarketplace contract address'
        );
        require(
            _orderContractAddress != address(0),
            'Invalid Order contract address'
        );

        coffeeMarketplace = CoffeeMarketplace(
            _coffeeMarketplaceContractAddress
        ); // Reference to the deployed CoffeeMarketplace contract since is buying coffee beans from there
        orderContract = Order(_orderContractAddress);
    }

    // getter
    // function getCustomerCheckouts(address _customer) public view returns (uint256[] memory, CartProduct[][] memory) {
    //     uint256[] memory finalisedCartIds = customerFinalisedCartIds[_customer];
    //     CartProduct[][] memory checkouts = new CartProduct[][](finalisedCartIds.length);

    //     for (uint256 i = 0; i < finalisedCartIds.length; i++) {
    //         checkouts[i] = customerCheckouts[_customer][finalisedCartIds[i]];
    //     }

    //     return (finalisedCartIds, checkouts);
    // }

    // internal
    // after the customer has confirmed an order - different from removeFromCart()
    function clearCart() internal {
        delete carts[msg.sender];
        emit CartCleared(msg.sender);
    }

    // public
    function addToCart(uint256 _productId, uint256 _reqQuantity) public {
        (string memory name,
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
            uint256 roastDate) = coffeeMarketplace.getListing(_productId);
        require(available, "Product is not available.");
        require(quantity >= _reqQuantity, "Not enough stock available.");

        CartProduct[] storage customerCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < customerCart.length; i++) {
            if (customerCart[i].productId == _productId) {
                customerCart[i].quantity += _reqQuantity;
                ProductFound = true;
                break;
            }
        }

        // if (!ProductFound) {
        //     customerCart.push(CartProduct(_productId, _reqQuantity));
        // }

        emit ProductAddedToCart(msg.sender, _productId, _reqQuantity);
    }

    function viewCart() public view returns (CartProduct[] memory) {
        return carts[msg.sender];
    }

    // update quantity
    function updateCart(uint256 _productId, uint256 _newQuantity) public {
        (string memory name,
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
        ) = coffeeMarketplace.getListing(_productId);
        require(available, 'Product is not available.');
        require(quantity >= _newQuantity, "Not enough stock available.");

        if (_newQuantity == 0) {
            // if the customer sets _newQuantity as 0, we will assume the customer is deleting that product from cart
            removeFromCart(_productId);
            return;
        }

        CartProduct[] storage customerCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < customerCart.length; i++) {
            if (customerCart[i].productId == _productId) {
                customerCart[i].quantity = _newQuantity; // Update quantity
                ProductFound = true;
                emit ProductUpdatedInCart(msg.sender, _productId, _newQuantity);
                break;
            }
        }

        require(ProductFound, 'Product not found in cart.');
    }

    // delete the unwanted product from cart
    function removeFromCart(uint256 _productId) public {
        CartProduct[] storage customerCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < customerCart.length; i++) {
            if (customerCart[i].productId == _productId) {
                customerCart[i] = customerCart[customerCart.length - 1];
                customerCart.pop();
                ProductFound = true;
                emit ProductRemovedFromCart(msg.sender, _productId);
                break;
            }
        }

        require(ProductFound, 'Product not found in cart.');
    }

    function removeAllProductsFromCart() public {
        clearCart();
    }

    // Checkout function to create an order from the cart
    function checkout() public {
        require(carts[msg.sender].length > 0, 'Cart is empty');

        // Get the cart of the customer
        CartProduct[] memory customerCart = carts[msg.sender];
        uint256 totalAmount = 0;

        // Calculate the total amount
        for (uint256 i = 0; i < customerCart.length; i++) {
            (string memory name,
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
            uint256 roastDate) = coffeeMarketplace.getListing(
                customerCart[i].productId
            );
            totalAmount += price * customerCart[i].quantity;
        }

        // Create the order using the orderContract
        Order.OrderItem[] memory orderItems = new Order.OrderItem[](
            customerCart.length
        );

        for (uint256 i = 0; i < customerCart.length; i++) {
            orderItems[i] = Order.OrderItem({
                productId: customerCart[i].productId,
                quantity: customerCart[i].quantity
            });
        }

        uint256 orderId = orderContract.createOrder(
            msg.sender,
            orderItems,
            totalAmount,
            block.timestamp
        );

        // Clear the cart after checkout
        clearCart();

        // Emit a checkout event
        emit CartCheckout(msg.sender, orderId);
    }

    // function getCheckout(address customer, uint256 finalisedCartId) public view returns (CartProduct[] memory) {
    //     require(customerCheckouts[customer][finalisedCartId].length > 0, "Order does not exist");
    //     return customerCheckouts[customer][finalisedCartId];
    // }

    // function getcustomerCheckoutIds(address customer) public view returns (uint256[] memory) {
    //     return customerFinalisedCartIds[customer];
    // }
}
