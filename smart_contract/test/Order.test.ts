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

    // Deploy Order contract with initial values
    order = await OrderFactory.deploy();
    await order.waitForDeployment();

    // Add some sample orders for testing
    const sampleOrders = [
      {
        customer: await customer.getAddress(),
        productIds: [1, 2, 3],
        totalAmount: ethers.parseEther('1.0'),
        timestamp: Date.now(),
      },
      {
        customer: await customer.getAddress(),
        productIds: [4, 5],
        totalAmount: ethers.parseEther('0.5'),
        timestamp: Date.now(),
      },
    ];

    for (const sampleOrder of sampleOrders) {
      await order.createOrder(
        sampleOrder.customer,
        sampleOrder.productIds,
        sampleOrder.totalAmount,
        sampleOrder.timestamp
      );
    }
  });

  it('Should create a new order successfully', async function () {
    const orderId = 3;
    const productIds = [6, 7, 8];
    const totalAmount = ethers.parseEther('2.0');
    const timestamp = Date.now();

    // Call the createOrder function
    await expect(order.createOrder(await customer.getAddress(), productIds, totalAmount, timestamp))
      .to.emit(order, 'OrderCreated')
      .withArgs(orderId, await customer.getAddress(), totalAmount, timestamp);

    // Verify the order details
    const createdOrder = await order.getOrder(orderId);
    expect(createdOrder.orderId).to.equal(orderId);
    expect(createdOrder.customer).to.equal(await customer.getAddress());
    expect(createdOrder.productIds.length).to.equal(productIds.length);
    expect(createdOrder.totalAmount).to.equal(totalAmount);
    expect(createdOrder.isCompleted).to.be.false;
    expect(createdOrder.timestamp).to.equal(timestamp);
  });

  it('Should fail to create an order with zero total amount', async function () {
    const productIds = [9, 10];
    const totalAmount = 0;
    const timestamp = Date.now();

    await expect(
      order.createOrder(await customer.getAddress(), productIds, totalAmount, timestamp)
    ).to.be.revertedWith('Total amount must be greater than zero.');
  });

  it('Should fail to create an order without products', async function () {
    const productIds: number[] = [];
    const totalAmount = ethers.parseEther('1.0');
    const timestamp = Date.now();

    await expect(
      order.createOrder(await customer.getAddress(), productIds, totalAmount, timestamp)
    ).to.be.revertedWith('Order must contain at least one product.');
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

  it('Should allow viewing all created orders', async function () {
    const orders = await order.getOrder(1);
    expect(orders.orderId).to.equal(1);
    expect(orders.productIds.length).to.equal(3);
  });
});
