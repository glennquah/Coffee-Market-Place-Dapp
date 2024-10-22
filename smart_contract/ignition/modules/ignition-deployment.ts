import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';
import { votingSeedData } from './seed_data/votingSeedData';
import { coffeeMarketplaceSeedData } from './seed_data/coffeeMarketplaceSeedData';
import { productSeedData } from './seed_data/productSeedData';

export default buildModule('TESTING_MODULES', (m) => { 
  const deployer = m.getAccount(0);

  const productContract = m.contract(
    'Product',
    [
      productSeedData.roasters,
      productSeedData.names,
      productSeedData.descriptions,
      productSeedData.ipfsHashes,
      productSeedData.prices,
      productSeedData.quantities,
      productSeedData.nftIds
    ],
    { from: deployer }
  );

  const votingContract = m.contract(
    'Voting',
    [
      votingSeedData.coffeeNames,
      votingSeedData.imageUrls,
      votingSeedData.descriptions,
      votingSeedData.origins,
      votingSeedData.types,
      votingSeedData.roastLevels,
      votingSeedData.duration
    ],
    { from: deployer },
  );

  const coffeeMarketplaceContract = m.contract(
    'CoffeeMarketplace',
    [
      productContract
    ],
    { from: deployer }
  );

  return { votingContract, coffeeMarketplaceContract, productContract };
});
