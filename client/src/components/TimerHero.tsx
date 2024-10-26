import { FC, useEffect, useState } from 'react';
import { TimerHeroProps } from '../types/types';

const TimerHero: FC<TimerHeroProps> = ({ title, countdown }) => {
  const [timeLeft, setTimeLeft] = useState(countdown);

  // Effect to decrement the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Helper to format time (hours, minutes, seconds)
  const formatTime = (time: number) => String(time).padStart(2, '0');
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="py-20">
      <h1 className="text-6xl font-bold text-center py-4">{title}</h1>
      <div className="flex justify-center mt-8 gap-4">
        {[hours, minutes, seconds].map((time, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md w-full h-48"
          >
            <span className="text-6xl font-bold">{formatTime(time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimerHero;
