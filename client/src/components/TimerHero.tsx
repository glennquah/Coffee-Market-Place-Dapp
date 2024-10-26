import { FC, useEffect, useState } from 'react';
import { TimerHeroProps } from '../types/types';

const TimerHero: FC<TimerHeroProps> = ({ title, countdown }) => {
  const [timeLeft, setTimeLeft] = useState(countdown * 3600);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => String(time).padStart(2, '0').split('');
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="py-12">
      <h1 className="text-6xl font-bold text-center py-4">{title}</h1>
      <div className="flex justify-center mt-8 gap-4">
        {formatTime(hours).map((digit, index) => (
          <div
            key={`hour-${index}`}
            className="flex items-center justify-center bg-white rounded-lg shadow-md w-32 h-48"
          >
            <span className="text-5xl font-bold">{digit}</span>
          </div>
        ))}
        <span className="text-5xl font-bold flex items-center">:</span>
        {formatTime(minutes).map((digit, index) => (
          <div
            key={`minute-${index}`}
            className="flex items-center justify-center bg-white rounded-lg shadow-md w-32 h-48"
          >
            <span className="text-5xl font-bold">{digit}</span>
          </div>
        ))}
        <span className="text-5xl font-bold flex items-center">:</span>
        {formatTime(seconds).map((digit, index) => (
          <div
            key={`second-${index}`}
            className="flex items-center justify-center bg-white rounded-lg shadow-md w-32 h-48"
          >
            <span className="text-5xl font-bold">{digit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimerHero;
