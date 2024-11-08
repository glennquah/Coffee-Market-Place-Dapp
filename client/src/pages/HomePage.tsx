import { useEffect } from 'react';
import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { coffeeMockListings } from '../data/mockCoffeeItems';
import { HeroVariant } from '../types/types';
import Button from '../components/Button';
import useWallet from '../hooks/useWallet';
import useCoffeeMarketplace from '../hooks/useCoffeeMarketplace';

function HomePage() {
  const { connectWallet, disconnectWallet, currentAccount } = useWallet();
  const { listings, getListing } = useCoffeeMarketplace();

  // ! For testing for fetching a Listing via ID
  // * Ignore missing dependency warning as useEffect will be removed soon
  console.log("Current Listings:", listings);

  useEffect(() => {
    const fetchInitialListing = async () => {
      if (currentAccount) {
        console.log("Attempting to fetch listing for product ID 1");
        await getListing(1); // Fetch listing for product ID 1
        console.log("Finished fetching listing for product ID 1");
      } else {
        console.log("No connected account. Skipping fetchListing.");
      }
    };

    fetchInitialListing();
  }, [currentAccount]);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
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
        {currentAccount ? (
          <Button onClick={handleDisconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        )}
        
        {/* Display Connected Account */}
        {currentAccount && (
          <div className="mt-4">
            <p>Connected account: {currentAccount}</p>
          </div>
        )}

        <div className="pt-8">
          <CoffeeCarousel
            items={coffeeMockListings}
            title="Our Coffee For You"
            subtitle="NFTRoasters Coffee" />
        </div>
        <CustomerService />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
