import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { Order, Order__factory } from '../typechain-types';

describe('Order Contract', function () {
  let order: Order;
  let owner: Signer;
  let customer: Signer;

  beforeEach(async function () {
    const OrderFactory: Order__factory = (await ethers.getContractFactory('Order')) as Order__factory;
    [owner, customer] = await ethers.getSigners();

    // Deploy Order contract
    order = await OrderFactory.deploy(
      [await customer.getAddress(), await customer.getAddress()],
      [
        [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 },
        ],
        [
          { productId: 4, quantity: 1 },
          { productId: 5, quantity: 2 },
        ],
      ],
      [ethers.parseEther('1.0'), ethers.parseEther('0.5')],
      [Date.now(), Date.now()]
    );
    await order.waitForDeployment();
  });

  it('Should create a new order successfully', async function () {
    const orderId = 3; // Order ID will be 3, after two pre-existing orders
    const orderItems = [
      { productId: 6, quantity: 1 },
      { productId: 7, quantity: 2 },
    ];
    const totalAmount = ethers.parseEther('2.0');
    const timestamp = Date.now();

    // Call the createOrder function
    await expect(order.createOrder(await customer.getAddress(), orderItems, totalAmount, timestamp))
      .to.emit(order, 'OrderCreated')
      .withArgs(orderId, await customer.getAddress(), totalAmount, timestamp);

    // Verify the order details
    const createdOrder = await order.getOrder(orderId);
    expect(createdOrder.orderId).to.equal(orderId);
    expect(createdOrder.customer).to.equal(await customer.getAddress());
    expect(createdOrder.orderItems.length).to.equal(orderItems.length);
    expect(createdOrder.totalAmount).to.equal(totalAmount);
    expect(createdOrder.isCompleted).to.be.false;
    expect(createdOrder.timestamp).to.equal(timestamp);

    // Verify each item in the order
    for (let i = 0; i < orderItems.length; i++) {
      const item = await createdOrder.orderItems[i];
      expect(item.productId).to.equal(orderItems[i].productId);
      expect(item.quantity).to.equal(orderItems[i].quantity);
    }
  });

  it('Should fail to create an order with zero total amount', async function () {
    const orderItems = [{ productId: 9, quantity: 1 }];
    const totalAmount = 0;
    const timestamp = Date.now();

    await expect(
      order.createOrder(await customer.getAddress(), orderItems, totalAmount, timestamp)
    ).to.be.revertedWith('Total amount must be greater than zero.');
  });

  it('Should fail to create an order without products', async function () {
    const orderItems: any[] = [];
    const totalAmount = ethers.parseEther('1.0');
    const timestamp = Date.now();

    await expect(
      order.createOrder(await customer.getAddress(), orderItems, totalAmount, timestamp)
    ).to.be.revertedWith('Order must contain at least one item.');
  });

  it('Should mark an order as completed successfully', async function () {
    const orderId = 1;

    // Mark the order as completed
    await expect(order.completeOrder(orderId))
      .to.emit(order, 'OrderCompleted')
      .withArgs(orderId);

    // Verify that the order is completed
    const completedOrder = await order.getOrder(orderId);
    expect(completedOrder.isCompleted).to.be.true;
  });

  it('Should revert when trying to complete a non-existent order', async function () {
    const nonExistentOrderId = 999;
    await expect(order.completeOrder(nonExistentOrderId)).to.be.revertedWith('Order does not exist.');
  });

  it('Should allow viewing an existing order', async function () {
    const orderId = 1;
    const orderDetails = await order.getOrder(orderId);
    expect(orderDetails.orderId).to.equal(orderId);
    expect(orderDetails.orderItems.length).to.equal(2); // The order contains 2 items
    expect(orderDetails.customer).to.equal(await customer.getAddress());
  });
});
