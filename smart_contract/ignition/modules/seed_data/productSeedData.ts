import { ethers } from "hardhat";

export const productSeedData = {
    roasters: [
      '0x1234567890abcdef1234567890abcdef12345678',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x9876543210abcdef9876543210abcdef98765432',
      '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
      '0x1111111111111111111111111111111111111111'
    ],
    names: [
      'Ethiopian Yirgacheffe',
      'Panama Geisha',
      'Sumatra Mandheling',
      'Hawaiian Kona',
      'Mexican Altura'
    ],
    descriptions: [
      'Floral notes with a bright, citrus acidity.',
      'Delicate, jasmine-like aroma with hints of peach.',
      'Full-bodied with an earthy and syrupy texture.',
      'Rich and smooth with a hint of milk chocolate.',
      'Mild flavor with light acidity and chocolate undertones.'
    ],
    ipfsHashes: [
      'https://example.com/ethiopian.png',
      'https://example.com/panama.png',
      'https://example.com/sumatra_mandheling.png',
      'https://example.com/kona.png',
      'https://example.com/mexican.png'
    ],
    prices: [
      ethers.parseEther('0.12'),
      ethers.parseEther('0.15'),
      ethers.parseEther('0.08'),
      ethers.parseEther('0.20'),
      ethers.parseEther('0.05')
    ],
    quantities: [10, 5, 20, 8, 25],
    nftIds: [
      [16, 17, 18],
      [19, 20, 21],
      [22, 23, 24],
      [25, 26, 27],
      [28, 29, 30]
    ]
  };