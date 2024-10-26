import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
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
          title={"Vote for your Brew! Next Week's Featured Coffee"}
          countdown={12}
        />

        <CoffeeCarousel
          items={coffeeVotingItems}
          title="Vote Now"
          subtitle="Voting"
        />
      </ResponsiveContainer>
    </div>
  );
}

export default VotingPage;
