import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';
import { votingSeedData } from './seed_data/votingSeedData';
import { coffeeMarketplaceSeedData } from './seed_data/coffeeMarketplaceSeedData';

export default buildModule('TESTING_MODULES', (m) => { 
  const deployer = m.getAccount(0);

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
      coffeeMarketplaceSeedData.roasters,
      coffeeMarketplaceSeedData.names,
      coffeeMarketplaceSeedData.descriptions,
      coffeeMarketplaceSeedData.ipfsHashes,
      coffeeMarketplaceSeedData.prices,
      coffeeMarketplaceSeedData.quantities,
      coffeeMarketplaceSeedData.nftIds
    ],
    { from: deployer }
  );

  return { votingContract, coffeeMarketplaceContract };
});