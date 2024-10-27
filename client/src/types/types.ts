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

interface CoffeeCardListProps {
  items: CoffeeCardProps[];
}

interface TimerHeroProps {
  title: string;
  endDateTime: Date;
}

interface HeroProps {
  title: string;
  imageUrl: string;
}

export type {
  ButtonProps,
  CoffeeCardListProps,
  CoffeeCardProps,
  CoffeeCardType,
  CoffeeCarouselProps,
  HeroProps,
  TimerHeroProps,
};
