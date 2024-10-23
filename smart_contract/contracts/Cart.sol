pragma solidity ^0.8.0;

import "./CoffeeMarketplace.sol"; 
import "./Product.sol";
import "./Order.sol";

contract Cart {
    CoffeeMarketplace public coffeeMarketplace;
    Order public orderContract;

    struct CartProduct {
        uint256 productId;
        uint256 quantity;
    }

    mapping(address => CartProduct[]) public carts;

    event ProductAddedToCart(address customer, uint256 productId, uint256 quantity);
    event ProductUpdatedInCart(address customer, uint256 productId, uint256 newQuantity);
    event ProductRemovedFromCart(address customer, uint256 productId);
    event CartCleared(address customer);
    event CartCheckout(address customer, uint256 finalisedCartId);
    event OrderCreated(address customer, uint256 orderId, bool isCompleted);

    constructor(address _coffeeMarketplaceContractAddress, address _orderContractAddress) {
        require(_coffeeMarketplaceContractAddress != address(0), "Invalid CoffeeMarketplace contract address");
        require(_orderContractAddress != address(0), "Invalid Order contract address");

        coffeeMarketplace = CoffeeMarketplace(_coffeeMarketplaceContractAddress);  // Reference to the deployed CoffeeMarketplace contract since is buying coffee beans from there
        orderContract = Order(_orderContractAddress);
    }

    // internal
    // after the customer has confirmed an order - different from removeFromCart()
    function clearCart() internal {
        delete carts[msg.sender];
        emit CartCleared(msg.sender);
    }

    // public
    function addToCart(uint256 _productId, uint256 _quantity) public {
        ( , , , , uint256 availableQuantity, , bool available) = coffeeMarketplace.getListing(_productId);
        require(available, "Product is not available.");
        require(availableQuantity >= _quantity, "Not enough stock available.");

        CartProduct[] storage customerCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < customerCart.length; i++) {
            if (customerCart[i].productId == _productId) {
                customerCart[i].quantity += _quantity;
                ProductFound = true;
                break;
            }
        }

        if (!ProductFound) {
            customerCart.push(CartProduct(_productId, _quantity));
        }

        emit ProductAddedToCart(msg.sender, _productId, _quantity);
    }

    function viewCart() public view returns (CartProduct[] memory) {
        return carts[msg.sender];
    }

    // update quantity
    function updateCart(uint256 _productId, uint256 _newQuantity) public {
        ( , , , , uint256 availableQuantity, , bool available) = coffeeMarketplace.getListing(_productId);
        require(available, "Product is not available.");
        require(availableQuantity >= _newQuantity, "Not enough stock available.");

        if (_newQuantity == 0) { // if the customer sets _newQuantity as 0, we will assume the customer is deleting that product from cart
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

        require(ProductFound, "Product not found in cart.");
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

        require(ProductFound, "Product not found in cart.");
    }

    function removeAllProductsFromCart() public {
        clearCart();
    }

    // Checkout function to create an order from the cart
    function checkout() public {
        require(carts[msg.sender].length > 0, "Cart is empty");
        
        // Get the cart of the customer
        CartProduct[] memory customerCart = carts[msg.sender];
        uint256 totalAmount = 0;

        // Calculate the total amount
        for (uint256 i = 0; i < customerCart.length; i++) {
            (, , , uint256 price, , , ) = coffeeMarketplace.getListing(customerCart[i].productId);
            totalAmount += price * customerCart[i].quantity;
        }

        // Create the order using the orderContract
        Order.OrderItem[] memory orderItems = new Order.OrderItem[](customerCart.length);
        
        for (uint256 i = 0; i < customerCart.length; i++) {
            orderItems[i] = Order.OrderItem({
                productId: customerCart[i].productId,
                quantity: customerCart[i].quantity
            });
        }

        uint256 orderId = orderContract.createOrder(msg.sender, orderItems, totalAmount, block.timestamp);

        // Clear the cart after checkout
        clearCart();
        
        // Emit a checkout event
        emit CartCheckout(msg.sender, orderId);
    }
}
