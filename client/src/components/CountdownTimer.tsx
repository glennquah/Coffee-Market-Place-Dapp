import { Clock, Coffee } from 'lucide-react';

const CountdownTimer = () => {
  return (
    <div className="mb-8">
      <div className="bg-[#5F6F52] rounded-xl shadow-lg p-8 border border-[#4F5D44]">
        <div className="flex flex-col items-center justify-center text-white">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-gray-100" size={32} />
            <h3 className="text-2xl font-bold text-white">Next Leaderboard Reset In</h3>
          </div>

          <div className="flex justify-center items-center gap-6 md:gap-10">
            <TimeBlock value="29" label="DAYS" />
            <Separator />
            <TimeBlock value="23" label="HOURS" />
            <Separator />
            <TimeBlock value="45" label="MINUTES" />
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block bg-[#4F5D44] rounded-full px-6 py-2 border border-[#4F5D44]">
              <p className="text-gray-100 text-sm md:text-base flex items-center gap-2">
                <Coffee size={16} /> Top 3 positions earn Ultra-Rare Coffee NFTs!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeBlock = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-[#4F5D44] rounded-xl p-4 w-24 md:w-32 flex items-center justify-center border border-[#4F5D44]">
      <span className="text-4xl md:text-5xl font-bold text-white">{value}</span>
    </div>
    <span className="text-sm md:text-base font-medium mt-2 text-gray-100">{label}</span>
  </div>
);

const Separator = () => (
  <div className="text-4xl md:text-5xl font-bold text-gray-100/50 -mt-8">:</div>
);

export default CountdownTimer;