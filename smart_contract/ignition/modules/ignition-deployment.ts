import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('TESTING MODULES', (m) => {
  const deployer = m.getAccount(0);

  const votingContract = m.contract(
    'Voting',
    [
      [
        'Jamaica Blue Mountain',
        'Colombia Narino Granos De Espreranza',
        'Vietnam Da Lat',
        'Sumatra Long Berry',
      ],
      // TODO: Add image URLs
      [
        'https://example.com/jamaica.png',
        'https://example.com/colombia.png',
        'https://example.com/vietnam.png',
        'https://example.com/sumatra.png',
      ],
      [
        'A smooth, mild coffee with floral and nutty undertones.',
        'A bright, fruity coffee with hints of citrus and chocolate.',
        'A bold coffee with nutty, chocolate flavors.',
        'Earthy and spicy with notes of herbs and tobacco.',
      ],
      ['Jamaica', 'Colombia', 'Vietnam', 'Sumatra'],
      ['Arabica', 'Arabica', 'Robusta', 'Arabica'],
      ['Medium', 'Medium-Light', 'Dark', 'Dark'],
      90, // 90 Minutes just for testing
    ],
    { from: deployer },
  );

  // @WAYNE ADD DEPLOYMENT HERE
  const coffeeNFTContract = m.contract(
    'CoffeeMarketplace',
    [],
    { from: deployer },
  );
  const auctionContract = m.contract(
    'Auction',
    [
      coffeeNFTContract.address,
      0.001,
    ],
    { from: deployer },
  );
  return { votingContract }; // Return the deployed contract
});
