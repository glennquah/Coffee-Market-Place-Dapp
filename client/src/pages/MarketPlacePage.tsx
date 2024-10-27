import marketPlaceHero from '../assets/marketplaceHero.png';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';
import CoffeeDialog from '../components/CoffeeDialog/CoffeeDialog';
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
        <CoffeeDialog
        />
      </ResponsiveContainer>
    </div>
  );
}

export default MarketPlacePage;
