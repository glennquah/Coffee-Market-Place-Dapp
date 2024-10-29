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
          endDateTime={new Date('2024-10-30T23:59:59+08:00')}
        />

        <CoffeeCardList items={coffeeVotingItems} />
      </ResponsiveContainer>
    </div>
  );
}

export default VotingPage;
