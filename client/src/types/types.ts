// Define the type of coffee card (listing, voting, auction)
type CoffeeCardType = 'listing' | 'voting' | 'auction' | 'cart';

interface CoffeeCardProps {
  type: CoffeeCardType;
  imageUrl: string;
  name: string;
  price?: string;
  onVote?: () => void;
  onBid?: () => void;
  onClickListing?: () => void;
  bidEndDate?: string;
  numberOfNFT?: number; // cart
  id?: number; //  cart
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
  subTitle: string;
  endDateTime: Date;
}

interface HeroProps {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  variant: HeroVariant;
}

interface ConfirmationDialogProps { // resuable customised dialog component 
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
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
  ConfirmationDialogProps
};
