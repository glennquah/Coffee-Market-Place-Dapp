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
  },
};

export default config;