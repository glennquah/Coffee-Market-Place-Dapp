import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ProductContractABI from '../../../smart_contract/artifacts/contracts/Product.sol/Product.json';
import CoffeeMarketplaceABI from '../../../smart_contract/artifacts/contracts/CoffeeMarketplace.sol/CoffeeMarketplace.json';

const useBlockchain = () => {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [productContract, setProductContract] = useState<ethers.Contract | null>(null);
  const [coffeeMarketplace, setCoffeeMarketplace] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initialize = async () => {

      //! Change Boolean to switch from Local to Alchemy Network
      const isLocal = true;

      const rpcUrl = isLocal
        ? 'http://127.0.0.1:8545'
        : 'https://eth-sepolia.g.alchemy.com/v2/-syud7h1xPZD4vu_tXAOXmqcOlWknhWL';
      const coffeeMarketplaceAddress = isLocal
        ? '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
        : '0x21af70e00463556008f3ad7B5436fbAB3D6Cc5cA';
      const productContractAddress = isLocal
        ? '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
        : '0x51f9E9B7Fe9E5f628356F6215104134261323D80';

      let tempProvider: ethers.Provider;
      let tempSigner;

      if (!isLocal) {
        // If MetaMask is available, use it as the provider and signer.
        if (window.ethereum) {
          tempProvider = new ethers.BrowserProvider(window.ethereum);
        } else {
          throw new Error('MetaMask is not installed');
        }
        tempSigner = await (tempProvider as ethers.BrowserProvider).getSigner();
      } else {
        tempProvider = new ethers.JsonRpcProvider(rpcUrl);
        tempSigner = await (tempProvider as ethers.JsonRpcProvider).getSigner();
      }

      setProvider(tempProvider);
      setSigner(tempSigner);

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
    };

    initialize();
  }, []);

  return { provider, signer, productContract, coffeeMarketplace };
};

export default useBlockchain;
