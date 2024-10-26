import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import {
  CoffeeMarketplace,
  CoffeeMarketplace__factory,
  Product,
  Product__factory,
  Leaderboard,
  Leaderboard__factory,
  Order,
  Order__factory,
} from '../typechain-types';
import { deployContracts } from './test_setup/deployContract';
import { orderSeedData } from '../ignition/modules/seed_data/orderSeedData';

describe('CoffeeMarketplace', function () {
  let coffeeMarketplace: CoffeeMarketplace;
  let product: Product;
  let owner: Signer;
  let roaster: Signer;
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

  const [customer1Order, customer2Order, customer3Order] = customerOrders;

  // beforeEach(async function () {
  //   const CoffeeMarketplaceFactory: CoffeeMarketplace__factory =
  //     (await ethers.getContractFactory(
  //       'CoffeeMarketplace'
  //     )) as CoffeeMarketplace__factory;

  //   const ProductFactory: Product__factory = (await ethers.getContractFactory(
  //     'Product'
  //   )) as Product__factory;

  //   const OrderFactory: Order__factory = (await ethers.getContractFactory(
  //     'Order'
  //   )) as Order__factory;

  //   const LeaderboardFactory: Leaderboard__factory =
  //     (await ethers.getContractFactory('Leaderboard')) as Leaderboard__factory;

  //   [owner, roaster] = await ethers.getSigners();

  //   const roasters = [
  //     '0x1234567890abcdef1234567890abcdef12345678',
  //     '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  //     '0x9876543210abcdef9876543210abcdef98765432',
  //     '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
  //     '0x1111111111111111111111111111111111111111',
  //   ];

  //   const names = [
  //     'Colombian Coffee',
  //     'Brazilian Santos',
  //     'Costa Rican Tarrazu',
  //     'Kenya AA',
  //     'Guatemala Antigua',
  //   ];

  //   const descriptions = [
  //     'Best Colombian Coffee',
  //     'A smooth coffee with mild acidity and balanced flavor.',
  //     'Rich body and flavor with notes of chocolate and citrus.',
  //     'Full-bodied coffee with wine-like acidity and berry flavors.',
  //     'Smooth and balanced with notes of cocoa and nuts.',
  //   ];

  //   const ipfsHashes = [
  //     'https://example.com/columbian.png',
  //     'https://example.com/brazil.png',
  //     'https://example.com/costa_rica.png',
  //     'https://example.com/kenya.png',
  //     'https://example.com/guatemala.png',
  //   ];

  //   const prices = [
  //     ethers.parseEther('0.1'), // 0.1 ETH
  //     ethers.parseEther('0.03'), // 0.03 ETH
  //     ethers.parseEther('0.025'), // 0.025 ETH
  //     ethers.parseEther('0.04'), // 0.04 ETH
  //     ethers.parseEther('0.015'), // 0.015 ETH
  //   ];

  //   const quantities = [5, 10, 15, 20, 30];

  //   const nftIds = [
  //     // can be any number of elements in the arr since the main initialisation of nftIds is addRoasterListing() in CoffeeMarketplace.sol
  //     [1, 2, 3],
  //     [4, 5, 6],
  //     [7, 8, 9],
  //     [10, 11, 12],
  //     [13, 14, 15],
  //   ];

  //   product = await ProductFactory.deploy(
  //     roasters,
  //     names,
  //     descriptions,
  //     ipfsHashes,
  //     prices,
  //     quantities,
  //     nftIds
  //   );

  //   order = await OrderFactory.deploy(
  //     orderSeedData.customerAddresses,
  //     orderSeedData.orderItems,
  //     orderSeedData.totalAmounts,
  //     orderSeedData.timestamps
  //   );
  //   await order.waitForDeployment();

  //   // Deploy Leaderboard contract
  //   leaderboard = await LeaderboardFactory.deploy(order);
  //   await leaderboard.waitForDeployment();

  //   await order.setLeaderboardContract(leaderboard.getAddress());

  //   coffeeMarketplace = await CoffeeMarketplaceFactory.deploy(product, leaderboard);
  //   await coffeeMarketplace.waitForDeployment();
  // });

  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeMarketplace = contracts.coffeeMarketplace;
    product = contracts.product;
    order = contracts.order;
    leaderboard = contracts.leaderboard;
    owner = contracts.owner;
    roaster = contracts.roaster;
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

  it('Should allow roaster to add product and mint NFTs', async function () {
    const ipfsHash: string = 'https://example.com/panama.png'; // Dummy IPFS hash
    const price = ethers.parseEther('0.1'); // 0.1 ETH
    const quantity: number = 5; // Mint 5 NFTs

    // Add a product from the roaster's address
    await expect(
      coffeeMarketplace
        .connect(roaster)
        .addRoasterListing(
          'Panama Geisha',
          'Delicate, jasmine-like aroma with hints of peach.',
          ipfsHash,
          price,
          quantity
        )
    ).to.emit(coffeeMarketplace, 'ListingAdded');

    // Check if the product was added successfully
    const product = await coffeeMarketplace.getListing(6); // Listing ID will be 6, after 5 pre-existing listings
    expect(product.name).to.equal('Panama Geisha');
    expect(product.description).to.equal(
      'Delicate, jasmine-like aroma with hints of peach.'
    );
    expect(product.ipfsHash).to.equal(ipfsHash);
    expect(product.price).to.equal(price);
    expect(product.quantity).to.equal(quantity);
    expect(product.available).to.be.true;

    // Iterate over each NFT ID and verify ownership and metadata
    for (let i = 0; i < product.nftIds.length; i++) {
      const tokenId = product.nftIds[i];
      expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
        await coffeeMarketplace.getAddress()
      );
      expect(await coffeeMarketplace.tokenURI(tokenId)).to.equal(ipfsHash);
    }
  });

  it('Should revert when trying to add product with zero price or quantity', async function () {
    const ipfsHash: string = 'https://example.com/panama.png';
    const zeroPrice = ethers.parseEther('0'); // 0 ETH
    const zeroQuantity: number = 0; // Invalid quantity

    await expect(
      coffeeMarketplace
        .connect(roaster)
        .addRoasterListing(
          'Panama Geisha',
          'Delicate, jasmine-like aroma with hints of peach.',
          ipfsHash,
          zeroPrice,
          5
        )
    ).to.be.revertedWith('Price must be greater than zero.');

    await expect(
      coffeeMarketplace
        .connect(roaster)
        .addRoasterListing(
          'Panama Geisha',
          'Delicate, jasmine-like aroma with hints of peach.',
          ipfsHash,
          ethers.parseEther('0.1'),
          zeroQuantity
        )
    ).to.be.revertedWith('Quantity must be greater than zero.');
  });

  it('Should allow viewing product details', async function () {
    const ipfsHash: string = 'https://example.com/columbian.png';
    const price = ethers.parseEther('0.1');
    const quantity: number = 5;

    // Fetch the product details
    const product = await coffeeMarketplace.getListing(1);

    expect(product.name).to.equal('Colombian Coffee');
    expect(product.description).to.equal('Best Colombian Coffee');
    expect(product.ipfsHash).to.equal(ipfsHash);
    expect(product.price).to.equal(price);
    expect(product.quantity).to.equal(quantity);
    expect(product.available).to.be.true;
  });

  it('Should distribute monthly rewards to top 3 customers using Chainlink Keeper', async function () {
    // Simulate top customers in the leaderboard
    await createOrderFromData(customer1Order);
    await createOrderFromData(customer2Order);
    await createOrderFromData(customer3Order);

    // Fast forward time by 31 days
    await ethers.provider.send('evm_increaseTime', [31 * 24 * 60 * 60]); // Advance 31 days
    await ethers.provider.send('evm_mine', []); // Mine the next block

    // Trigger Chainlink upkeep manually
    await coffeeMarketplace.performUpkeep('0x');

    // Verify that reward NFTs were distributed to top 3 customers
    const tokenCounter = await coffeeMarketplace.tokenCounter();
    expect(await coffeeMarketplace.ownerOf(Number(tokenCounter) - 2)).to.equal(
      customer3Order.address
    );
    expect(await coffeeMarketplace.ownerOf(Number(tokenCounter) - 1)).to.equal(
      customer1Order.address
    );
    expect(await coffeeMarketplace.ownerOf(tokenCounter)).to.equal(
      customer2Order.address
    );
  });

  it('Should not allow performUpkeep before 30 days', async function () {
    // Fast forward time by less than 30 days
    await ethers.provider.send('evm_increaseTime', [15 * 24 * 60 * 60]); // Advance 15 days
    await ethers.provider.send('evm_mine', []); // Mine the next block

    // Attempt to trigger Chainlink upkeep manually
    await expect(coffeeMarketplace.performUpkeep('0x')).to.be.revertedWith(
      'Reward distribution is not available yet'
    );
  });
});
