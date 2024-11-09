import { Coffee, Clock, Trophy } from 'lucide-react';

interface RewardTierProps {
    bgColor: string;
    borderColor: string;
    trophyColor: string;
    title: string;
    items: string[];
}

const RewardTier = ({ bgColor, borderColor, trophyColor, title, items }: RewardTierProps) => (
    <div className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Trophy size={24} color={trophyColor} />
            </div>
            <p className="text-lg font-semibold">{title}</p>
        </div>
        <p className="text-sm text-gray-700 ml-9">
            {items.map((item) => (
                <span key={item} className="block mt-1 pl-4">• {item}</span>
            ))}
        </p>
    </div>
);

const RewardTiers = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Coffee size={24} />
                Coffee NFT Reward Tiers
            </h3>
            <div className="space-y-4">
                <RewardTier
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-200"
                    trophyColor="#FFD700"
                    title="Ultra-Rare Collection (Top 1-3)"
                    items={[
                        "Black Ivory Coffee (Thailand's Rarest)",
                        "Kopi Luwak Collection",
                        "Jamaican Blue Mountain",
                        "Panama Geisha Reserve"
                    ]}
                />

                <RewardTier
                    bgColor="bg-gray-50"
                    borderColor="border-gray-200"
                    trophyColor="#C0C0C0"
                    title="Premium Single-Origin Collection (Top 4-7)"
                    items={[
                        "Hawaiian Kona",
                        "Yemen Mocha",
                        "Ethiopia Yirgacheffe"
                    ]}
                />

                <RewardTier
                    bgColor="bg-orange-50"
                    borderColor="border-orange-200"
                    trophyColor="#CD7F32"
                    title="Classic Collection (Top 8-10)"
                    items={[
                        "Kenya AA",
                        "Colombia Supremo",
                        "Brazilian Santos"
                    ]}
                />

                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <Clock className="text-blue-600" />
                        <div>
                            <p className="font-semibold">Monthly Reset System</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Leaderboard and reward opportunities refresh each month.
                                Build your virtual coffee estate by collecting different NFTs each season!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardTiers;