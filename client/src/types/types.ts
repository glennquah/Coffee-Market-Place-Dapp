// Define the type of coffee card (listing, voting, auction)
type CoffeeCardType = 'listing' | 'voting' | 'auction';

// Define CoffeeCardProps type to be reused across components
interface CoffeeCardProps {
  type: CoffeeCardType;
  imageUrl: string;
  name: string;
  price?: string;
  onVote?: () => void;
  onBid?: () => void;
  onClickListing?: () => void;
  bidEndDate?: string;
}

export type { CoffeeCardProps, CoffeeCardType };
