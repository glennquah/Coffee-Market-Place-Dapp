import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';

function LeaderBoardPage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          variant={HeroVariant.V1}
          title={'Leaderboard'}
          subTitle={
            'Rise to the top 10 spenders of the players to gain premium coffee discounts. Resets every month!'
          }
        />
      </ResponsiveContainer>
    </div>
  );
}

export default LeaderBoardPage;
