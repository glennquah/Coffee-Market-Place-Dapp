// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Order {
    struct OrderItem {
        uint256 productId;
        uint256 quantity;
    }

    struct OrderDetail {
        uint256 orderId;
        address customer;
        OrderItem[] orderItems;
        uint256 totalAmount;
        bool isCompleted;
        uint256 timestamp;
    }

    constructor(
        address[] memory _customerAddresses,
        OrderItem[][] memory _orderItems,
        uint256[] memory _totalAmounts,
        uint256[] memory _timestamps
    ) {
        require(
            _customerAddresses.length == _orderItems.length &&
            _orderItems.length == _totalAmounts.length &&
            _totalAmounts.length == _timestamps.length,
            "Constructor input arrays must have the same length"
        );

        for (uint256 i = 0; i < _customerAddresses.length; i++) {
            orderCounter++;
            OrderDetail storage newOrder = orders[orderCounter];
            newOrder.orderId = orderCounter;
            newOrder.customer = _customerAddresses[i];
            newOrder.totalAmount = _totalAmounts[i];
            newOrder.isCompleted = false;
            newOrder.timestamp = _timestamps[i];

            for (uint256 j = 0; j < _orderItems[i].length; j++) {
                newOrder.orderItems.push(_orderItems[i][j]);
            }
        }
    }

    mapping(uint256 => OrderDetail) public orders;
    uint256 public orderCounter = 0;

    event OrderCreated(uint256 orderId, address customer, uint256 totalAmount, uint256 timestamp);
    event OrderCompleted(uint256 orderId);

    function createOrder(address _customer, OrderItem[] memory _items, uint256 _totalAmount, uint256 _timestamp) public returns (uint256 orderId) {
        require(_totalAmount > 0, "Total amount must be greater than zero.");
        require(_items.length > 0, "Order must contain at least one item.");

        orderCounter++;
        OrderDetail storage newOrder = orders[orderCounter];
        newOrder.orderId = orderCounter;
        newOrder.customer = _customer;
        newOrder.totalAmount = _totalAmount;
        newOrder.isCompleted = false;
        newOrder.timestamp = _timestamp;

        // Add each item to the order
        for (uint256 i = 0; i < _items.length; i++) {
            newOrder.orderItems.push(_items[i]);
        }

        emit OrderCreated(orderCounter, _customer, _totalAmount, _timestamp);

        return orderCounter;
    }

    function completeOrder(uint256 _orderId) public {
        require(orders[_orderId].orderId == _orderId, "Order does not exist.");
        require(!orders[_orderId].isCompleted, "Order is already completed.");

        orders[_orderId].isCompleted = true;

        emit OrderCompleted(_orderId);
    }

    function getOrder(uint256 _orderId) public view returns (OrderDetail memory) {
        require(orders[_orderId].orderId == _orderId, "Order does not exist.");
        return orders[_orderId];
    }
}
