import { useEffect, useState } from 'react';
import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant, CoffeeCardProps } from '../types/types';
import useBlockchain from '../hooks/useBlockchain';
import { ethers } from "ethers";
import useWallet from '../hooks/useWallet';

function HomePage() {
  const { coffeeMarketplace } = useBlockchain();
  const { currentAccount, chainId } = useWallet();
  const [listings, setListings] = useState<CoffeeCardProps[]>([]);

  // Function to fetch all available listings and format for CoffeeCarousel
  const fetchAllListings = async () => {
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

      // Format listings to match CoffeeCardProps structure
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
      if (error instanceof Error) {
        console.error("Error fetching listings:", error.message);
      } else {
        console.error("Error fetching listings:", error);
      }
    }
  };

  // Fetch listings when coffeeMarketplace is available
  useEffect(() => {
    if (coffeeMarketplace) {
      fetchAllListings();
    }
  }, [coffeeMarketplace]);

  // Example function to handle listing clicks
  const handleListing = (productId: number) => {
    console.log("Listing clicked:", productId);
    // Implement navigation or display functionality as needed
  };

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          title="Welcome to NFTRoasters"
          subTitle="Buy and Sell your Coffee NFTs here at NFTRoasters"
          imageUrl={homePagehero}
          variant={HeroVariant.V1}
        />

        {/* Display Connected Account and Chain ID */}
        {currentAccount && (
          <div className="mt-4">
            {chainId ? (
              <p>Connected chain: {chainId}</p>
            ) : (
              <p>Fetching connected chain...</p>
            )}
            <p>Connected account: {currentAccount}</p>
          </div>
        )}

        {/* Coffee Carousel Section */}
        <div className="pt-8">
          <CoffeeCarousel
            items={listings}
            title="Our Coffee For You"
            subtitle="NFTRoasters Coffee" />
        </div>

        {/* Customer Service Section */}
        <CustomerService />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
