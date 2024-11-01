import CoffeeCardList from '../components/CoffeeCardList';
import ResponsiveContainer from '../components/ResponsiveContainer';
import TimerHero from '../components/TimerHero';
import mockCoffeeData from '../data/mockCoffeeItems';
import { CoffeeCardProps } from '../types/types';

// TODO: Remove this mock data and replace when intergrating with smart contract
const coffeeVotingItems: CoffeeCardProps[] = [];
for (let i = 0; i < 6; i++) {
  coffeeVotingItems.push(mockCoffeeData[2]);
}

function VotingPage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <TimerHero
          title={'Vote for Your Favorite Roast!'}
          subTitle={
            'Cast your vote and shape the next featured brew on our marketplace.'
          }
          endDateTime={new Date('2024-11-04T23:59:59+08:00')}
        />
        <div className="pt-8 py-4 gap-2 flex flex-col justify-center items-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">
            Cast your vote for Next Week's Coffee
          </h2>
          <p className="text-lg text-center">
            Each user gets one vote. The coffee with the most votes will be
            featured and sold on our website next week. Make your pick count!
          </p>
        </div>
        <CoffeeCardList items={coffeeVotingItems} />
      </ResponsiveContainer>
    </div>
  );
}

export default VotingPage;
