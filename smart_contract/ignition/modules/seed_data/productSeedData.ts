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
    ipfsHashes: [
        'https://example.com/columbian.png',
        'https://example.com/brazil.png',
        'https://example.com/costa_rica.png',
        'https://example.com/kenya.png',
        'https://example.com/guatemala.png',
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
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [13, 14, 15],
    ]
  };