import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CoffeeCardProps } from '../types/types';
import useBlockchain from './useBlockchain';

const useCoffeeMarketplace = () => {
  const { coffeeMarketplace } = useBlockchain();
  const [listings, setListings] = useState<CoffeeCardProps[]>([]);

  // Fetch all available listings
  const getAllAvailableListings = useCallback(async () => {
    if (!coffeeMarketplace) {
      console.error("CoffeeMarketplace contract instance not found.");
      return;
    }

    try {
      const availableProducts = await coffeeMarketplace.getAllAvailableListings();
      console.log("Raw Listings Data:", availableProducts);

      const productCount = availableProducts[0]?.length || 0;

      if (productCount === 0) {
        console.log("No available listings found.");
        return;
      }

      const formattedProducts: CoffeeCardProps[] = availableProducts[0].map((_: unknown, i: number) => ({
        type: 'listing',
        imageUrl: availableProducts[3][i],
        name: availableProducts[1][i],
        price: availableProducts[4][i] ? ethers.formatEther(availableProducts[4][i]) : "0",
        onClickListing: () => handleListing(availableProducts[0][i])
      }));

      setListings(formattedProducts);
      console.log("Fetched Listings for Carousel:", formattedProducts);
    } catch (error: unknown) {
      console.error("Error fetching listings:", error instanceof Error ? error.message : error);
    }
  }, [coffeeMarketplace]);

  const addRoasterListing = useCallback(
    async (
      name: string,
      description: string,
      imageUrl: string,
      price: string,
      quantity: number,
      origin: string,
      roastLevel: string,
      beanType: string
    ) => {
      if (!coffeeMarketplace) {
        throw new Error("CoffeeMarketplace contract instance not found.");
      }

      const tx = await coffeeMarketplace.addRoasterListing(
        name,
        description,
        imageUrl,
        ethers.parseEther(price),
        quantity,
        origin,
        roastLevel,
        beanType,
        description
      );
      await tx.wait();
      await getAllAvailableListings(); // Refresh listings after adding a new one
    },
    [coffeeMarketplace, getAllAvailableListings]
  );

  const handleListing = (productId: number) => {
    console.log("Listing clicked:", productId);
  };

  useEffect(() => {
    if (coffeeMarketplace) {
      getAllAvailableListings();
    }
  }, [coffeeMarketplace, getAllAvailableListings]);

  return { listings, getAllAvailableListings, addRoasterListing };
};

export default useCoffeeMarketplace;
