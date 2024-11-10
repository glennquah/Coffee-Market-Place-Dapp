import { ethers } from "hardhat";

export const orderSeedData = {
    customerAddresses: [
      '0x1111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222',
      '0x3333333333333333333333333333333333333333',
      '0x4444444444444444444444444444444444444444'
    ],
    orderItems: [
      [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 }
      ],
      [
        { productId: 4, quantity: 1 },
        { productId: 5, quantity: 2 }
      ],
      [
        { productId: 6, quantity: 4 },
        { productId: 7, quantity: 2 }
      ],
      [
        { productId: 8, quantity: 2 },
        { productId: 9, quantity: 3 }
      ]
    ],
    totalAmounts: [
      ethers.parseEther('1.0'),
      ethers.parseEther('0.5'),
      ethers.parseEther('2.0'),
      ethers.parseEther('1.5')
    ],
    timestamps: [
      Date.now(),
      Date.now(),
      Date.now(),
      Date.now()
    ]
  };
