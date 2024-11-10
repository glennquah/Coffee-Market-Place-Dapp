import { ethers } from 'hardhat';

export const productSeedData = {
  roasters: [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210abcdef9876543210abcdef98765432',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
    '0x1111111111111111111111111111111111111111',
  ],
  names: [
    'Colombian Coffee',
    'Brazilian Santos',
    'Costa Rican Tarrazu',
    'Kenya AA',
    'Guatemala Antigua',
  ],

  descriptions: [
    'Best Colombian Coffee',
    'A smooth coffee with mild acidity and balanced flavor.',
    'Rich body and flavor with notes of chocolate and citrus.',
    'Full-bodied coffee with wine-like acidity and berry flavors.',
    'Smooth and balanced with notes of cocoa and nuts.',
  ],

  //! To replace with IPFS
  ipfsHashes: [
    'https://www.nativeamericancoffee.com/cdn/shop/products/CostaRican_276a85fd-9f2c-471c-81ca-e0a590fb0987_1400x.jpg?v=1603977811',
    'https://m.media-amazon.com/images/I/71GPU8X9StL.jpg',
    'https://s7d6.scene7.com/is/image/bjs/322416',
    'https://can.com.sg/wp-content/uploads/2020/07/sumatraweb-1.jpg',
    'https://m.media-amazon.com/images/I/71O6J3vDlGL.jpg',
  ],

  prices: [
    ethers.parseEther('0.1'), // 0.1 ETH
    ethers.parseEther('0.03'), // 0.03 ETH
    ethers.parseEther('0.025'), // 0.025 ETH
    ethers.parseEther('0.04'), // 0.04 ETH
    ethers.parseEther('0.015'), // 0.015 ETH
  ],
  quantities: [5, 10, 15, 20, 30],

  nftIds: [
    // can be any number of elements in the arr since the main initialisation of nftIds is addRoasterListing() in CoffeeMarketplace.sol
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
  ],
  origins: ['Colombia', 'Brazil', 'Costa Rica', 'Kenya', 'Guatemala'],
  roastLevels: ['Medium', 'Light', 'Dark', 'Dark', 'Medium'],
  beanTypes: ['Arabica', 'Robusta', 'Arabica', 'Robusta', 'Arabica'],
  processMethods: ['Washed', 'Natural', 'Washed', 'Washed', 'Honey'],
  roastDates: [1632979200, 1632979200, 1632979200, 1632979200, 1632979200],
};
