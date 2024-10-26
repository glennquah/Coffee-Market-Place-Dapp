import React from 'react';
import Button from './Button';

// Reusable Coffee Card Component for Listing, Voting, and Auction
interface CoffeeCardProps {
  type: 'listing' | 'voting' | 'auction';
  imageUrl: string;
  name: string;
  price?: string;
  onVote?: () => void;
  onBid?: () => void;
  onClickListing?: () => void;
  bidEndDate?: string;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ type, imageUrl, name, price, onVote, onBid, onClickListing, bidEndDate }) => {
  return (
    <div 
      className="coffee-card flex flex-col items-center text-center p-4 cursor-pointer w-full max-w-xs" 
      onClick={() => { if (type === 'listing' && onClickListing) onClickListing(); }}
    >
      <img src={imageUrl} alt={name} className="coffee-card__image mb-4 w-full h-48 object-contain" />
      <h3 className="coffee-card__name mb-2 text-lg font-semibold">{name}</h3>
      {type === 'listing' && <p className="coffee-card__price mb-4 text-primary-red">{price} ETH</p>}
      {type === 'voting' && onVote && (
        <Button onClick={onVote} className="mt-4">
          Vote
        </Button>
      )}
      {type === 'auction' && onBid && bidEndDate && (
        <>
          <p className="coffee-card__bid-end mb-4">Bidding ends on {bidEndDate}</p>
          <Button onClick={onBid} className="mt-4">
            Bid now
          </Button>
        </>
      )}
    </div>
  );
};

export default CoffeeCard;
