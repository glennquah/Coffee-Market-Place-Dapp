import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import {
  CoffeeMarketplace,
  CoffeeMarketplace__factory,
  Product,
  Product__factory,
  Voting,
  Voting__factory,
} from '../typechain-types';

describe('Coffee Voting E2E Test', function () {
  let coffeeMarketplace: CoffeeMarketplace;
  let coffeeVoting: Voting;
  let product: Product;
  let owner: Signer;
  let roaster: Signer;
  let customer: Signer;

  const roasters = [
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x9876543210abcdef9876543210abcdef98765432',
    '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
    '0x1111111111111111111111111111111111111111',
  ];

  const names = [
    'Colombian Coffee',
    'Brazilian Santos',
    'Costa Rican Tarrazu',
    'Kenya AA',
    'Guatemala Antigua',
  ];

  const descriptions = [
    'Best Colombian Coffee',
    'A smooth coffee with mild acidity and balanced flavor.',
    'Rich body and flavor with notes of chocolate and citrus.',
    'Full-bodied coffee with wine-like acidity and berry flavors.',
    'Smooth and balanced with notes of cocoa and nuts.',
  ];

  const ipfsHashes = [
    'https://example.com/columbian.png',
    'https://example.com/brazil.png',
    'https://example.com/costa_rica.png',
    'https://example.com/kenya.png',
    'https://example.com/guatemala.png',
  ];

  const prices = [
    ethers.parseEther('0.1'), // 0.1 ETH
    ethers.parseEther('0.03'), // 0.03 ETH
    ethers.parseEther('0.025'), // 0.025 ETH
    ethers.parseEther('0.04'), // 0.04 ETH
    ethers.parseEther('0.015'), // 0.015 ETH
  ];

  const quantities = [5, 10, 15, 20, 30];
  const nftIds = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
  ];

  beforeEach(async function () {
    [owner, roaster, customer] = await ethers.getSigners();

    product = await deployProduct();
    coffeeMarketplace = await deployCoffeeMarketplace(product);
    coffeeVoting = await deployVoting(coffeeMarketplace);
  });

  async function deployProduct() {
    const ProductFactory: Product__factory = (await ethers.getContractFactory(
      'Product',
    )) as Product__factory;
    return ProductFactory.deploy(
      roasters,
      names,
      descriptions,
      ipfsHashes,
      prices,
      quantities,
      nftIds,
    );
  }

  async function deployCoffeeMarketplace(product: Product) {
    const CoffeeMarketplaceFactory: CoffeeMarketplace__factory =
      (await ethers.getContractFactory(
        'CoffeeMarketplace',
      )) as CoffeeMarketplace__factory;
    return CoffeeMarketplaceFactory.deploy(product);
  }

  async function deployVoting(marketplace: CoffeeMarketplace) {
    const VotingFactory: Voting__factory = (await ethers.getContractFactory(
      'Voting',
    )) as Voting__factory;
    const voting = await VotingFactory.deploy(
      marketplace.getAddress(),
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
      [
        ethers.parseEther('0.1'),
        ethers.parseEther('0.03'),
        ethers.parseEther('0.025'),
        ethers.parseEther('0.04'),
      ],
      90,
    );
    await voting.waitForDeployment();
    return voting;
  }

  it('Should have 4 initial coffee candidates', async function () {
    const candidates = await coffeeVoting.getAllVotesOfCoffeeCandiates();
    expect(candidates.length).to.equal(4);
    expect(candidates[0].coffeeName).to.equal('Jamaica Blue Mountain');
  });

  it('Should allow owner to add a coffee candidate', async function () {
    await expect(
      coffeeVoting
        .connect(owner)
        .addCoffeeCandidate(
          'Ethiopia Yirgacheffe',
          'https://example.com/ethiopia.png',
          'A bright, fruity coffee with hints of citrus and chocolate.',
          'Ethiopia',
          'Arabica',
          'Medium-Light',
          ethers.parseEther('0.05'),
        ),
    ).to.emit(coffeeVoting, 'CoffeeCandidateAdded');

    // Check if the Coffee Candidate was added successfully
    const CoffeeCandidateAdded = await coffeeVoting.getCoffeeCandidate(4);
    expect(CoffeeCandidateAdded.coffeeName).to.equal('Ethiopia Yirgacheffe');
    expect(CoffeeCandidateAdded.imageUrl).to.equal(
      'https://example.com/ethiopia.png',
    );
    expect(CoffeeCandidateAdded.description).to.equal(
      'A bright, fruity coffee with hints of citrus and chocolate.',
    );
    expect(CoffeeCandidateAdded.coffeeOrigin).to.equal('Ethiopia');
    expect(CoffeeCandidateAdded.beanType).to.equal('Arabica');
    expect(CoffeeCandidateAdded.roastLevel).to.equal('Medium-Light');
  });

  it('Should allow customer to vote for a coffee candidate', async function () {
    await expect(coffeeVoting.connect(customer).vote(1)).to.emit(
      coffeeVoting,
      'CoffeeVoted',
    );
    const votes = await coffeeVoting.getAllVotesOfCoffeeCandiates();
    // Check if the vote was added successfully
    expect(votes[1].voteCount).to.equal(1);
    expect(votes[0].voteCount).to.equal(0);
  });

  it('Should throw error when customer tries to vote for an invalid coffee candidate', async function () {
    await expect(coffeeVoting.connect(customer).vote(5)).to.be.revertedWith(
      'Invalid coffee candidate, please select a valid coffee candidate.',
    );
  });

  it('Should throw error when customer tries to vote for a second time', async function () {
    await expect(coffeeVoting.connect(customer).vote(1)).to.emit(
      coffeeVoting,
      'CoffeeVoted',
    );
    await expect(coffeeVoting.connect(customer).vote(1)).to.be.revertedWith(
      'You have already voted for a coffee.',
    );
  });

  it('Check if its open for voting', async function () {
    expect(await coffeeVoting.isOpenToVote()).to.be.true;
  });

  it('Should give back the remaining time for voting', async function () {
    expect(await coffeeVoting.getRemainingTimeLeftToVote()).to.be.greaterThan(
      0,
    );
  });

  it('Check if its closed for voting (AFTER 90 MINUTES)', async function () {
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');

    expect(await coffeeVoting.isOpenToVote()).to.be.false;
    await expect(coffeeVoting.connect(customer).vote(1)).to.be.revertedWith(
      'Voting is closed.',
    );
  });

  it('Should return error when getting coffee candidate when voting is still ongoing', async function () {
    await coffeeVoting.connect(customer).vote(1);
    await expect(coffeeVoting.getWinner()).to.be.revertedWith(
      'Voting is still open.',
    );
  });

  it('Should return winner when voting has ended', async function () {
    await coffeeVoting.connect(customer).vote(1);
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    expect(await coffeeVoting.isOpenToVote()).to.be.false;
    const winner = await coffeeVoting.getWinner();
    expect(winner.coffeeName).to.equal('Colombia Narino Granos De Espreranza');
    expect(winner.voteCount).to.equal(1);
  });

  it('Should Get Winner and Mint 100 NFTs when voting has ended', async function () {
    await coffeeVoting.connect(customer).vote(1);
    await ethers.provider.send('evm_increaseTime', [90 * 60]);
    await ethers.provider.send('evm_mine');
    expect(await coffeeVoting.isOpenToVote()).to.be.false;
    const winner = await coffeeVoting.getWinner();
    expect(winner.coffeeName).to.equal('Colombia Narino Granos De Espreranza');
    expect(winner.voteCount).to.equal(1);
    await expect(coffeeVoting.finalizeVotingAndMintNFTs()).to.emit(
      coffeeVoting,
      'VotingFinalized',
    );
  });
});
