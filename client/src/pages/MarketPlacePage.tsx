import marketPlaceHero from '../assets/marketplaceHero.png';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant, CoffeeCardProps } from '../types/types';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CoffeeDialog from '../components/Dialog/CoffeeDialog';
import mockCoffeeData from '../data/mockCoffeeItems';

const coffeeListingItems: CoffeeCardProps[] = [];
for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(mockCoffeeData[0]);
}

for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(mockCoffeeData[1]);
}

function MarketPlacePage() {
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
          items={coffeeListingItems}
          title="Listings"
          subtitle="Browse Listings"
        />
        <CoffeeDialog />
      </ResponsiveContainer>
    </div>
  );
}

export default MarketPlacePage;
