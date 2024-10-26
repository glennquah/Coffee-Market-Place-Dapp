import React from 'react';
import Button from './Button';
import { CoffeeCardProps } from '../types/types';

const CoffeeCard: React.FC<CoffeeCardProps> = ({ type, imageUrl, name, price, onVote, onBid, onClickListing, bidEndDate }) => {
    return (
        <div
            className={`flex flex-col ${type === 'listing' ? 'items-start' : 'items-center'} p-4 w-full max-w-xs ${type === 'listing' ? 'cursor-pointer transition-transform transform hover:scale-105' : ''
                }`}
            onClick={() => { if (type === 'listing' && onClickListing) onClickListing(); }}
        >
            <img src={imageUrl} alt={name} className="coffee-card__image mb-4 w-full h-48 object-contain" />
            <h3 className={`mb-2 text-lg font-thin ${type === 'listing' ? 'text-left' : 'text-center'} w-full`}>{name}</h3>
            {type === 'listing' && <p className="coffee-card__price mb-4 text-sm text-primary-red  text-left w-full">{price} ETH</p>}
            {type === 'voting' && onVote && (
                <Button onClick={onVote} className="mt-4">
                    Vote
                </Button>
            )}
            {type === 'auction' && onBid && bidEndDate && (
                <>
                    <p className="mb-4 text-center w-full">Bidding ends on {bidEndDate}</p>
                    <Button onClick={onBid} className="mt-4">
                        Bid now
                    </Button>
                </>
            )}
        </div>
    );
};

export default CoffeeCard;
