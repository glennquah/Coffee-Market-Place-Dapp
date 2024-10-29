import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { orderSeedData } from '../../ignition/modules/seed_data/orderSeedData';
import { productSeedData } from '../../ignition/modules/seed_data/productSeedData';
import { votingSeedData } from '../../ignition/modules/seed_data/votingSeedData';
import {
  Cart,
  Cart__factory,
  CoffeeMarketplace,
  CoffeeMarketplace__factory,
  CoffeeNFT,
  CoffeeNFT__factory,
  Hash,
  Hash__factory,
  Leaderboard,
  Leaderboard__factory,
  Order,
  Order__factory,
  Product,
  Product__factory,
  SealedAuction,
  SealedAuction__factory,
  Voting,
  Voting__factory,
} from '../../typechain-types';

export async function deployContracts(): Promise<{
  coffeeMarketplace: CoffeeMarketplace;
  product: Product;
  order: Order;
  leaderboard: Leaderboard;
  coffeeVoting: Voting;
  cart: Cart;
  coffeeNFT: CoffeeNFT;
  owner: Signer;
  roaster: Signer;
  buyer: Signer;
  secondBuyer: Signer;
  customer1: Signer;
  customer2: Signer;
  marketplaceOperator: Signer;
  coffeeAuction: SealedAuction;
  hash: Hash;
}> {
  const ProductFactory: Product__factory = (await ethers.getContractFactory(
    'Product',
  )) as Product__factory;
  const OrderFactory: Order__factory = (await ethers.getContractFactory(
    'Order',
  )) as Order__factory;
  const CoffeeMarketplaceFactory: CoffeeMarketplace__factory =
    (await ethers.getContractFactory(
      'CoffeeMarketplace',
    )) as CoffeeMarketplace__factory;
  const LeaderboardFactory: Leaderboard__factory =
    (await ethers.getContractFactory('Leaderboard')) as Leaderboard__factory;
  const VotingFactory: Voting__factory = (await ethers.getContractFactory(
    'Voting',
  )) as Voting__factory;
  const CartFactory: Cart__factory = (await ethers.getContractFactory(
    'Cart',
  )) as Cart__factory;
  const CoffeeNFTFactory: CoffeeNFT__factory = (await ethers.getContractFactory(
    'CoffeeNFT',
  )) as CoffeeNFT__factory;
  const SealedAuction: SealedAuction__factory =
    (await ethers.getContractFactory(
      'SealedAuction',
    )) as SealedAuction__factory;
  const HashFactory: Hash__factory = (await ethers.getContractFactory(
    'Hash',
  )) as Hash__factory;

  const [
    owner,
    roaster,
    buyer,
    secondBuyer,
    customer1,
    customer2,
    marketplaceOperator,
  ] = await ethers.getSigners();

  const product = await ProductFactory.deploy(
    productSeedData.roasters,
    productSeedData.names,
    productSeedData.descriptions,
    productSeedData.ipfsHashes,
    productSeedData.prices,
    productSeedData.quantities,
    productSeedData.nftIds,
    productSeedData.origins,
    productSeedData.roastLevels,
    productSeedData.beanTypes,
    productSeedData.processMethods,
    productSeedData.roastDates,
  );
  await product.waitForDeployment();

  const order = await OrderFactory.deploy(
    orderSeedData.customerAddresses,
    orderSeedData.orderItems,
    orderSeedData.totalAmounts,
    orderSeedData.timestamps,
  );
  await order.waitForDeployment();

  const leaderboard = await LeaderboardFactory.deploy(order);
  await leaderboard.waitForDeployment();

  await order.setLeaderboardContract(leaderboard.getAddress());

  const coffeeNFT = await CoffeeNFTFactory.deploy();
  await leaderboard.waitForDeployment();

  const coffeeMarketplace = await CoffeeMarketplaceFactory.deploy(
    product,
    leaderboard,
    coffeeNFT,
  );
  await coffeeMarketplace.waitForDeployment();

  const voting = await VotingFactory.deploy(
    coffeeMarketplace.getAddress(),
    votingSeedData.coffeeNames,
    votingSeedData.imageUrls,
    votingSeedData.descriptions,
    votingSeedData.origins,
    votingSeedData.types,
    votingSeedData.roastLevels,
    votingSeedData.processMethods,
    votingSeedData.prices,
    votingSeedData.duration,
  );
  await voting.waitForDeployment();

  const cart = await CartFactory.deploy(
    coffeeMarketplace.getAddress(),
    order.getAddress(),
  );
  await cart.waitForDeployment();

  const coffeeAuction = await SealedAuction.deploy(
    coffeeMarketplace.getAddress(),
    ethers.parseEther('0.01'),
    true,
  );
  await coffeeAuction.waitForDeployment();

  const hash = await HashFactory.deploy();
  await hash.waitForDeployment();
  return {
    coffeeMarketplace,
    product,
    order,
    leaderboard,
    coffeeVoting: voting,
    cart,
    coffeeNFT,
    owner,
    roaster,
    buyer,
    secondBuyer,
    customer1,
    customer2,
    marketplaceOperator,
    coffeeAuction: coffeeAuction,
    hash: hash,
  };
}
