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
                <div className="pt-8 py-4 gap-2 flex flex-col justify-center items-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">
            Cast your vote for Next Week's Coffee
          </h2>
          <p className="text-lg text-center text-gray-500">
            Each user gets one vote. The coffee with the most votes will be
            featured and sold on our website next week. Make your pick count!
          </p>
        </div>

        <CoffeeCardList items={coffeeMockVoting} />
      </ResponsiveContainer>
    </div>
  );
}

export default VotingPage;
