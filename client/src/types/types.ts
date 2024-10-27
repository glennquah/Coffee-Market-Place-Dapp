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
interface CoffeeDialogProps {_shown:boolean}

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
  subTitle: string;
  endDateTime: Date;
}

interface HeroProps {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  variant: HeroVariant;
}

export enum HeroVariant {
  V1 = 'V1',
  V2 = 'V2',
}

export type {
  ButtonProps,
  CoffeeCardListProps,
  CoffeeCardProps,
  CoffeeCardType,
  CoffeeCarouselProps,
  HeroProps,
  TimerHeroProps,
  CoffeeDialogProps,
};
