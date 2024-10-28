import auctionPageHero from '../assets/auctionHero.png';
import CoffeeCardList from '../components/CoffeeCardList';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import mockCoffeeData from '../data/mockCoffeeItems';
import { CoffeeCardProps, HeroVariant } from '../types/types';

// TODO: Remove this mock data and replace when intergrating with smart contract
const coffeeAuctionItems: CoffeeCardProps[] = [];
for (let i = 0; i < 6; i++) {
  coffeeAuctionItems.push(mockCoffeeData[3]);
}

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
        <CoffeeCardList items={coffeeAuctionItems} />
      </ResponsiveContainer>
    </div>
  );
}

export default AuctionPage;
