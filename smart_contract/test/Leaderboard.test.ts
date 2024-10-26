import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  Order,
  Order__factory,
  Leaderboard,
  Leaderboard__factory,
} from '../typechain-types';
import { orderSeedData } from '../ignition/modules/seed_data/orderSeedData';
import { deployContracts } from './test_setup/deployContract';

describe('Leaderboard Contract', function () {
  let order: Order;
  let leaderboard: Leaderboard;

  const customerOrders = orderSeedData.customerAddresses.map(
    (address, index) => ({
      address,
      items: orderSeedData.orderItems[index],
      totalAmount: orderSeedData.totalAmounts[index],
      timestamp: orderSeedData.timestamps[index],
    })
  );

  const [customer1Order, customer2Order, customer3Order, customer4Order] =
    customerOrders;

//   beforeEach(async function () {
//     const OrderFactory: Order__factory = (await ethers.getContractFactory(
//       'Order'
//     )) as Order__factory;
//     const LeaderboardFactory: Leaderboard__factory =
//       (await ethers.getContractFactory('Leaderboard')) as Leaderboard__factory;

//     // Deploy Order contract with initial seed data
//     order = await OrderFactory.deploy(
//       orderSeedData.customerAddresses,
//       orderSeedData.orderItems,
//       orderSeedData.totalAmounts,
//       orderSeedData.timestamps
//     );
//     await order.waitForDeployment();

//     // Deploy Leaderboard contract with address of deployed Order contract
//     leaderboard = await LeaderboardFactory.deploy(order.getAddress());
//     await leaderboard.waitForDeployment();

//     await order.setLeaderboardContract(leaderboard.getAddress());
//   });

  beforeEach(async function () {
    const contracts = await deployContracts();
    order = contracts.order;
    leaderboard = contracts.leaderboard;
  });

  async function createOrderFromData(orderData: {
    address: string;
    items: { productId: number; quantity: number }[];
    totalAmount: bigint;
    timestamp: number;
  }) {
    const { address, items, totalAmount, timestamp } = orderData;
    await order.createOrder(address, items, totalAmount, timestamp);
  }

  it('Should update leaderboard correctly', async function () {
    // Simulate creating orders that indirectly call updateLeaderboard
    await createOrderFromData(customer1Order);
    await createOrderFromData(customer2Order);

    // View leaderboard
    const leaderboardEntries = await leaderboard.viewLeaderboard();

    // Ensure leaderboard entries are correctly sorted and populated
    const topCustomer1 = leaderboardEntries[0];
    const topCustomer2 = leaderboardEntries[1];

    expect(topCustomer1.customer).to.equal(customer1Order.address);
    expect(topCustomer1.nftCount).to.equal(5);

    expect(topCustomer2.customer).to.equal(customer2Order.address);
    expect(topCustomer2.nftCount).to.equal(3);
  });

  it('Should reset leaderboard for new month', async function () {
    // Update leaderboard for the current month
    await ethers.provider.send('evm_increaseTime', [30 * 24 * 60 * 60]); // Advance by 30 days
    await createOrderFromData(customer1Order); // Add data for leaderboard

    await leaderboard.resetLeaderboard(); // Reset leaderboard for the new month

    // View leaderboard
    const leaderboardEntries = await leaderboard.viewLeaderboard();
    expect(leaderboardEntries[0].nftCount).to.equal(0);
    expect(leaderboardEntries[0].customer).to.equal(ethers.ZeroAddress);
  });

  it('Should correctly add a new customer to the leaderboard if they qualify', async function () {
    // Simulate customer3 acquiring NFTs
    await createOrderFromData(customer3Order); // customer3 acquires 6 NFTs

    // View leaderboard
    const leaderboardEntries = await leaderboard.viewLeaderboard();

    // Ensure customer3 is now in the leaderboard
    const topCustomer1 = leaderboardEntries[0];
    expect(topCustomer1.customer).to.equal(customer3Order.address);
    expect(topCustomer1.nftCount).to.equal(6);
  });

  it('Should replace the lowest leaderboard entry if new customer exceeds it', async function () {
    // Simulate customer1 and customer2 acquiring NFTs
    await createOrderFromData(customer1Order);
    await createOrderFromData(customer2Order);

    // Simulate customer3 acquiring more NFTs than customer2
    await createOrderFromData(customer3Order);

    // View leaderboard
    const leaderboardEntries = await leaderboard.viewLeaderboard();

    // Ensure customer3 replaced customer2 in the leaderboard
    const topCustomer1 = leaderboardEntries[0];
    const topCustomer2 = leaderboardEntries[1];

    expect(topCustomer1.customer).to.equal(customer3Order.address);
    expect(topCustomer1.nftCount).to.equal(6);

    expect(topCustomer2.customer).to.equal(customer1Order.address);
    expect(topCustomer2.nftCount).to.equal(5);
  });

  it('Should handle multiple customers with equal NFT counts', async function () {
    // Simulate customer1 and customer2 acquiring equal number of NFTs
    await createOrderFromData(customer1Order);
    await createOrderFromData(customer4Order);

    // View leaderboard
    const leaderboardEntries = await leaderboard.viewLeaderboard();

    // Ensure both customers are in the leaderboard
    const topCustomer1 = leaderboardEntries[0];
    const topCustomer2 = leaderboardEntries[1];

    expect(topCustomer1.nftCount).to.equal(5);
    expect(topCustomer2.nftCount).to.equal(5);
  });
});
