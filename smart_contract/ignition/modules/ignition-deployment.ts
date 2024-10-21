import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';

export default buildModule('TESTING_MODULES', (m) => { 
  const deployer = m.getAccount(0);

  const votingContract = m.contract(
    'Voting',
    [
      [
        'Jamaica Blue Mountain',
        'Colombia Narino Granos De Espreranza',
        'Vietnam Da Lat',
        'Sumatra Long Berry',
      ],
      // TODO: Add image URLs
      [
        'https://example.com/jamaica.png',
        'https://example.com/colombia.png',
        'https://example.com/vietnam.png',
        'https://example.com/sumatra.png',
      ],
      [
        'A smooth, mild coffee with floral and nutty undertones.',
        'A bright, fruity coffee with hints of citrus and chocolate.',
        'A bold coffee with nutty, chocolate flavors.',
        'Earthy and spicy with notes of herbs and tobacco.',
      ],
      ['Jamaica', 'Colombia', 'Vietnam', 'Sumatra'],
      ['Arabica', 'Arabica', 'Robusta', 'Arabica'],
      ['Medium', 'Medium-Light', 'Dark', 'Dark'],
      90, // 90 Minutes just for testing
    ],
    { from: deployer },
  );

  const roasters = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210abcdef9876543210abcdef98765432',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
    '0x1111111111111111111111111111111111111111'
  ];

  const names = [
    'Colombian Coffee',
    'Brazilian Santos',
    'Costa Rican Tarrazu',
    'Kenya AA',
    'Guatemala Antigua'
  ];

  const descriptions = [
    'Best Colombian Coffee',
    'A smooth coffee with mild acidity and balanced flavor.',
    'Rich body and flavor with notes of chocolate and citrus.',
    'Full-bodied coffee with wine-like acidity and berry flavors.',
    'Smooth and balanced with notes of cocoa and nuts.'
  ];

  const ipfsHashes = [
    'DummyHash',
    'https://example.com/brazil.png',
    'https://example.com/costa_rica.png',
    'https://example.com/kenya.png',
    'https://example.com/guatemala.png'
  ];

  const prices = [
    ethers.parseEther('0.1'), // 0.1 ETH
    ethers.parseEther('0.03'), // 0.03 ETH
    ethers.parseEther('0.025'), // 0.025 ETH
    ethers.parseEther('0.04'), // 0.04 ETH
    ethers.parseEther('0.015') // 0.015 ETH
  ];

  const quantities = [5, 10, 15, 20, 30];

  const nftIds = [ // can be any number of elements in the arr since the main initialisation of nftIds is addRoasterListing() in CoffeeMarketplace.sol 
    [1, 2, 3], 
    [4, 5, 6], 
    [7, 8, 9], 
    [10, 11, 12], 
    [13, 14, 15] 
  ];

  // @WAYNE ADD DEPLOYMENT HERE [Update: Have Added by @wjahoward]
  const coffeeMarketplaceContract = m.contract(
    'CoffeeMarketplace',
    [
      roasters,
      names,
      descriptions,
      ipfsHashes,
      prices,
      quantities,
      nftIds
    ],
    { from: deployer }
  )

  return { votingContract, coffeeMarketplaceContract }; // Return the deployed contract
});
