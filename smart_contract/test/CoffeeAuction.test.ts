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

  beforeEach(async function () {
    [owner,customer, roaster] = await ethers.getSigners();

    const CoffeeMarketplaceFactory: CoffeeMarketplace__factory =
      (await ethers.getContractFactory(
        'CoffeeMarketplace',
      )) as CoffeeMarketplace__factory;

    coffeeMarketplace = await CoffeeMarketplaceFactory.deploy();
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
  
  it('Should allow roaster to add product and mint NFTs', async function () {
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
  });


});

