import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ProductContractABI from '../contracts/Product.json';
import CoffeeMarketplaceABI from '../contracts/CoffeeMarketplace.json';
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

      const rpcUrl = isLocal
        ? import.meta.env.VITE_LOCAL_RPC_URL
        : import.meta.env.VITE_ALCHEMY_RPC_URL;
      const coffeeMarketplaceAddress = isLocal
        ? import.meta.env.VITE_LOCAL_COFFEE_MARKETPLACE_ADDRESS
        : import.meta.env.VITE_ALCHEMY_COFFEE_MARKETPLACE_ADDRESS;
      const productContractAddress = isLocal
        ? import.meta.env.VITE_LOCAL_PRODUCT_CONTRACT_ADDRESS
        : import.meta.env.VITE_ALCHEMY_PRODUCT_CONTRACT_ADDRESS;

      if (isLocal) {
        tempProvider = new ethers.JsonRpcProvider(rpcUrl);
        tempSigner = await (tempProvider as ethers.JsonRpcProvider).getSigner();
      } else {
        if (provider && signer) {
          tempProvider = provider;
          tempSigner = signer;
        } else {
          console.error("Provider or Signer is not available from useWallet.");
          return;
        }
      }

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
