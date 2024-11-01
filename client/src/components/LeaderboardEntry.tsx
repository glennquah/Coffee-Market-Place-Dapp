import { Trophy } from 'lucide-react';

interface LeaderboardEntryProps {
  rank: number;
  username: string;
  spending: number;
  nftReward: string;
}

const getTrophyColor = (rank: number) => {
  switch (rank) {
    case 1: return "#FFD700"; // Gold
    case 2: return "#C0C0C0"; // Silver
    case 3: return "#CD7F32"; // Bronze
    default: return "#718096"; // Gray
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1: return "bg-yellow-100 border-yellow-500";
    case 2: return "bg-gray-100 border-gray-400";
    case 3: return "bg-orange-100 border-orange-500";
    default: return "bg-white border-gray-200";
  }
};

const LeaderboardEntry = ({ rank, username, spending, nftReward }: LeaderboardEntryProps) => {
  return (
    <div
      className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg transform hover:-translate-y-1 ${getRankStyle(rank)}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm mb-1">
              <Trophy size={32} color={getTrophyColor(rank)} strokeWidth={2} />
            </div>
            <span className={`text-2xl font-bold ${
              rank === 1 ? 'text-yellow-600' :
              rank === 2 ? 'text-gray-600' :
              rank === 3 ? 'text-orange-600' :
              'text-gray-500'
            }`}>
              #{rank}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold">{username}</h3>
            <p className="text-sm text-gray-600">{spending.toLocaleString()} ETH total spent</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500 font-medium">Monthly Reward</span>
          <span className="text-sm font-medium max-w-[300px] text-right">{nftReward}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardEntry;