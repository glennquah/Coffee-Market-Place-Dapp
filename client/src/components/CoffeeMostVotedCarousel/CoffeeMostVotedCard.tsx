import React from 'react';
import { CoffeeMostVotedCardProps } from '../../types/types';

const CoffeeMostVotedCard: React.FC<CoffeeMostVotedCardProps> = ({ 
    imageUrl, 
    name, 
    label, 
    className = '',
    onClick
  }) => {  
    return (
      <div 
        className={`relative rounded-lg overflow-hidden cursor-pointer group ${className}`}
        onClick={onClick}
      >
        <div className="absolute inset-0">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
  
        <div className="relative h-full flex flex-col p-6">
          <div className="flex justify-end mb-auto">
            <span className="inline-block bg-white/80 text-black text-sm px-3 py-1 rounded-full">
              {label}
            </span>
          </div>
  
          <div className="transition-transform duration-500 ease-in-out group-hover:translate-y-[-8px]">
            <h3 className="text-white text-2xl font-semibold mb-4">{name}</h3>
            <button className="text-white hover:underline">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CoffeeMostVotedCard;