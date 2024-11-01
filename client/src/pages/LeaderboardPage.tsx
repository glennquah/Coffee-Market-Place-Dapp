import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';
import { Trophy } from 'lucide-react';

// Mock leaderboard data
const leaderboardData = [
  {
    rank: 1,
    username: "CoffeeKing",
    spending: 2450,
    nftReward: "Black Ivory Coffee NFT + Kopi Luwak Collection (3 Rare NFTs)"
  },
  {
    rank: 2,
    username: "BeanMaster",
    spending: 2100,
    nftReward: "Jamaican Blue Mountain NFT + Geisha Reserve (2 Rare NFTs)"
  },
  {
    rank: 3,
    username: "BrewQueen",
    spending: 1890,
    nftReward: "St. Helena Coffee NFT + El Injerto Mocca (2 Rare NFTs)"
  },
  {
    rank: 4,
    username: "EspressoLover",
    spending: 1675,
    nftReward: "Hacienda La Esmeralda NFT + Yemen Mocha NFT"
  },
  {
    rank: 5,
    username: "CafeConqueror",
    spending: 1550,
    nftReward: "Hawaiian Kona NFT + Ethiopia Yirgacheffe NFT"
  },
  {
    rank: 6,
    username: "LatteLegend",
    spending: 1420,
    nftReward: "Guatemala Antigua Pastoral NFT"
  },
  {
    rank: 7,
    username: "MochaMaster",
    spending: 1300,
    nftReward: "Costa Rica Tarrazu NFT"
  },
  {
    rank: 8,
    username: "ArabicaAce",
    spending: 1150,
    nftReward: "Kenya AA NFT"
  },
  {
    rank: 9,
    username: "RoastedRider",
    spending: 1000,
    nftReward: "Colombia Supremo NFT"
  },
  {
    rank: 10,
    username: "CuppaChamp",
    spending: 950,
    nftReward: "Brazilian Santos NFT"
  }
];

// Reward tier descriptions for the information section
const rewardTiers = [
  {
    tier: "Top 1-3",
    description: "Ultra-Rare Coffee NFTs (Black Ivory, Kopi Luwak, Jamaican Blue Mountain, Geisha) + Additional Rare Collection NFTs"
  },
  {
    tier: "Top 4-7",
    description: "Premium Single-Origin NFTs (Hawaiian Kona, Yemen Mocha, Ethiopia Yirgacheffe)"
  },
  {
    tier: "Top 8-10",
    description: "Classic Coffee NFTs (Kenya AA, Colombia Supremo, Brazilian Santos)"
  }
];
const getTrophyColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "#FFD700"; // Gold
    case 2:
      return "#C0C0C0"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return "#718096"; // Gray
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-100 border-yellow-500";
    case 2:
      return "bg-gray-100 border-gray-400";
    case 3:
      return "bg-orange-100 border-orange-500";
    default:
      return "bg-white border-gray-200";
  }
};

const LeaderBoardPage = () => {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          variant={HeroVariant.V1}
          title="Leaderboard"
          subTitle="Compete to be among the top 10 spenders to earn exclusive Coffee NFTs! Rankings reset monthly."
        />

        <div className="mt-8 space-y-4">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className={`p-6 rounded-lg border-2 transition-all hover:shadow-md ${getRankStyle(player.rank)}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    <Trophy size={32} color={getTrophyColor(player.rank)} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{player.username}</h3>
                      <span className="px-2 py-1 text-sm font-semibold bg-gray-100 rounded-full">
                        #{player.rank}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{player.spending.toLocaleString()} ETH total spent</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 font-medium">Monthly Reward</span>
                  <span className="text-sm font-medium">{player.nftReward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Coffee NFT Reward Tiers</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={24} color="#FFD700" />
                <p className="text-lg font-semibold">Ultra-Rare Collection (Top 1-3)</p>
              </div>
              <p className="text-sm text-gray-700 ml-9">
                Exclusive access to the world's most prestigious coffees:
                <span className="block mt-1 pl-4">• Black Ivory Coffee (Thailand's Rarest)</span>
                <span className="block pl-4">• Kopi Luwak Collection</span>
                <span className="block pl-4">• Jamaican Blue Mountain</span>
                <span className="block pl-4">• Panama Geisha Reserve</span>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={24} color="#C0C0C0" />
                <p className="text-lg font-semibold">Premium Single-Origin (Top 4-7)</p>
              </div>
              <p className="text-sm text-gray-700 ml-9">
                Distinguished coffee varieties from renowned regions:
                <span className="block mt-1 pl-4">• Hawaiian Kona</span>
                <span className="block pl-4">• Yemen Mocha</span>
                <span className="block pl-4">• Ethiopia Yirgacheffe</span>
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={24} color="#CD7F32" />
                <p className="text-lg font-semibold">Classic Collection (Top 8-10)</p>
              </div>
              <p className="text-sm text-gray-700 ml-9">
                Respected traditional coffee varieties:
                <span className="block mt-1 pl-4">• Kenya AA</span>
                <span className="block pl-4">• Colombia Supremo</span>
                <span className="block pl-4">• Brazilian Santos</span>
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Monthly Reset:</span> Leaderboard and reward opportunities refresh each month.
                Collect different coffee NFTs to build your virtual coffee estate!
              </p>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaderBoardPage;