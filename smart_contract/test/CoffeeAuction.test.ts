import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { 
  Auction, 
  Auction__factory, 
  CoffeeMarketplace, 
  CoffeeMarketplace__factory 
} from '../typechain-types';

describe('Coffee Auction E2E Test', function () {
  let coffeeAuction: Auction;
  let coffeeMarketplace: CoffeeMarketplace;
  let owner: Signer;
  let customer: Signer;
  let roaster: Signer;

  const roasters = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210abcdef9876543210abcdef98765432',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
    '0x1111111111111111111111111111111111111111'
  ];

  const names = [
    'Colombian Coffee',
    'Brazilian Santos',
    'Costa Rican Tarrazu',
    'Kenya AA',
    'Guatemala Antigua'
  ];

  const descriptions = [
    'Best Colombian Coffee',
    'A smooth coffee with mild acidity and balanced flavor.',
    'Rich body and flavor with notes of chocolate and citrus.',
    'Full-bodied coffee with wine-like acidity and berry flavors.',
    'Smooth and balanced with notes of cocoa and nuts.'
  ];

  const ipfsHashes = [
    'DummyHash',
    'https://example.com/brazil.png',
    'https://example.com/costa_rica.png',
    'https://example.com/kenya.png',
    'https://example.com/guatemala.png'
  ];

  const prices = [
    ethers.parseEther('0.1'), // 0.1 ETH
    ethers.parseEther('0.03'), // 0.03 ETH
    ethers.parseEther('0.025'), // 0.025 ETH
    ethers.parseEther('0.04'), // 0.04 ETH
    ethers.parseEther('0.015') // 0.015 ETH
  ];

  const quantities = [5, 10, 15, 20, 30];

  const nftIds = [ // can be any number of elements in the arr since the main initialisation of nftIds is addRoasterListing() in CoffeeMarketplace.sol 
    [1, 2, 3], 
    [4, 5, 6], 
    [7, 8, 9], 
    [10, 11, 12], 
    [13, 14, 15] 
  ];

  beforeEach(async function () {
    [owner,customer, roaster] = await ethers.getSigners();

    const CoffeeMarketplaceFactory: CoffeeMarketplace__factory =
      (await ethers.getContractFactory(
        'CoffeeMarketplace',
      )) as CoffeeMarketplace__factory;

    coffeeMarketplace = await CoffeeMarketplaceFactory.deploy(
      roasters,
      names,
      descriptions,
      ipfsHashes,
      prices,
      quantities,
      nftIds,
    );
    await coffeeMarketplace.waitForDeployment();

    const Auction: Auction__factory = (await ethers.getContractFactory(
      'Auction',
    )) as Auction__factory;

    coffeeAuction = await Auction.deploy(
      coffeeMarketplace.getAddress(),
      ethers.parseEther('0.01') 
    );
    await coffeeAuction.waitForDeployment();

    
  });
  

  it("should have get minimum fee", async function() {
    const fee = await coffeeAuction.getFee();
    expect(fee).to.equal(ethers.parseEther('0.01'));
  });

  it('Should allow auctioneer to auction a product', async function () {
    const ipfsHash: string = 'DummyHash'; // Dummy IPFS hash
    const price = ethers.parseEther('0.1'); // 0.1 ETH
    const quantity: number = 5; // Mint 5 NFTs

    // Add a product from the roaster's address
    await expect(
      coffeeMarketplace
        .connect(roaster)
        .addRoasterListing(
          'Colombian Coffee',
          'Best Colombian Coffee',
          ipfsHash,
          price,
          quantity,
        ),
    ).to.emit(coffeeMarketplace, 'ProductAdded');

    // Check if the product was added successfully
    const product = await coffeeMarketplace.getListing(1); // Product ID 1
    expect(product.name).to.equal('Colombian Coffee');
    expect(product.description).to.equal('Best Colombian Coffee');
    expect(product.ipfsHash).to.equal(ipfsHash);
    expect(product.price).to.equal(price);
    expect(product.quantity).to.equal(quantity);
    expect(product.available).to.be.true;

    // Check if NFTs were minted and owned by the smart contract (not the roaster)
    for (let i = 0; i < quantity; i++) {
      const tokenId = i + 1; // Token IDs start at 1
      expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
        await coffeeMarketplace.getAddress(),
      );
      expect(await coffeeMarketplace.tokenURI(tokenId)).to.equal(ipfsHash);
    }
    
    // Roaster approves the auction contract to transfer the NFTs
    await coffeeMarketplace
      .transferFrom(await coffeeMarketplace.getAddress(), coffeeAuction.getAddress(),1,{ from: await coffeeMarketplace.getAddress() });
    
    // Roaster auctions the product
    await expect(
      coffeeAuction.connect(roaster).createAuction(1,1,100,100,1,{from:roaster.getAddress(),value:ethers.parseEther("0.3")}),
    ).to.emit(coffeeAuction, 'AuctionCreated');

  });
});
