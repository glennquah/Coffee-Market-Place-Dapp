async function main() {
  // Deploy Voting contract
  const Voting = await ethers.getContractFactory('Voting');
  // TODO: ADD PROPER PICTURE URLS
  const Voting_ = await Voting.deploy(
    [
      'Jamaica Blue Mountain',
      'Colombia Narino Granos De Espreranza',
      'Vietnam Da Lat',
      'Sumatra Long Berry',
    ],
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
    90, // Duration in minutes
  );

  console.log('Voting Contract address:', Voting_.address);

  // Deploy Coffee Market Place Contract @Wayne

  // Deploy Product contract @wayne
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
