import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import mockCoffeeData from '../data/mockCoffeeItems';
import { CoffeeCardProps, HeroVariant } from '../types/types';

const coffeeListingItems: CoffeeCardProps[] = [];
for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(mockCoffeeData[0]);
}

for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(mockCoffeeData[1]);
}

function HomePage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          title="Welcome to NFTRoasters"
          subTitle="Buy and Sell your Coffee NFTs here at NFT Roasters"
          imageUrl={homePagehero}
          variant={HeroVariant.V1}
        />
        <div className="pt-8">
          <CoffeeCarousel
            items={coffeeListingItems}
            title="Our Coffee For You"
            subtitle="NFTRoasters Coffee"
          />
        </div>
        <CustomerService />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
