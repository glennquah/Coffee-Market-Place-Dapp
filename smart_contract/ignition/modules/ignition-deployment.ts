import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { orderSeedData } from './seed_data/orderSeedData';
import { productSeedData } from './seed_data/productSeedData';
import { votingSeedData } from './seed_data/votingSeedData';

export default buildModule('TESTING_MODULES', (m) => {
  const deployer = m.getAccount(0);

  const coffeeNFTContract = m.contract(
    'CoffeeNFT',
    [],
    { from: deployer }
  );


  const productContract = m.contract(
    'Product',
    [
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
    ],
    { from: deployer }
  );

  const orderContract = m.contract(
    'Order',
    [
      orderSeedData.customerAddresses,
      orderSeedData.orderItems,
      orderSeedData.totalAmounts,
      orderSeedData.timestamps,
    ],
    { from: deployer }
  );

  const leaderboardContract = m.contract('Leaderboard', [orderContract], {
    from: deployer,
  });

  const coffeeMarketplaceContract = m.contract(
    'CoffeeMarketplace',
    [productContract, leaderboardContract, coffeeNFTContract],
    { from: deployer }
  );

  // const auctionContract = m.contract('Auction', [productContract, 0.001], {
  //   from: deployer,
  // });

  const votingContract = m.contract(
    'Voting',
    [
      coffeeMarketplaceContract,
      votingSeedData.coffeeNames,
      votingSeedData.imageUrls,
      votingSeedData.descriptions,
      votingSeedData.origins,
      votingSeedData.types,
      votingSeedData.roastLevels,
      votingSeedData.processMethods,
      votingSeedData.prices,
      votingSeedData.duration,
    ],
    { from: deployer }
  );
  const cartContract = m.contract(
    'Cart',
    [coffeeMarketplaceContract, orderContract],
    { from: deployer }
  );
  return {
    votingContract,
    coffeeMarketplaceContract,
    productContract,
    orderContract,
    cartContract,
    // auctionContract,
    leaderboardContract,
  };
});
