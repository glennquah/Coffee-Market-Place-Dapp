// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Product.sol";  // Importing the Product contract

contract Cart {
    struct CartItem {
        uint256 productId;
        uint256 quantity;
    }

    mapping(address => CartItem[]) public carts;

    Product productContract;

    constructor(address _productContractAddress) {
        productContract = Product(_productContractAddress);  // Reference to the deployed Product contract
    }

    function addToCart(uint256 _productId, uint256 _quantity) public {
        // Check product availability and desired quantity
        ( , , , , uint256 availableQuantity, , bool available) = productContract.getListing(_productId);
        require(available, "Product is unavailable.");
        require(availableQuantity >= _quantity, "Not enough stock available.");

        // Add item to user's cart
        carts[msg.sender].push(CartItem(_productId, _quantity));
    }

    function viewCart() public view returns (CartItem[] memory) {
        return carts[msg.sender];
    }

    // update quantity
    function updateCart(uint256 _productId, uint256 _newQuantity) public {
        ( , , , , uint256 availableQuantity, , bool available) = productContract.getListing(_productId);
        require(available, "Product is not available.");
        require(availableQuantity >= _newQuantity, "Not enough stock available.");

        if (_newQuantity == 0) { // if the user sets _newQuantity as 0, we will assume the user is deleting that product from cart
            removeFromCart(_productId);
            return;
        }

        CartItem[] storage userCart = carts[msg.sender];
        bool itemFound = false;

        for (uint256 i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == _productId) {
                userCart[i].quantity = _newQuantity; 
                itemFound = true;
                break;
            }
        }

        require(itemFound, "Product not added in cart.");
    }

    // delete the unwanted product from cart
    function removeFromCart(uint256 _productId) public {
        CartItem[] storage userCart = carts[msg.sender];
        for (uint256 i = 0; i < userCart.length; i++) {
            if (userCart[i].productId == _productId) {
                userCart[i] = userCart[userCart.length - 1];
                userCart.pop();
                break;
            }
        }
    }

    // after the user has confirmed an order - different from removeFromCart()
    function clearCart() internal {
        delete carts[msg.sender];
    }
}
