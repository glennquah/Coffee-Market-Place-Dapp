import marketPlaceHero from '../assets/marketplaceHero.png';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CoffeeDialog from '../components/Dialog/CoffeeDialog';
import { coffeeMockListings } from '../data/mockCoffeeItems';
import CoffeeMostVotedCarousel from '../components/CoffeeMostVotedCarousel/CoffeeMostVotedCarousel';
import useCoffeeMarketplace from '../hooks/useCoffeeMarketplace';
import { useEffect } from 'react';

function MarketPlacePage() {
  const { listings, getAllAvailableListings } = useCoffeeMarketplace();

  useEffect(() => {
    getAllAvailableListings();
  }, [getAllAvailableListings]);

  const refreshListings = () => {
    getAllAvailableListings();
  };

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          variant={HeroVariant.V2}
          title={'Explore, Collect, and Trade Coffee NFTs'}
          subTitle={
            'Browse a curated marketplace of unique coffee-themed NFTs from top roasters.'
          }
          imageUrl={marketPlaceHero}
        />
        <CoffeeCarousel
          items={listings}
          title="Listings"
          subtitle="Browse Listings"
        />
        <CoffeeDialog onListingAdded={refreshListings} />
        <CoffeeMostVotedCarousel
          items={coffeeMockListings}
          title="Most Voted Coffee Beans From The Past Few Weeks"
          subtitle="Most Voted For"
        />
      </ResponsiveContainer>
    </div>
  );
}

export default MarketPlacePage;
