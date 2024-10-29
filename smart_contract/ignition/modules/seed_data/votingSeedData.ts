import { ethers } from 'hardhat';

export const votingSeedData = {
  coffeeNames: [
    'Jamaica Blue Mountain',
    'Colombia Narino Granos De Espreranza',
    'Vietnam Da Lat',
    'Sumatra Long Berry',
  ],
  imageUrls: [
    'https://example.com/jamaica.png',
    'https://example.com/colombia.png',
    'https://example.com/vietnam.png',
    'https://example.com/sumatra.png',
  ],
  descriptions: [
    'A smooth, mild coffee with floral and nutty undertones.',
    'A bright, fruity coffee with hints of citrus and chocolate.',
    'A bold coffee with nutty, chocolate flavors.',
    'Earthy and spicy with notes of herbs and tobacco.',
  ],
  origins: ['Jamaica', 'Colombia', 'Vietnam', 'Sumatra'],
  types: ['Arabica', 'Arabica', 'Robusta', 'Arabica'],
  roastLevels: ['Medium', 'Medium-Light', 'Dark', 'Dark'],
  processMethods: ['Washed', 'Natural', 'Natural', 'Washed'],
  prices: [
    ethers.parseEther('0.12'),
    ethers.parseEther('0.15'),
    ethers.parseEther('0.08'),
    ethers.parseEther('0.20'),
  ],
  duration: 90,
};
