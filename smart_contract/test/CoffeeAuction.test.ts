import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { 
  CoffeeMarketplace,
  Product,
  SealedAuction,
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

  beforeEach(async function () {

    const contracts = await deployContracts();
    coffeeMarketplace = contracts.coffeeMarketplace;
    product = contracts.product;
    owner = contracts.owner;
    roaster = contracts.roaster;
    customer1 = contracts.customer1;
    customer2 = contracts.customer2;
    coffeeAuction = contracts.coffeeAuction;
  });
  

  it("should have get minimum fee", async function() {
    const fee = await coffeeAuction.minimumAuctionFee();
    expect(fee).to.equal(ethers.parseEther('0.01'));
  });

  it("should allow auctioneer to auction a product", async function() {
    const productID = 1;
    const productPrice = ethers.parseEther('1');
    const auctionFee = ethers.parseEther('0.01');
    const auctionDuration = 60;
    const auctioneer = roaster;
  });

  it("should allow bidder to commit a bid", async function() {
  });

  it("should allow bidder to reveal a bid", async function() {
  });

  it("should allow auctioneer to finalize auction", async function() {
    it("Winning bidder should have NFT", async function() {
    });

    it("Funds should be transferred to auctioneer", async function() {
    });
  });

  it("should allow non-winning bidder to withdraw funds", async function() {
  });



  
});

