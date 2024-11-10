import { useEffect } from 'react';
import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';
import useCoffeeMarketplace from '../hooks/useCoffeeMarketplace';

function HomePage() {
  const { listings, getAllAvailableListings } = useCoffeeMarketplace();

  useEffect(() => {
    getAllAvailableListings();
  }, [getAllAvailableListings]);

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          title="Welcome to NFTRoasters"
          subTitle="Buy and Sell your Coffee NFTs here at NFTRoasters"
          imageUrl={homePagehero}
          variant={HeroVariant.V1}
        />

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
