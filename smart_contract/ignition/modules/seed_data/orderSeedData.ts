import { ethers } from "hardhat";

export const orderSeedData = {
    customerAddresses: [
      '0x1111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222'
    ],
    orderItems: [
      [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 }
      ],
      [
        { productId: 4, quantity: 1 },
        { productId: 5, quantity: 2 }
      ]
    ],
    totalAmounts: [
      ethers.parseEther('1.0'),
      ethers.parseEther('0.5')
    ],
    timestamps: [
      Date.now(),
      Date.now()
    ]
  };