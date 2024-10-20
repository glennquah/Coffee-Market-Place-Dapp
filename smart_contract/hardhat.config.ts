import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.27',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
};

export default config;
