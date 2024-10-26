import React from 'react';
import CoffeeCard from './CoffeeCard';
import { CoffeeCarouselProps } from '../types/types';

const CoffeeCardList: React.FC<CoffeeCarouselProps> = ({ items }) => {
  const itemsPerPage = 4;

  return (
    <div className="listing-with-navigation overflow-hidden">
      <div className="flex flex-wrap -mx-2">
        {items.slice(0, itemsPerPage).map((item, index) => (
          <div key={index} className="w-1/4 px-2">
            <CoffeeCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeeCardList;
