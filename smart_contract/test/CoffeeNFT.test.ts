import { expect } from 'chai';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import { CoffeeNFT,SealedAuction } from '../typechain-types';
import { deployContracts } from './test_setup/deployContract';

describe('CoffeeNFT', function () {
  let coffeeNFT: CoffeeNFT;
  let owner: Signer;
  let marketplaceOperator: Signer; // regular signer acting as marketplace
  let auctionContract: SealedAuction; // regular signer acting as auction
  let roaster: Signer;
  let buyer: Signer;

  const sampleNFT = {
    name: 'Panama Geisha',
    description: 'Delicate, jasmine-like aroma with hints of peach.',
    ipfsHash: 'https://example.com/panama.png',
    price: ethers.parseEther('0.1'),
    origin: 'Guatemala',
    roastLevel: 'Medium',
    beanType: 'Arabica',
    processMethod: 'Washed',
  };

  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeNFT = contracts.coffeeNFT;
    owner = contracts.owner;
    roaster = contracts.roaster;
    buyer = contracts.buyer;
    marketplaceOperator = contracts.marketplaceOperator; // Get a signer to act as marketplace
    auctionContract = contracts.coffeeAuction; 

    // Set marketplace operator address as the authorized marketplace
    await coffeeNFT
      .connect(owner)
      .setMarketplaceContract(await marketplaceOperator.getAddress());
    // Set auction contract address as the authorized marketplace
    await coffeeNFT
      .connect(owner)
      .setAuctionContract(await auctionContract.getAddress());
  });

  describe('Setup', function () {
    it('Should set the marketplace address correctly', async function () {
      const marketplaceAddress = await marketplaceOperator.getAddress();
      expect(await coffeeNFT.marketplaceContract()).to.equal(
        marketplaceAddress,
      );
    });

    it('Should not allow setting zero address as marketplace', async function () {
      await expect(
        coffeeNFT.connect(owner).setMarketplaceContract(ethers.ZeroAddress),
      ).to.be.revertedWith('Invalid marketplace address');
    });

    it('Should set the auction address correctly', async function () {
      const auctionContractAddress = await auctionContract.getAddress();
      expect(await coffeeNFT.auctionContract()).to.equal(
        auctionContractAddress,
      );
    });

    it('Should not allow setting zero address as auction', async function () {
      await expect(
        coffeeNFT.connect(owner).setAuctionContract(ethers.ZeroAddress),
      ).to.be.revertedWith('Invalid auction address');
    });
  });

  describe('Minting', function () {
    it('Should allow marketplace to mint NFTs', async function () {
      const tx = await coffeeNFT.connect(marketplaceOperator).mint(
        await buyer.getAddress(),
        sampleNFT.name,
        sampleNFT.description,
        sampleNFT.ipfsHash,
        1, // productId
        sampleNFT.price,
        sampleNFT.origin,
        sampleNFT.roastLevel,
        sampleNFT.beanType,
        sampleNFT.processMethod,
      );

      const receipt = await tx.wait();
      expect(receipt).to.emit(coffeeNFT, 'NFTMinted');

      const tokenId = 1;
      expect(await coffeeNFT.ownerOf(tokenId)).to.equal(
        await buyer.getAddress(),
      );

      const metadata = await coffeeNFT.getNFTMetadata(tokenId);
      expect(metadata.name).to.equal(sampleNFT.name);
      expect(metadata.description).to.equal(sampleNFT.description);
      expect(metadata.ipfsHash).to.equal(sampleNFT.ipfsHash);
      expect(metadata.origin).to.equal(sampleNFT.origin);
      expect(metadata.roastLevel).to.equal(sampleNFT.roastLevel);
      expect(metadata.beanType).to.equal(sampleNFT.beanType);
      expect(metadata.processMethod).to.equal(sampleNFT.processMethod);
    });

    it('Should not allow non-administrator addresses to mint', async function () {
      await expect(
        coffeeNFT
          .connect(buyer)
          .mint(
            await buyer.getAddress(),
            sampleNFT.name,
            sampleNFT.description,
            sampleNFT.ipfsHash,
            1,
            sampleNFT.price,
            sampleNFT.origin,
            sampleNFT.roastLevel,
            sampleNFT.beanType,
            sampleNFT.processMethod,
          ),
      ).to.be.revertedWith('Only administrators can call this function');
    });
  });

  describe('Metadata Management', function () {
    let tokenId: number;
    const updatedNFT = {
      name: 'Premium Panama Geisha',
      description:
        'Delicate, jasmine-like aroma with hints of peach. Delicious!',
      ipfsHash: 'https://example.com/updated.png',
      origin: 'Kenya',
      roastLevel: 'Medium',
      beanType: 'Arabica',
      processMethod: 'Washed',
    };

    beforeEach(async function () {
      // Mint a token for testing metadata
      const tx = await coffeeNFT
        .connect(marketplaceOperator)
        .mint(
          await buyer.getAddress(),
          sampleNFT.name,
          sampleNFT.description,
          sampleNFT.ipfsHash,
          1,
          sampleNFT.price,
          sampleNFT.origin,
          sampleNFT.roastLevel,
          sampleNFT.beanType,
          sampleNFT.processMethod,
        );
      const receipt = await tx.wait();
      tokenId = 1;
    });

    it('Should allow marketplace to update metadata', async function () {
      await expect(
        coffeeNFT
          .connect(marketplaceOperator)
          .updateNFTMetadata(
            tokenId,
            updatedNFT.name,
            updatedNFT.description,
            updatedNFT.ipfsHash,
            updatedNFT.origin,
            updatedNFT.roastLevel,
            updatedNFT.beanType,
            updatedNFT.processMethod,
          ),
      ).to.emit(coffeeNFT, 'MetadataUpdated');

      const metadata = await coffeeNFT.getNFTMetadata(tokenId);
      expect(metadata.name).to.equal(updatedNFT.name);
      expect(metadata.description).to.equal(updatedNFT.description);
      expect(metadata.ipfsHash).to.equal(updatedNFT.ipfsHash);
      expect(metadata.origin).to.equal(updatedNFT.origin);
      expect(metadata.roastLevel).to.equal(updatedNFT.roastLevel);
      expect(metadata.beanType).to.equal(updatedNFT.beanType);
      expect(metadata.processMethod).to.equal(updatedNFT.processMethod);
    });

    it('Should not allow non-administrator addresses to update metadata', async function () {
      await expect(
        coffeeNFT
          .connect(buyer)
          .updateNFTMetadata(
            tokenId,
            updatedNFT.name,
            updatedNFT.description,
            updatedNFT.ipfsHash,
            updatedNFT.origin,
            updatedNFT.roastLevel,
            updatedNFT.beanType,
            updatedNFT.processMethod,
          ),
      ).to.be.revertedWith('Only administrators can call this function');
    });

    it('Should retrieve correct NFT metadata', async function () {
      const metadata = await coffeeNFT.getNFTMetadata(tokenId);

      expect(metadata.name).to.equal(sampleNFT.name);
      expect(metadata.description).to.equal(sampleNFT.description);
      expect(metadata.ipfsHash).to.equal(sampleNFT.ipfsHash);
      expect(metadata.origin).to.equal(sampleNFT.origin);
      expect(metadata.roastLevel).to.equal(sampleNFT.roastLevel);
      expect(metadata.beanType).to.equal(sampleNFT.beanType);
      expect(metadata.processMethod).to.equal(sampleNFT.processMethod);
      expect(metadata.isActive).to.be.true;
    });

    it('Should revert when querying non-existent token metadata', async function () {
      const nonExistentTokenId = 999;
      await expect(coffeeNFT.getNFTMetadata(nonExistentTokenId)).to.be.reverted;
    });
  });

  describe('Token Enumeration', function () {
    beforeEach(async function () {
      // Mint multiple tokens to different addresses
      await coffeeNFT
        .connect(marketplaceOperator)
        .mint(
          await buyer.getAddress(),
          sampleNFT.name,
          sampleNFT.description,
          sampleNFT.ipfsHash,
          1,
          sampleNFT.price,
          sampleNFT.origin,
          sampleNFT.roastLevel,
          sampleNFT.beanType,
          sampleNFT.processMethod,
        );

      await coffeeNFT
        .connect(marketplaceOperator)
        .mint(
          await buyer.getAddress(),
          `${sampleNFT.name} #2`,
          `${sampleNFT.description} Second batch.`,
          'https://example.com/panama2.png',
          1,
          sampleNFT.price,
          'Colombia',
          sampleNFT.roastLevel,
          sampleNFT.beanType,
          sampleNFT.processMethod,
        );
    });

    it('Should return all NFTs owned by an address', async function () {
      const buyerAddress = await buyer.getAddress();
      const [tokenIds, metadataArray] =
        await coffeeNFT.getNFTsByOwner(buyerAddress);

      expect(tokenIds.length).to.equal(2);
      expect(metadataArray.length).to.equal(2);

      expect(metadataArray[0].name).to.equal(sampleNFT.name);
      expect(metadataArray[1].name).to.equal(`${sampleNFT.name} #2`);

      expect(metadataArray[0].origin).to.equal(sampleNFT.origin);
      expect(metadataArray[1].origin).to.equal('Colombia');
    });

    it('Should return empty arrays for address with no NFTs', async function () {
      const [tokenIds, metadataArray] = await coffeeNFT.getNFTsByOwner(
        await roaster.getAddress(),
      );

      expect(tokenIds.length).to.equal(0);
      expect(metadataArray.length).to.equal(0);
    });
  });
});
