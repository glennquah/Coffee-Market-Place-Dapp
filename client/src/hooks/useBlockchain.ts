// src/hooks/useBlockchain.ts
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ProductContractABI from '../../../smart_contract/artifacts/contracts/Product.sol/Product.json';
import CoffeeMarketplaceABI from '../../../smart_contract/artifacts/contracts/CoffeeMarketplace.sol/CoffeeMarketplace.json';
import useWallet from './useWallet';

interface UseBlockchain {
  productContract: ethers.Contract | null;
  coffeeMarketplace: ethers.Contract | null;
}

const useBlockchain = (isLocal: boolean = true): UseBlockchain => {
  const { provider, signer } = useWallet();
  const [productContract, setProductContract] = useState<ethers.Contract | null>(null);
  const [coffeeMarketplace, setCoffeeMarketplace] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initialize = async () => {
      let tempProvider: ethers.Provider;
      let tempSigner: ethers.Signer | null = null;

      if (isLocal) {
        // Connect to Local Blockchain (e.g., Hardhat)
        const rpcUrl = 'http://127.0.0.1:8545';
        tempProvider = new ethers.JsonRpcProvider(rpcUrl);
        tempSigner = await (tempProvider as ethers.JsonRpcProvider).getSigner();
      } else {
        // Use Provider and Signer from useWallet (e.g., MetaMask)
        if (provider && signer) {
          tempProvider = provider;
          tempSigner = signer;
        } else {
          console.error("Provider or Signer is not available from useWallet.");
          return;
        }
      }

      // Define contract addresses based on the network
      const coffeeMarketplaceAddress = isLocal
        ? '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
        : '0x21af70e00463556008f3ad7B5436fbAB3D6Cc5cA';
      const productContractAddress = isLocal
        ? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
        : '0x51f9E9B7Fe9E5f628356F6215104134261323D80';

      // Initialize Contracts with Signer for Write Operations
      if (tempSigner) {
        const coffeeMarketplaceInstance = new ethers.Contract(
          coffeeMarketplaceAddress,
          CoffeeMarketplaceABI.abi,
          tempSigner
        );

        const productContractInstance = new ethers.Contract(
          productContractAddress,
          ProductContractABI.abi,
          tempSigner
        );

        setCoffeeMarketplace(coffeeMarketplaceInstance);
        setProductContract(productContractInstance);
      } else {
        // If no signer (read-only), initialize contracts with provider
        const coffeeMarketplaceInstance = new ethers.Contract(
          coffeeMarketplaceAddress,
          CoffeeMarketplaceABI.abi,
          tempProvider
        );

        const productContractInstance = new ethers.Contract(
          productContractAddress,
          ProductContractABI.abi,
          tempProvider
        );

        setCoffeeMarketplace(coffeeMarketplaceInstance);
        setProductContract(productContractInstance);
      }
    };

    initialize();
  }, [provider, signer, isLocal]);

  return { productContract, coffeeMarketplace };
};

export default useBlockchain;
