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
});
