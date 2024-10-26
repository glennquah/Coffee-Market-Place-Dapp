import ResponsiveContainer from '../components/ResponsiveContainer';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import { CoffeeCardProps } from '../types/types';
import mockCoffeeData from '../data/mockCoffeeItems';

const coffeeAuctionItems: CoffeeCardProps[] = [];
for (let i = 0; i < 6; i++) {
  coffeeAuctionItems.push(
    mockCoffeeData[3]
  );
}

function AuctionPage() {
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
        <CoffeeCarousel items={coffeeAuctionItems} title='Bid Now' subtitle='Auction' />
      </ResponsiveContainer>
    </div>
  );
}

export default AuctionPage;
