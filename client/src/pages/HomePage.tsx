import homePagehero from '../assets/homePagehero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import mockCoffeeData from '../data/mockCoffeeItems';
import { CoffeeCardProps } from '../types/types';

// TODO: Remove this mock data and replace when intergrating with smart contract
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
        <Hero title="Welcome to NFTRoasters" imageUrl={homePagehero} />
        <CoffeeCarousel
          items={coffeeListingItems}
          title="Our Coffee For You"
          subtitle="NFTRoasters Coffee"
        />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
