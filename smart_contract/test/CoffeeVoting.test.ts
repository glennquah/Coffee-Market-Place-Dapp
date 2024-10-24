import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { Voting, Voting__factory } from '../typechain-types';

describe('Coffee Voting E2E Test', function () {
  let coffeeVoting: Voting;
  let owner: Signer;
  let customer: Signer;

  beforeEach(async function () {
    const Voting: Voting__factory = (await ethers.getContractFactory(
      'Voting',
    )) as Voting__factory;
    [owner, customer] = await ethers.getSigners();
    coffeeVoting = await Voting.deploy(
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
    await coffeeVoting.waitForDeployment();
  });

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
});
