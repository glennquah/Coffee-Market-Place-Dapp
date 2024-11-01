import auctionPageHero from '../assets/auctionHero.png';
import CoffeeCardList from '../components/CoffeeCardList';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { coffeeMockAuctions } from '../data/mockCoffeeItems';
import { HeroVariant } from '../types/types';

function AuctionPage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          variant={HeroVariant.V2}
          title={'Bid for the Brew!'}
          subTitle={
            'Place your bids on exclusive coffee experiences and coffee NFTs before the timer runs out!'
          }
          imageUrl={auctionPageHero}
        />
        <CoffeeCardList items={coffeeMockAuctions} />
      </ResponsiveContainer>
    </div>
  );
}

export default AuctionPage;
