import CountdownTimer from '../components/CountdownTimer';
import LeaderboardEntry from '../components/LeaderboardEntry';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import RewardTiers from '../components/RewardTiers';
import { HeroVariant } from '../types/types';

// Mock leaderboard data
const leaderboardData = [
  {
    rank: 1,
    username: 'CoffeeKing',
    spending: 2450,
    nftReward: 'Black Ivory Coffee NFT + Kopi Luwak Collection (3 Rare NFTs)',
  },
  {
    rank: 2,
    username: 'BeanMaster',
    spending: 2100,
    nftReward: 'Jamaican Blue Mountain NFT + Geisha Reserve (2 Rare NFTs)',
  },
  {
    rank: 3,
    username: 'BrewQueen',
    spending: 1890,
    nftReward: 'St. Helena Coffee NFT + El Injerto Mocca (2 Rare NFTs)',
  },
  {
    rank: 4,
    username: 'EspressoLover',
    spending: 1675,
    nftReward: 'Hacienda La Esmeralda NFT + Yemen Mocha NFT',
  },
  {
    rank: 5,
    username: 'CafeConqueror',
    spending: 1550,
    nftReward: 'Hawaiian Kona NFT + Ethiopia Yirgacheffe NFT',
  },
  {
    rank: 6,
    username: 'LatteLegend',
    spending: 1420,
    nftReward: 'Guatemala Antigua Pastoral NFT',
  },
  {
    rank: 7,
    username: 'MochaMaster',
    spending: 1300,
    nftReward: 'Costa Rica Tarrazu NFT',
  },
  {
    rank: 8,
    username: 'ArabicaAce',
    spending: 1150,
    nftReward: 'Kenya AA NFT',
  },
  {
    rank: 9,
    username: 'RoastedRider',
    spending: 1000,
    nftReward: 'Colombia Supremo NFT',
  },
  {
    rank: 10,
    username: 'CuppaChamp',
    spending: 950,
    nftReward: 'Brazilian Santos NFT',
  },
];

const LeaderBoardPage = () => {
  return (
    <div className="py-8 min-h-screen bg-gradient-to-b from-brown-50 to-white">
      <ResponsiveContainer>
        <div className="space-y-8">
          <Hero
            variant={HeroVariant.V1}
            title="Leaderboard"
            subTitle="Compete to be among the top 10 spenders to earn exclusive Coffee NFTs! Rankings reset monthly."
          />

          <CountdownTimer />

          <div className="space-y-4">
            {leaderboardData.map((player) => (
              <LeaderboardEntry key={player.rank} {...player} />
            ))}
          </div>

          <RewardTiers />
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderBoardPage;
