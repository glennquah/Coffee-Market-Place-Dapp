import CoffeeCardList from '../components/CoffeeCardList';
import ResponsiveContainer from '../components/ResponsiveContainer';
import TimerHero from '../components/TimerHero';
import { coffeeMockVoting } from '../data/mockCoffeeItems';
import { voteEndTime } from '../data/voteEndTime';

function VotingPage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <TimerHero
          title={'Vote for Your Favorite Roast!'}
          subTitle={
            'Cast your vote and shape the next featured brew on our marketplace.'
          }
          endDateTime={voteEndTime}
        />

        <CoffeeCardList items={coffeeMockVoting} />
      </ResponsiveContainer>
    </div>
  );
}

export default VotingPage;
