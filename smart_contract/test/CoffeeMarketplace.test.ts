import { expect } from "chai";
import { ethers } from "hardhat";
import { CoffeeMarketplace, CoffeeMarketplace__factory } from "../typechain-types";
import { Signer } from "ethers";

describe("CoffeeMarketplace", function () {
  let coffeeMarketplace: CoffeeMarketplace;
  let owner: Signer;
  let roaster: Signer;

  beforeEach(async function () {
    const CoffeeMarketplaceFactory: CoffeeMarketplace__factory = await ethers.getContractFactory("CoffeeMarketplace") as CoffeeMarketplace__factory;
    [owner, roaster] = await ethers.getSigners();
    coffeeMarketplace = await CoffeeMarketplaceFactory.deploy();
    await coffeeMarketplace.waitForDeployment();
  });

  it("Should allow roaster to add product and mint NFTs", async function () {
    const ipfsHash: string = "DummyHash";  // Dummy IPFS hash
    const price = ethers.parseEther("0.1"); // 0.1 ETH
    const quantity: number = 5; // Mint 5 NFTs

    // Add a product from the roaster's address
    await expect(
      coffeeMarketplace.connect(roaster).addRoasterListing(
        "Colombian Coffee",
        "Best Colombian Coffee",
        ipfsHash,
        price,
        quantity
      )
    ).to.emit(coffeeMarketplace, "ProductAdded");

    // Check if the product was added successfully
    const product = await coffeeMarketplace.getProduct(1); // Product ID 1
    expect(product.name).to.equal("Colombian Coffee");
    expect(product.description).to.equal("Best Colombian Coffee");
    expect(product.ipfsHash).to.equal(ipfsHash);
    expect(product.price).to.equal(price);
    expect(product.quantity).to.equal(quantity);
    expect(product.available).to.be.true;

    // Check if NFTs were minted and owned by the smart contract (not the roaster)
    for (let i = 0; i < quantity; i++) {
      const tokenId = i + 1; // Token IDs start at 1
      expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(await coffeeMarketplace.getAddress());
      expect(await coffeeMarketplace.tokenURI(tokenId)).to.equal(ipfsHash);
    }
  });

  it("Should revert when trying to add product with zero price or quantity", async function () {
    const ipfsHash: string = "DummyHash";
    const zeroPrice = ethers.parseEther("0"); // 0 ETH
    const zeroQuantity: number = 0; // Invalid quantity

    await expect(
      coffeeMarketplace.connect(roaster).addRoasterListing(
        "Colombian Coffee",
        "Best Colombian Coffee",
        ipfsHash,
        zeroPrice,
        5
      )
    ).to.be.revertedWith("Price must be greater than zero.");

    await expect(
      coffeeMarketplace.connect(roaster).addRoasterListing(
        "Colombian Coffee",
        "Best Colombian Coffee",
        ipfsHash,
        ethers.parseEther("0.1"),
        zeroQuantity
      )
    ).to.be.revertedWith("Quantity must be greater than zero.");
  });

  it("Should allow viewing product details", async function () {
    const ipfsHash: string = "DummyHash";
    const price = ethers.parseEther("0.1");
    const quantity: number = 5;

    // Add a listing
    await expect(
      coffeeMarketplace.connect(roaster).addRoasterListing(
        "Colombian Coffee",
        "Best Colombian Coffee",
        ipfsHash,
        price,
        quantity
      )
    ).to.emit(coffeeMarketplace, "ProductAdded");

    // Fetch the product details
    const product = await coffeeMarketplace.getProduct(1);

    expect(product.name).to.equal("Colombian Coffee");
    expect(product.description).to.equal("Best Colombian Coffee");
    expect(product.ipfsHash).to.equal(ipfsHash);
    expect(product.price).to.equal(price);
    expect(product.quantity).to.equal(quantity);
    expect(product.available).to.be.true;
  });
});
