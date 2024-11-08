import { useState } from "react";
import { ethers } from "ethers";
import useWallet from "./useWallet";
import { contractABI, contractAddress } from "../utils/constants";
import { useSDK } from "@metamask/sdk-react";

interface Listing {
  name: string;
  description: string;
  ipfsHash: string;
  price: string;
  quantity: number;
  nftIds: number[];
  available: boolean;
  origin: string;
  roastLevel: string;
  beanType: string;
  processMethod: string;
  roastDate: string;
}

interface CoffeeMarketplace {
  listings: Listing[];
  getListing: (productId: number) => Promise<Listing | null>;
  addListing: (
    name: string,
    description: string,
    ipfsHash: string,
    price: string,
    quantity: number,
    origin: string,
    roastLevel: string,
    beanType: string,
    processMethod: string,
    roastDate: string
  ) => Promise<void>;
}

const useCoffeeMarketplace = (): CoffeeMarketplace => {
  const { sdk } = useSDK();
  const { currentAccount } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);

  // Create Contract Instance
  const createContract = async () => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }
    if (!sdk) {
      throw new Error("SDK not initialized");
    }
    const provider = new ethers.BrowserProvider(sdk.getProvider()!);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress.CoffeeMarketplace, contractABI.CoffeeMarketplace.abi, signer);
    return contract;
  };

  const getListing = async (productId: number): Promise<Listing | null> => {
    try {
      const contract = await createContract();
      const listing = await contract.getListing(productId);

      const structuredListing: Listing = {
        name: listing.name,
        description: listing.description,
        ipfsHash: listing.ipfsHash,
        price: ethers.formatUnits(listing.price, 18),
        quantity: Number(listing.quantity),
        nftIds: listing.nftIds.map((id: string | number) => Number(id)),
        available: listing.available,
        origin: listing.origin,
        roastLevel: listing.roastLevel,
        beanType: listing.beanType,
        processMethod: listing.processMethod,
        roastDate: new Date(Number(listing.roastDate) * 1000).toLocaleString(),
      };

      setListings((prev) => [...prev, structuredListing]);
      return structuredListing;
    } catch (error) {
      console.error("Error fetching listing:", error);
      return null;
    }
  };

  const addListing = async (
    name: string,
    description: string,
    ipfsHash: string,
    price: string,
    quantity: number,
    origin: string,
    roastLevel: string,
    beanType: string,
    processMethod: string,
    roastDate: string
  ) => {
    try {
      const contract = await createContract();
      const parsedPrice = ethers.parseEther(price);

      const tx = await contract.addListing(
        name,
        description,
        ipfsHash,
        parsedPrice,
        quantity,
        origin,
        roastLevel,
        beanType,
        processMethod,
        roastDate
      );

      console.log("Adding listing...");
      await tx.wait();
      console.log("Listing added successfully!");

    } catch (error) {
      console.error("Error adding listing:", error);
    }
  };

  return { listings, getListing, addListing };
};

export default useCoffeeMarketplace;
