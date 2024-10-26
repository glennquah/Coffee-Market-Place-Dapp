// Define the type of coffee card (listing, voting, auction)
type CoffeeCardType = 'listing' | 'voting' | 'auction';

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

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

interface CoffeeCarouselProps {
  items: CoffeeCardProps[];
  title: string;
  subtitle: string;
}

export type {
  CoffeeCardProps,
  CoffeeCardType,
  ButtonProps,
  CoffeeCarouselProps,
};
