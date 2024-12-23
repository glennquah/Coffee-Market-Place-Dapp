import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { 
  CoffeeNFT,
  Product,
  SealedAuction,
  Hash
} from '../typechain-types';
import { deployContracts } from './test_setup/deployContract';

describe('Coffee Auction E2E Test', function () {
  let coffeeAuction: SealedAuction;
  let coffeeNFT: CoffeeNFT;
  let product: Product;
  let owner: Signer;
  let roaster: Signer;
  let customer1: Signer;
  let customer2: Signer;
  let hash: Hash;
  const productID = 1;
  const auctionFee = ethers.parseEther('0.01');
  const bidAmount1 = ethers.parseEther('1');
  const bidAmount2 = ethers.parseEther('12');
  const sampleNFT = {
    name: 'Panama Geisha',
    description: 'Delicate, jasmine-like aroma with hints of peach.',
    ipfsHash: 'https://example.com/panama.png',
    price: ethers.parseEther('0.1'),
    productId: 1,
    origin: 'Guatemala',
    roastLevel: 'Medium',
    beanType: 'Arabica',
    processMethod: 'Washed',
  };

  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeNFT = contracts.coffeeNFT;
    product = contracts.product;
    owner = contracts.owner;
    roaster = contracts.roaster;
    customer1 = contracts.customer1;
    customer2 = contracts.customer2;
    coffeeAuction = contracts.coffeeAuction;
    hash = contracts.hash;
    const ipfsHash: string = 'https://example.com/panama.png'; // Dummy IPFS hash
    const price = ethers.parseEther('0.1'); // 0.1 ETH
    const quantity: number = 5; // Mint 5 NFTs
    await coffeeNFT
      .connect(owner)
      .setAuctionContract(await coffeeAuction.getAddress());
    await coffeeAuction
    .connect(owner)
    .addAuctioneer(await roaster.getAddress());
    expect(await coffeeAuction.auctioneers(await roaster.getAddress())).to.equal(true);
    expect(await coffeeAuction.auctioneers(await customer1.getAddress())).to.equal(false);
  });
  
  it("should have get minimum fee", async function() {
    const fee = await coffeeAuction.minimumAuctionFee();
    expect(fee).to.equal(auctionFee);
  });

  it("should allow auctioneer to auction a product", async function() {
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
  });
  it("should revert if non-auctioneer to auction a product", async function() {
    await expect(
      coffeeAuction
      .connect(customer1)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:customer1.getAddress(),value:auctionFee}
      )
    ).to.revertedWith('Only auctioneer can call this');
  });

  it("should allow bidder to commit a bid", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');
    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');
  });

  it("should revert if bidder commits a bid with invalid auction ID", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          2, 
          hashValue1
        )
    ).to.be.revertedWith('Auction does not exist');
  });

  it("should revert if bidder commits a bid outside of commit phrase", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.be.revertedWith('Commit phase has ended');
  });
  
  it("should allow bidder to reveal a bid", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');
  });

  it("should revert if bidder reveals a bid with invalid auction ID", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');
    // Bidders reveal bids
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          2,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.be.revertedWith('Auction does not exist');
  });

  it("should revert if bidder reveals a bid outside of reveal phrase", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');
    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [180 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.be.revertedWith('Not within reveal phase');
  });

  it("should allow auctioneer to finalize auction", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(roaster)
        .finalizeAuction(1)
    ).to.emit(coffeeAuction,'AuctionFinalized')
    .to.emit(coffeeAuction,"NFTTransferred")
    .to.emit(coffeeAuction,"HighestBidTransferred");
  });

  it("should revert if non-owner or non-auctioneer finalizes auction", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .finalizeAuction(1)
    ).to.revertedWith('Only seller and owner can call this');
  });

  it("should revert if auctioneer finalizes auction with invalid auction ID", async function() {
    // Auctioneer create a new auction
   await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(owner)
        .finalizeAuction(2)
    ).to.revertedWith('Auction does not exist');
  });

  it("should revert if auctioneer finalizes auction outside of finalize phrase", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await expect(
      coffeeAuction
        .connect(roaster)
        .finalizeAuction(1)
    ).to.revertedWith('Reveal phase still ongoing');
  });

  it("should allow non-winning bidder to withdraw funds", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(roaster)
        .finalizeAuction(1)
    ).to.emit(coffeeAuction,'AuctionFinalized')
    .to.emit(coffeeAuction,"NFTTransferred")
    .to.emit(coffeeAuction,"HighestBidTransferred");

    // Non-winning bidder withdraw funds
    await expect(
      coffeeAuction
        .connect(customer1)
        .withdrawRefund(1) 
    ).to.emit(coffeeAuction,'RefundWithdrawn');
  });

  it("should allow owner to withdraw funds", async function() {
    // Auctioneer create a new auction
   await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        sampleNFT.productId,
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
    // Bidders commit bids
    const hashValue1 = await hash.hash(1,123);
    const hashValue2 = await hash.hash(12,123);
    await expect(
      coffeeAuction
        .connect(customer1)
        .commitBid(
          1, 
          hashValue1
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    await expect(
      coffeeAuction
        .connect(customer2)
        .commitBid(
          1, 
          hashValue2
        )
    ).to.emit(coffeeAuction, 'BidCommitted');

    // Bidders reveal bids
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(customer1)
        .revealBid(
          1,
          1,
          123,
          {from:customer1.getAddress(),value:bidAmount1}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    await expect(
      coffeeAuction
        .connect(customer2)
        .revealBid(
          1,
          12,
          123,
          {from:customer2.getAddress(),value:bidAmount2}
        )
    ).to.emit(coffeeAuction,'BidRevealed');

    // Auctioneer finalize auction
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    await expect(
      coffeeAuction
        .connect(roaster)
        .finalizeAuction(1)
    ).to.emit(coffeeAuction,'AuctionFinalized')
    .to.emit(coffeeAuction,"NFTTransferred")
    .to.emit(coffeeAuction,"HighestBidTransferred");
    
    let balanceBefore = await ethers.provider.getBalance(owner.getAddress());
    await expect(
      coffeeAuction
      .connect(owner)
      .ownerWithdraw()
    ).to.emit(coffeeAuction,'OwnerWithdraw');
    let balanceAfter = await ethers.provider.getBalance(owner.getAddress());
    expect(balanceAfter).to.be.gt(balanceBefore);
    
  });

});

