import React from 'react';
import CoffeeMostVotedCard from './CoffeeMostVotedCard';
import { CoffeeCarouselProps } from '../../types/types';

const CoffeeMostVotedCarousel: React.FC<CoffeeCarouselProps> = ({ items, title, subtitle }) => {
  return (
    <div className="listing-with-navigation overflow-hidden mt-8">
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <div className="w-2 h-8 rounded-xl bg-primary-red mr-3"></div>
          <h3 className="text-primary-red text-sm font-semibold">{subtitle}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:row-span-2">
          {items[0] && (
            <CoffeeMostVotedCard 
              {...items[0]} 
              label="Last Week's Top Pick"
              className="h-[450px]" 
              onClick={items[0].onClickListing}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 h-[450px]">
          <div className="flex-1"> 
            {items[1] && (
              <CoffeeMostVotedCard 
                {...items[1]} 
                label="Second Week's Top Pick"
                className="h-full"
                onClick={items[0].onClickListing}
              />
            )}
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4"> 
            {items[2] && (
              <CoffeeMostVotedCard 
                {...items[2]} 
                label="Third Week's Top Pick"
                className="h-full"
                onClick={items[0].onClickListing}
              />
            )}
            {items[3] && (
              <CoffeeMostVotedCard 
                {...items[3]} 
                label="Fourth Week's Top Pick"
                className="h-full"
                onClick={items[0].onClickListing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeMostVotedCarousel;