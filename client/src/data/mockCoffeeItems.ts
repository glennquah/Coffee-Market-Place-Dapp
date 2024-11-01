import { CoffeeCardProps } from '../types/types';
import { voteEndTime } from '../data/voteEndTime';

const handleVote = () => {
  alert('Vote button clicked!');
};

const handleBid = () => {
  alert('Bid button clicked!');
};

const handleListing = () => {
  alert('Listing clicked!');
};

const imageUrls = {
  image1:
    'https://www.nativeamericancoffee.com/cdn/shop/products/CostaRican_276a85fd-9f2c-471c-81ca-e0a590fb0987_1400x.jpg?v=1603977811',
  image2: 'https://m.media-amazon.com/images/I/71GPU8X9StL.jpg',
  image3: 'https://s7d6.scene7.com/is/image/bjs/322416',
  image4:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfb174Q7aM37jOW6ddJJ_ueKGKhcCRk-2_WQ&s',
  image5: 'https://m.media-amazon.com/images/I/71O6J3vDlGL.jpg',
  image6:
    'https://m.media-amazon.com/images/I/71fl1jcEi0L._AC_UF894,1000_QL80_.jpg',
};

const coffeeMockListings: CoffeeCardProps[] = [
  {
    type: 'listing',
    imageUrl: imageUrls.image1,
    name: 'Costa Rican Raw Green Beans',
    price: '0.005634',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: imageUrls.image2,
    name: 'Hawaiian Kona Beans',
    price: '0.005634',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: imageUrls.image3,
    name: 'Colombian Supremo Beans',
    price: '0.005834',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: imageUrls.image4,
    name: 'Sumatra Mandheling Beans',
    price: '0.005434',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: imageUrls.image5,
    name: 'Ethiopian Yirgacheffe Beans',
    price: '0.005234',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: imageUrls.image6,
    name: 'Brazilian Santos Beans',
    price: '0.005034',
    onClickListing: handleListing,
  },
];

const coffeeMockAuctions: CoffeeCardProps[] = [
  {
    type: 'auction',
    imageUrl: imageUrls.image1,
    name: 'Panama Geisha Beans',
    bidEndDate: '30 December 2024, 10PM (SGT)',
    onBid: handleBid,
  },
  {
    type: 'auction',
    imageUrl: imageUrls.image2,
    name: 'Hawaiian Kona Beans',
    bidEndDate: '31 December 2024, 10PM (SGT)',
    onBid: handleBid,
  },
  {
    type: 'auction',
    imageUrl: imageUrls.image3,
    name: 'Colombian Supremo Beans',
    bidEndDate: '1 January 2025, 10PM (SGT)',
    onBid: handleBid,
  },
  {
    type: 'auction',
    imageUrl: imageUrls.image4,
    name: 'Sumatra Mandheling Beans',
    bidEndDate: '2 January 2025, 10PM (SGT)',
    onBid: handleBid,
  },
  {
    type: 'auction',
    imageUrl: imageUrls.image5,
    name: 'Ethiopian Yirgacheffe Beans',
    bidEndDate: '3 January 2025, 10PM (SGT)',
    onBid: handleBid,
  },
  {
    type: 'auction',
    imageUrl: imageUrls.image6,
    name: 'Brazilian Santos Beans',
    bidEndDate: '4 January 2025, 10PM (SGT)',
    onBid: handleBid,
  },
];

const coffeeMockVoting: CoffeeCardProps[] = [
  {
    type: 'voting',
    imageUrl: imageUrls.image1,
    name: 'Costa Rican Raw Green Beans',
    price: '0.005634',
    numberOfNFT: 10,
    id: 0,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
  {
    type: 'voting',
    imageUrl: imageUrls.image2,
    name: 'Hawaiian Kona Beans',
    price: '0.005334',
    numberOfNFT: 9,
    id: 1,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
  {
    type: 'voting',
    imageUrl: imageUrls.image3,
    name: 'Colombian Supremo Beans',
    price: '0.005834',
    numberOfNFT: 8,
    id: 2,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
  {
    type: 'voting',
    imageUrl: imageUrls.image4,
    name: 'Sumatra Mandheling Beans',
    price: '0.005434',
    numberOfNFT: 7,
    id: 3,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
  {
    type: 'voting',
    imageUrl: imageUrls.image5,
    name: 'Ethiopian Yirgacheffe Beans',
    price: '0.005234',
    numberOfNFT: 6,
    id: 4,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
  {
    type: 'voting',
    imageUrl: imageUrls.image6,
    name: 'Brazilian Santos Beans',
    price: '0.005034',
    numberOfNFT: 5,
    id: 5,
    qty: 10,
    voteEndDateTime: voteEndTime,
    onVote: handleVote,
  },
];

export {
  coffeeMockListings,
  coffeeMockAuctions,
  coffeeMockVoting,
  handleVote,
  handleBid,
  handleListing,
};
