pragma solidity ^0.8.0;

import "./CoffeeMarketplace.sol"; 

contract Cart {
    CoffeeMarketplace public coffeeMarketplace;

    struct CartProduct {
        uint256 productId;
        uint256 quantity;
    }

    mapping(address => CartProduct[]) public carts;

    event ProductAddedToCart(address user, uint256 productId, uint256 quantity);
    event ProductUpdatedInCart(address user, uint256 productId, uint256 newQuantity);
    event ProductRemovedFromCart(address user, uint256 productId);
    event CartCleared(address user);

    constructor(address _coffeeMarketplaceContractAddress) {
        coffeeMarketplace = CoffeeMarketplace(_coffeeMarketplaceContractAddress);  // Reference to the deployed Product contract
    }

    // internal
    // after the user has confirmed an order - different from removeFromCart()
    function clearCart() internal {
        delete carts[msg.sender];
        emit CartCleared(msg.sender);
    }

    // public
    function addToCart(uint256 _productId, uint256 _quantity) public {
        ( , , , , uint256 availableQuantity, , bool available) = coffeeMarketplace.getListing(_productId);
        require(available, "Product is not available.");
        require(availableQuantity >= _quantity, "Not enough stock available.");

        CartProduct[] storage userCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == _productId) {
                userCart[i].quantity += _quantity;
                ProductFound = true;
                break;
            }
        }

        if (!ProductFound) {
            userCart.push(CartProduct(_productId, _quantity));
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

        if (_newQuantity == 0) { // if the user sets _newQuantity as 0, we will assume the user is deleting that product from cart
            removeFromCart(_productId);
            return;
        }

        CartProduct[] storage userCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == _productId) {
                userCart[i].quantity = _newQuantity; // Update quantity
                ProductFound = true;
                emit ProductUpdatedInCart(msg.sender, _productId, _newQuantity);
                break;
            }
        }

        require(ProductFound, "Product not found in cart.");
    }

    // delete the unwanted product from cart
    function removeFromCart(uint256 _productId) public {
        CartProduct[] storage userCart = carts[msg.sender];
        bool ProductFound = false;

        for (uint256 i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == _productId) {
                userCart[i] = userCart[userCart.length - 1];
                userCart.pop();
                ProductFound = true;
                emit ProductRemovedFromCart(msg.sender, _productId); 
                break;
            }
        }

        require(ProductFound, "Product not found in cart.");
    }

    function checkout() public {
        clearCart();
    }
}
