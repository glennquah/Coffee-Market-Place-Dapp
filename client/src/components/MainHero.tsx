import { FC } from 'react';
import { HeroProps } from '../types/types';

const Hero: FC<HeroProps> = ({ title, imageUrl }) => {
  return (
    <div className="py-12 flex flex-col gap-12">
      <h1 className="text-6xl font-bold text-center">{title}</h1>
      <img src={imageUrl} alt="hero" className="w-full" />
    </div>
  );
};

export default Hero;
