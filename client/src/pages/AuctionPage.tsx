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
        <div className="pt-8 py-4 gap-2 flex flex-col justify-center items-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">Auction Catalogs</h2>
          <p className="text-lg text-center text-gray-500">
            The highest bid wins the auction, and the coffee will be shipped
            directly to your door. Place your bid now and don't miss your chance
            to own this exclusive brew!
          </p>
        </div>
        <CoffeeCardList items={coffeeMockAuctions} />
      </ResponsiveContainer>
    </div>
  );
}

export default AuctionPage;
