pragma solidity ^0.8.0;

contract Order {
    struct OrderDetail {
        uint256 orderId;
        address customer;
        uint256[] productIds;
        uint256 totalAmount;
        bool isCompleted;
        uint256 timestamp;
    }

    mapping(uint256 => OrderDetail) public orders;
    uint256 public orderCounter = 0;

    event OrderCreated(uint256 orderId, address customer, uint256 totalAmount, uint256 timestamp);
    event OrderCompleted(uint256 orderId);

    function createOrder(address _customer, uint256[] memory _productIds, uint256 _totalAmount, uint256 _timestamp) public returns (uint256) {
        require(_totalAmount > 0, "Total amount must be greater than zero.");
        require(_productIds.length > 0, "Order must contain at least one product.");

        orderCounter++;
        OrderDetail memory newOrder = OrderDetail({
            orderId: orderCounter,
            customer: _customer,
            productIds: _productIds,
            totalAmount: _totalAmount,
            isCompleted: false,
            timestamp: _timestamp
        });

        orders[orderCounter] = newOrder;

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
