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
    address: '0x1234AbCdEf5678901234567890abcdef12345678',
    spending: 2450,
    nftReward: 'Black Ivory Coffee NFT + Kopi Luwak Collection (3 Rare NFTs)',
  },
  {
    rank: 2,
    address: '0x2234BCdEf5678901234567890abcdef12345679',
    spending: 2100,
    nftReward: 'Jamaican Blue Mountain NFT + Geisha Reserve (2 Rare NFTs)',
  },
  {
    rank: 3,
    address: '0x3234CDdEf5678901234567890abcdef12345680',
    spending: 1890,
    nftReward: 'St. Helena Coffee NFT + El Injerto Mocca (2 Rare NFTs)',
  },
  {
    rank: 4,
    address: '0x4234DEdEf5678901234567890abcdef12345681',
    spending: 1675,
    nftReward: 'Hacienda La Esmeralda NFT + Yemen Mocha NFT',
  },
  {
    rank: 5,
    address: '0x5234EFdEf5678901234567890abcdef12345682',
    spending: 1550,
    nftReward: 'Hawaiian Kona NFT + Ethiopia Yirgacheffe NFT',
  },
  {
    rank: 6,
    address: '0x6234F0dEf5678901234567890abcdef12345683',
    spending: 1420,
    nftReward: 'Guatemala Antigua Pastoral NFT',
  },
  {
    rank: 7,
    address: '0x7234A1dEf5678901234567890abcdef12345684',
    spending: 1300,
    nftReward: 'Costa Rica Tarrazu NFT',
  },
  {
    rank: 8,
    address: '0x8234B2dEf5678901234567890abcdef12345685',
    spending: 1150,
    nftReward: 'Kenya AA NFT',
  },
  {
    rank: 9,
    address: '0x9234C3dEf5678901234567890abcdef12345686',
    spending: 1000,
    nftReward: 'Colombia Supremo NFT',
  },
  {
    rank: 10,
    address: '0xA234D4dEf5678901234567890abcdef12345687',
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
