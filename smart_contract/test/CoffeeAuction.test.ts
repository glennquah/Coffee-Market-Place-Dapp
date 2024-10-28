import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { 
  CoffeeMarketplace,
  Product,
  SealedAuction,
  Hash
} from '../typechain-types';
import { deployContracts } from './test_setup/deployContract';

describe('Coffee Auction E2E Test', function () {
  let coffeeAuction: SealedAuction;
  let coffeeMarketplace: CoffeeMarketplace;
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
  
  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeMarketplace = contracts.coffeeMarketplace;
    product = contracts.product;
    owner = contracts.owner;
    roaster = contracts.roaster;
    customer1 = contracts.customer1;
    customer2 = contracts.customer2;
    coffeeAuction = contracts.coffeeAuction;
    hash = contracts.hash;
  });
  
  it("should have get minimum fee", async function() {
    const fee = await coffeeAuction.minimumAuctionFee();
    expect(fee).to.equal(auctionFee);
  });

  it("should allow auctioneer to auction a product", async function() {
    
    // Add a product from the roaster's address
    // const ipfsHash: string = 'https://example.com/panama.png'; // Dummy IPFS hash
    // const price = ethers.parseEther('0.1'); // 0.1 ETH
    // const quantity: number = 5; // Mint 5 NFTs
    // await expect(
    //   coffeeMarketplace
    //     .connect(roaster)
    //     .addRoasterListing(
    //       'Panama Geisha',
    //       'Delicate, jasmine-like aroma with hints of peach.',
    //       ipfsHash,
    //       price,
    //       quantity
    //     )
    // ).to.emit(coffeeMarketplace, 'ListingAdded');


    // // Approve the auction contract to transfer the product
    // // Currently having an error here where NFT is not under the roaster's address
    // (await coffeeMarketplace.connect(roaster).approve(coffeeAuction.getAddress(),productID));
    // for the testing of the contract, the product is not an NFT
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        productID,
        1,
        2,
        {from:roaster.getAddress(),value:auctionFee}
      )
    ).to.emit(coffeeAuction, 'AuctionCreated');
  });

  it("should allow bidder to commit a bid", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        1,
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
  
  it("should allow bidder to reveal a bid", async function() {
     // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        1,
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

  it("should allow auctioneer to finalize auction", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        1,
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
    ).to.emit(coffeeAuction,'AuctionFinalized')
    .to.emit(coffeeAuction,"NFTTransferred")
    .to.emit(coffeeAuction,"HighestBidTransferred");
  });

  it("should allow non-winning bidder to withdraw funds", async function() {
    // Auctioneer create a new auction
    await expect(
      coffeeAuction
      .connect(roaster)
      .createAuction(
        1,
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
        1,
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

