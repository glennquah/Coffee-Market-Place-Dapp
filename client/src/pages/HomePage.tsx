import { useEffect, useState } from 'react';
import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import LandingPageDialog from '../components/Dialog/LandingPageDialog';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import useCoffeeMarketplace from '../hooks/useCoffeeMarketplace';
import { HeroVariant } from '../types/types';

function HomePage() {
  const { listings, getAllAvailableListings } = useCoffeeMarketplace();
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const closeDialog = () => setisDialogOpen(false);
  useEffect(() => {
    getAllAvailableListings();
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setisDialogOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [getAllAvailableListings]);

  return (
    <div className="py-8">
      <LandingPageDialog isOpen={true} onClose={closeDialog} />
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
            subtitle="NFTRoasters Coffee"
          />
        </div>
        {/* Customer Service Section */}
        <CustomerService />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
