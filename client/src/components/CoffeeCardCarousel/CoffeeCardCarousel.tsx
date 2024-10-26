import React, { useState } from 'react';
import CoffeeCard from '../CoffeeCard';
import NavigationButtons from './NavigationButtons';
import { CoffeeCarouselProps } from '../../types/types';

const CoffeeCarousel: React.FC<CoffeeCarouselProps> = ({ items, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="listing-with-navigation overflow-hidden">
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <div className="w-2 h-8 rounded-xl bg-primary-red mr-3"></div>
          <h3 className="text-primary-red text-sm font-semibold">{subtitle}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">{title}</h2>
          <NavigationButtons onPrevious={handlePrevious} onNext={handleNext} />
        </div>
      </div>
      <div className="coffee-card-list flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
        {items.map((item, index) => (
          <div key={index} className="flex-none w-1/4">
            <CoffeeCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeeCarousel;
