import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.27',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/-syud7h1xPZD4vu_tXAOXmqcOlWknhWL',
      accounts: [
        'fff5e1ee0394758443e3f8d315ccf59337bf39687ed4535c3d975fa1d9c4a1df',
      ],
    },
  },
};

export default config;