import ResponsiveContainer from '../components/ResponsiveContainer';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import { CoffeeCardProps } from '../types/types';
import mockCoffeeData from '../data/mockCoffeeItems';

// TODO: Remove this mock data and replace when intergrating with smart contract
const coffeeListingItems: CoffeeCardProps[] = [];
for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(
    mockCoffeeData[0]
  );
}

for (let i = 0; i < 3; i++) {
  coffeeListingItems.push(
    mockCoffeeData[1]
  );
}

function HomePage() {

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
          voluptas nemo ea praesentium dolor rem explicabo omnis inventore
          laborum deleniti velit unde, vitae quas quidem ab non, tempora officia
          repellendus quia culpa. Architecto molestiae facere hic laboriosam
          velit magni modi odio earum impedit distinctio inventore laborum,
          ipsam repellendus, fuga dolor.
        </p>

        <CoffeeCarousel items={coffeeListingItems} title='Our Coffee For You' subtitle='NFTRoasters Coffee' />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
