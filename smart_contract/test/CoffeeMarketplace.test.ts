// import { expect } from 'chai';
// import { Signer } from 'ethers';
// import { ethers } from 'hardhat';
// import {
//   CoffeeMarketplace,
//   CoffeeMarketplace__factory,
//   Product,
//   Product__factory,
//   Leaderboard,
//   Leaderboard__factory,
//   Order,
//   Order__factory
// } from '../typechain-types';
// import { deployContracts } from './test_setup/deployContract';
// import { orderSeedData } from '../ignition/modules/seed_data/orderSeedData';

// describe('CoffeeMarketplace', function () {
//   let coffeeMarketplace: CoffeeMarketplace;
//   let product: Product;
//   let owner: Signer;
//   let roaster: Signer;
//   let order: Order;
//   let buyer: Signer;
//   let secondBuyer: Signer;
//   let leaderboard: Leaderboard;

//   const customerOrders = orderSeedData.customerAddresses.map(
//     (address, index) => ({
//       address,
//       items: orderSeedData.orderItems[index],
//       totalAmount: orderSeedData.totalAmounts[index],
//       timestamp: orderSeedData.timestamps[index],
//     })
//   );

//   const [customer1Order, customer2Order, customer3Order] = customerOrders;



//   beforeEach(async function () {
//     [owner, roaster, buyer, secondBuyer] = await ethers.getSigners();

//     // const contracts = await deployContracts(); // Doesn't work well
//     // coffeeMarketplace = contracts.coffeeMarketplace;
//     // product = contracts.product;
//     // order = contracts.order;
//     // leaderboard = contracts.leaderboard;
//   });

//   async function createOrderFromData(orderData: {
//     address: string;
//     items: { productId: number; quantity: number }[];
//     totalAmount: bigint;
//     timestamp: number;
//   }) {
//     const { address, items, totalAmount, timestamp } = orderData;
//     await order.createOrder(address, items, totalAmount, timestamp);
//   }

//   const roasters = [
//     '0x1234567890abcdef1234567890abcdef12345678',
//     '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
//     '0x9876543210abcdef9876543210abcdef98765432',
//     '0xabcabcabcabcabcabcabcabcabcabcabcabcabc0',
//     '0x1111111111111111111111111111111111111111'
//   ];

//   const names = [
//     'Colombian Coffee',
//     'Brazilian Santos',
//     'Costa Rican Tarrazu',
//     'Kenya AA',
//     'Guatemala Antigua'
//   ];

//   const descriptions = [
//     'Best Colombian Coffee',
//     'A smooth coffee with mild acidity and balanced flavor.',
//     'Rich body and flavor with notes of chocolate and citrus.',
//     'Full-bodied coffee with wine-like acidity and berry flavors.',
//     'Smooth and balanced with notes of cocoa and nuts.'
//   ];

//   const tokenURIs = [
//     'https://example.com/columbian.png',
//     'https://example.com/brazil.png',
//     'https://example.com/costa_rica.png',
//     'https://example.com/kenya.png',
//     'https://example.com/guatemala.png'
//   ];

//   const prices = [
//     ethers.parseEther('0.1'), // 0.1 ETH
//     ethers.parseEther('0.03'), // 0.03 ETH
//     ethers.parseEther('0.025'), // 0.025 ETH
//     ethers.parseEther('0.04'), // 0.04 ETH
//     ethers.parseEther('0.015') // 0.015 ETH
//   ];

//   const quantities = [5, 10, 15, 20, 30];

//   const nftIds = [ // can be any number of elements in the arr since the main initialisation of nftIds is addRoasterListing() in CoffeeMarketplace.sol 
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//     [10, 11, 12],
//     [13, 14, 15]
//   ];


//   const origins = ['Colombia', 'Brazil', 'Costa Rica', 'Kenya', 'Guatemala'];
//   const roastLevels = ['Medium', 'Light', 'Dark', 'Dark', 'Medium'];
//   const beanTypes = ['Arabica', 'Robusta', 'Arabica', 'Robusta', 'Arabica'];
//   const processMethods = ['Washed', 'Natural', 'Washed', 'Washed', 'Honey'];
//   const roastDates = Array(5).fill(Math.floor(Date.now() / 1000));

//   // Deploy Product contract
//   const ProductFactory = await ethers.getContractFactory('Product');
//   product = await ProductFactory.deploy(
//     roasters,
//     names,
//     descriptions,
//     tokenURIs,
//     prices,
//     quantities,
//     nftIds,
//     origins,
//     roastLevels,
//     beanTypes,
//     processMethods,
//     roastDates
//   );

//   // Deploy CoffeeMarketplace contract
//   const CoffeeMarketplaceFactory = await ethers.getContractFactory('CoffeeMarketplace');
//   coffeeMarketplace = await CoffeeMarketplaceFactory.deploy(
//     product.getAddress()
//   );
//   await coffeeMarketplace.waitForDeployment();

// });


// describe('Listing Creation', function () {
//   it('Should allow roaster to add product listing with correct metadata', async function () {
//     const ipfsHash: string = 'https://example.com/panama.png'; // Dummy IPFS hash
//     const price = ethers.parseEther('0.1'); // 0.1 ETH
//     const quantity: number = 5; // Mint 5 NFTs
//     // Add a product from the roaster's address
//     await expect(
//       coffeeMarketplace.connect(roaster).addRoasterListing(
//         'Panama Geisha',
//         'Delicate, jasmine-like aroma with hints of peach.',
//         ipfsHash,
//         price,
//         quantity,
//         'Guatemala',
//         'Medium',
//         'Arabica',
//         'Washed'
//       )
//     )
//       .to.emit(coffeeMarketplace, 'ListingAdded')
//       .to.emit(coffeeMarketplace, 'NFTMinted');

//     // Check if the product was added successfully
//     const product = await coffeeMarketplace.getListing(6); // Listing ID will be 6, after 5 pre-existing listings
//     expect(product.name).to.equal('Panama Geisha');
//     expect(product.description).to.equal('Delicate, jasmine-like aroma with hints of peach.');
//     expect(product.tokenURI).to.equal(ipfsHash);
//     expect(product.price).to.equal(price);
//     expect(product.quantity).to.equal(quantity);
//     expect(product.origin).to.equal('Guatemala');
//     expect(product.roastLevel).to.equal('Medium');
//     expect(product.beanType).to.equal('Arabica');
//     expect(product.processMethod).to.equal('Washed');
//     expect(product.available).to.be.true;

//     // Iterate over each NFT ID and verify ownership and metadata
//     for (let i = 0; i < product.nftIds.length; i++) {
//       const tokenId = product.nftIds[i];


//       expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(await coffeeMarketplace.getAddress());
//       expect(await coffeeMarketplace.tokenURI(tokenId)).to.equal(ipfsHash);
//     }
//   });

//   it('Should revert when trying to add product with zero price or quantity', async function () {
//     const ipfsHash: string = 'https://example.com/panama.png';
//     const zeroPrice = ethers.parseEther('0'); // 0 ETH
//     const zeroQuantity: number = 0; // Invalid quantity

//     await expect(
//       coffeeMarketplace.connect(roaster).addRoasterListing(
//         'Panama Geisha',
//         'Delicate, jasmine-like aroma with hints of peach.',
//         ipfsHash,
//         zeroPrice,
//         5,
//         'Guatemala',
//         'Medium',
//         'Arabica',
//         'Washed'
//       )
//     ).to.be.revertedWith('Price must be greater than zero.');

//     await expect(
//       coffeeMarketplace
//         .connect(roaster)
//         .addRoasterListing(
//           'Panama Geisha',
//           'Delicate, jasmine-like aroma with hints of peach.',
//           ipfsHash,
//           ethers.parseEther('0.1'),
//           zeroQuantity,
//           'Guatemala',
//           'Medium',
//           'Arabica',
//           'Washed'
//         ),
//     ).to.be.revertedWith('Quantity must be greater than zero.');
//   })
// });

// describe('NFT Purchases', function () {
//   const listingId = 6;
//   const ipfsHash: string = 'https://example.com/panama.png';
//   const price = ethers.parseEther('0.1'); // 0.1 ETH

//   beforeEach(async function () {
//     const quantity: number = 3;

//     // Mint NFTs for the listing
//     await coffeeMarketplace.connect(roaster).addRoasterListing(
//       'Panama Geisha',
//       'Delicate, jasmine-like aroma with hints of peach.',
//       ipfsHash,
//       price,
//       quantity,
//       'Guatemala',
//       'Medium',
//       'Arabica',
//       'Washed'
//     );
//   });

//   it('Should allow single NFT purchase', async function () {
//     // Get the NFT IDs for listing 6
//     const listing = await coffeeMarketplace.getListing(listingId);
//     const tokenId = listing.nftIds[0];  // Get first NFT ID from the listing

//     const buyerAddress = await buyer.getAddress();
//     const roasterAddress = await roaster.getAddress();

//     // Get initial balances
//     const buyerBalanceBefore = await ethers.provider.getBalance(buyerAddress);
//     const roasterBalanceBefore = await ethers.provider.getBalance(roasterAddress);

//     // Verify NFT is owned by marketplace before purchase
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
//       await coffeeMarketplace.getAddress()
//     );

//     // Verify NFT is available for purchase
//     expect(await coffeeMarketplace.isNFTAvailableForPurchase(tokenId)).to.be.true;

//     // Purchase NFT
//     await expect(
//       coffeeMarketplace.connect(buyer).purchaseNFT(listingId, tokenId, {
//         value: price,
//       })
//     )
//       .to.emit(coffeeMarketplace, 'NFTPurchased')
//       .withArgs(listingId, tokenId, buyerAddress, price);

//     // Verify new ownership
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);

//     // Verify NFT is no longer available for purchase
//     expect(await coffeeMarketplace.isNFTAvailableForPurchase(tokenId)).to.be
//       .false;

//     // Verify balances have been updated correctly
//     const roasterBalanceAfter = await ethers.provider.getBalance(roasterAddress);
//     expect(roasterBalanceAfter - roasterBalanceBefore).to.equal(price);

//     // Get listing details and verify quantity updated
//     const updatedListing = await coffeeMarketplace.getListing(listingId);
//     expect(updatedListing.quantity).to.equal(2); // Original quantity (3) - 1
//   });

//   // it('Should allow bulk NFT purchase', async function () {
//   //   const tokenIds = [2, 3];
//   //   const buyerAddress = await buyer.getAddress();
//   //   const roasterAddress = await roaster.getAddress();

//   //   // Calculate total price from metadata
//   //   let totalPrice = BigInt(0);
//   //   for (const tokenId of tokenIds) {
//   //     const metadata = await coffeeMarketplace.tokenMetadata(tokenId);
//   //     totalPrice += metadata.price;
//   //   }

//   //   // Get initial balances
//   //   const buyerBalanceBefore = await ethers.provider.getBalance(buyerAddress);
//   //   const roasterBalanceBefore = await ethers.provider.getBalance(roasterAddress);

//   //   // Verify initial ownership and availability
//   //   for (const tokenId of tokenIds) {
//   //     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
//   //       await coffeeMarketplace.getAddress()
//   //     );
//   //     expect(await coffeeMarketplace.isNFTAvailableForPurchase(tokenId)).to.be
//   //       .true;
//   //   }

//   //   // Get initial listing details
//   //   const initialListing = await coffeeMarketplace.getListing(listingId);
//   //   const initialQuantity = initialListing.quantity;

//   //   // Purchase NFTs in bulk
//   //   const tx = await coffeeMarketplace.connect(buyer).bulkPurchaseNFTs(listingId, tokenIds, {
//   //     value: totalPrice,
//   //   });

//   //   // Verify NFTPurchased events are emitted for each token
//   //   await Promise.all(tokenIds.map(async (tokenId) => {
//   //     await expect(tx)
//   //       .to.emit(coffeeMarketplace, 'NFTPurchased')
//   //       .withArgs(listingId, tokenId, buyerAddress, price); // price per token
//   //   }));

//   //   // Verify new ownership and availability
//   //   for (const tokenId of tokenIds) {
//   //     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);
//   //     expect(await coffeeMarketplace.isNFTAvailableForPurchase(tokenId)).to.be
//   //       .false;
//   //   }

//   //   // Verify balances have been updated correctly
//   //   const roasterBalanceAfter = await ethers.provider.getBalance(roasterAddress);
//   //   expect(roasterBalanceAfter - roasterBalanceBefore).to.equal(totalPrice);

//   //   // Verify listing quantity has been updated
//   //   const updatedListing = await coffeeMarketplace.getListing(listingId);
//   //   expect(updatedListing.quantity).to.equal(initialQuantity - BigInt(tokenIds.length));
//   // });

//   it('Should revert purchase if NFT is not available', async function () {
//     const tokenId = 1;

//     // Get the actual price from metadata
//     const metadata = await coffeeMarketplace.tokenMetadata(tokenId);
//     const nftPrice = metadata.price;

//     // First purchase
//     await coffeeMarketplace.connect(buyer).purchaseNFT(listingId, tokenId, {
//       value: nftPrice,
//     });

//     // Attempt second purchase of same NFT
//     await expect(
//       coffeeMarketplace.connect(secondBuyer).purchaseNFT(listingId, tokenId, {
//         value: nftPrice,
//       })
//     ).to.be.revertedWith('NFT not owned by marketplace');
//   });

//   it('Should revert purchase if insufficient payment provided', async function () {
//     const tokenId = 1;
//     const insufficientPrice = ethers.parseEther('0.05'); // Half the required price

//     await expect(
//       coffeeMarketplace.connect(buyer).purchaseNFT(listingId, tokenId, {
//         value: insufficientPrice,
//       })
//     ).to.be.revertedWith('Insufficient payment');
//   });

//   it('Should revert bulk purchase if any NFT is unavailable', async function () {
//     const tokenIds = [1, 2];
//     const totalPrice = price * BigInt(tokenIds.length);

//     // Purchase first NFT individually
//     await coffeeMarketplace.connect(buyer).purchaseNFT(listingId, tokenIds[0], {
//       value: price,
//     });

//     // Attempt bulk purchase including the already purchased NFT
//     await expect(
//       coffeeMarketplace.connect(secondBuyer).bulkPurchaseNFTs(listingId, tokenIds, {
//         value: totalPrice,
//       })
//     ).to.be.revertedWith('NFT not owned by marketplace');
//   });

//   it('Should revert bulk purchase if insufficient total payment', async function () {
//     const tokenIds = [1, 2];
//     const insufficientTotalPrice = price + ethers.parseEther('0.05'); // Less than required for two NFTs

//     await expect(
//       coffeeMarketplace.connect(buyer).bulkPurchaseNFTs(listingId, tokenIds, {
//         value: insufficientTotalPrice,
//       })
//     ).to.be.revertedWith('Insufficient payment');
//   });

//   //   it('Should update listing status when all NFTs are sold', async function () {
//   //     const listing = await coffeeMarketplace.getListing(6); // Get listing created in beforeEach
//   //     const allTokenIds = listing.nftIds; // Get all NFT IDs for this listing
//   //     const totalPrice = price * BigInt(allTokenIds.length);

//   //     await coffeeMarketplace.connect(buyer).bulkPurchaseNFTs(listingId, allTokenIds, {
//   //       value: totalPrice,
//   //     });

//   //     // Purchase all NFTs in the listing at once using bulkPurchaseNFTs
//   //     // Get the updated listing details
//   //     const updatedListing = await coffeeMarketplace.getListing(6);
//   //     expect(listing.available).to.be.false;
//   //     expect(listing.quantity).to.equal(0);
//   //   });
// });

// describe('NFT Transfers', function () {
//   const listingId = 6;
//   const ipfsHash: string = 'https://example.com/panama.png';
//   const price = ethers.parseEther('0.1'); // 0.1 ETH

//   beforeEach(async function () {
//     const quantity: number = 3;

//     // Mint NFTs for the first listing
//     await coffeeMarketplace.connect(roaster).addRoasterListing(
//       'Panama Geisha',
//       'Delicate, jasmine-like aroma with hints of peach.',
//       ipfsHash,
//       price,
//       quantity,
//       'Guatemala',
//       'Medium',
//       'Arabica',
//       'Washed'
//     );

//     // Purchase NFT for transfer tests
//     await coffeeMarketplace.connect(buyer).purchaseNFT(listingId, 1, { value: price });

//     // Grant approval for transfer
//     await coffeeMarketplace.connect(buyer).setApprovalForAll(coffeeMarketplace.getAddress(), true);
//   });

//   it('Should allow user-to-user transfer', async function () {
//     const tokenId = 1;
//     const buyerAddress = await buyer.getAddress();
//     const secondBuyerAddress = await secondBuyer.getAddress();

//     // Grant specific approval for this token
//     await coffeeMarketplace.connect(buyer).approve(await coffeeMarketplace.getAddress(), tokenId);

//     // Verify initial ownership
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);

//     // Execute transfer - secondBuyer initiates free transfer
//     await expect(
//       coffeeMarketplace.connect(secondBuyer).transferNFT(
//         tokenId,
//         secondBuyerAddress, // secondBuyer's address as recipient
//         0 // free transfer
//       )
//     )
//       .to.emit(coffeeMarketplace, 'NFTTransferred')
//       .withArgs(tokenId, buyerAddress, secondBuyerAddress, 0);

//     // Verify new ownership
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(secondBuyerAddress);
//   });

//   // it('Should allow paid user-to-user transfer', async function () {
//   //   const tokenId = 1;
//   //   const transferPrice = ethers.parseEther('0.05');
//   //   const buyerAddress = await buyer.getAddress();
//   //   const secondBuyerAddress = await secondBuyer.getAddress();

//   //   // Initial balances
//   //   const sellerBalanceBefore = await ethers.provider.getBalance(buyerAddress);
//   //   const buyerBalanceBefore = await ethers.provider.getBalance(secondBuyerAddress);

//   //   // Grant approval for the transfer
//   //   await coffeeMarketplace.connect(buyer).approve(await coffeeMarketplace.getAddress(), tokenId);

//   //   // Verify initial ownership
//   //   expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);

//   //   // Execute paid transfer - secondBuyer initiates and pays
//   //   const tx = await coffeeMarketplace.connect(secondBuyer).transferNFT(
//   //     tokenId,
//   //     secondBuyerAddress,  // secondBuyer's address as recipient
//   //     transferPrice,
//   //     { value: transferPrice }
//   //   );

//   //   const receipt = await tx.wait();
//   //   if (!receipt) {
//   //     throw new Error("No receipt received");
//   //   }

//   //   // Calculate gas costs
//   //   const gasCost = receipt.gasUsed * receipt.gasPrice;

//   //   // Verify new ownership
//   //   expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(secondBuyerAddress);

//   //   // Verify seller (original buyer) received the payment
//   //   const sellerBalanceAfter = await ethers.provider.getBalance(buyerAddress);
//   //   expect(sellerBalanceAfter).to.equal(sellerBalanceBefore + transferPrice);

//   //   // Verify buyer (secondBuyer) paid the correct amount (price + gas)
//   //   const buyerBalanceAfter = await ethers.provider.getBalance(secondBuyerAddress);

//   //   // Use closeTo for balance comparison to account for small differences
//   //   expect(buyerBalanceAfter).to.be.closeTo(
//   //     buyerBalanceBefore - transferPrice - gasCost,
//   //     ethers.parseEther('0.0001') // Allow for small difference due to gas estimation
//   //   );

//   //   // Verify the event
//   //   await expect(tx)
//   //     .to.emit(coffeeMarketplace, 'NFTTransferred')
//   //     .withArgs(tokenId, buyerAddress, secondBuyerAddress, transferPrice);
//   // });

//   it('Should revert transfer if recipient address is invalid', async function () {
//     const tokenId = 1;
//     const buyerAddress = await buyer.getAddress();

//     // Verify initial ownership
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);

//     // Attempt transfer to zero address
//     await expect(
//       coffeeMarketplace.connect(buyer).transferNFT(
//         tokenId,
//         ethers.ZeroAddress,
//         0
//       )
//     ).to.be.revertedWith('Invalid recipient address');

//     // Attempt transfer to marketplace address
//     await expect(
//       coffeeMarketplace.connect(buyer).transferNFT(
//         tokenId,
//         await coffeeMarketplace.getAddress(),
//         0
//       )
//     ).to.be.revertedWith('Invalid recipient address');

//     // Verify ownership hasn't changed
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);
//   });

//   it('Should revert if payment is insufficient', async function () {
//     const tokenId = 1;
//     const transferPrice = ethers.parseEther('0.05');
//     const insufficientPrice = ethers.parseEther('0.04');
//     const buyerAddress = await buyer.getAddress();
//     const secondBuyerAddress = await secondBuyer.getAddress();

//     // Grant specific approval for this token
//     await coffeeMarketplace.connect(buyer).approve(await coffeeMarketplace.getAddress(), tokenId);

//     // Verify initial ownership
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);

//     // Attempt transfer with insufficient payment
//     await expect(
//       coffeeMarketplace.connect(secondBuyer).transferNFT(
//         tokenId,
//         secondBuyerAddress,
//         transferPrice,
//         { value: insufficientPrice }
//       )
//     ).to.be.revertedWith('Insufficient payment');

//     // Verify ownership hasn't changed
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(buyerAddress);
//   });
// });

// describe('Metadata Management', function () {
//   const listingId = 6;
//   const ipfsHash: string = 'https://example.com/panama.png';
//   const price = ethers.parseEther('0.1'); // 0.1 ETH

//   beforeEach(async function () {
//     const quantity: number = 3;

//     // Mint NFTs for the listing
//     await coffeeMarketplace.connect(roaster).addRoasterListing(
//       'Panama Geisha',
//       'Delicate, jasmine-like aroma with hints of peach.',
//       ipfsHash,
//       price,
//       quantity,
//       'Guatemala',
//       'Medium',
//       'Arabica',
//       'Washed'
//     );
//   });

//   it('Should store and retrieve correct NFT metadata', async function () {
//     const tokenId = 1;

//     // Verify initial listing state
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
//       await coffeeMarketplace.getAddress()
//     );

//     // Retrieve and verify metadata
//     const metadata = await coffeeMarketplace.getNFTMetadata(tokenId);
//     expect(metadata.name).to.equal('Panama Geisha');
//     expect(metadata.description).to.equal('Delicate, jasmine-like aroma with hints of peach.');
//     expect(metadata.tokenURI).to.equal(ipfsHash);
//     expect(metadata.origin).to.equal('Guatemala');
//     expect(metadata.roastLevel).to.equal('Medium');
//     expect(metadata.beanType).to.equal('Arabica');
//     expect(metadata.processMethod).to.equal('Washed');
//     expect(metadata.isActive).to.be.true;
//   });

//   it('Should allow metadata updates by authorized users', async function () {
//     const tokenId = 1;
//     const updatedIPFSHash = 'https://example.com/updated.png';
//     const newName = 'Premium Panama Geisha';
//     const newDescription = 'Delicate, jasmine-like aroma with hints of peach. Delicious!';
//     const newOrigin = 'Kenya';
//     const newRoastLevel = 'Medium';

//     // Verify initial metadata
//     const initialMetadata = await coffeeMarketplace.getNFTMetadata(tokenId);
//     expect(initialMetadata.name).to.equal('Panama Geisha');
//     expect(initialMetadata.origin).to.equal('Guatemala');

//     // Update metadata
//     await expect(
//       coffeeMarketplace.connect(roaster).updateNFTMetadata(
//         tokenId,
//         newName,
//         newDescription,
//         updatedIPFSHash,
//         newOrigin,
//         newRoastLevel,
//         'Arabica',
//         'Washed'
//       )
//     )
//       .to.emit(coffeeMarketplace, 'MetadataUpdated')
//       .withArgs(
//         tokenId,
//         newName,
//         newDescription,
//         updatedIPFSHash,
//         newOrigin,
//         newRoastLevel
//       );

//     // Verify updated metadata
//     const updatedMetadata = await coffeeMarketplace.getNFTMetadata(tokenId);
//     expect(updatedMetadata.name).to.equal(newName);
//     expect(updatedMetadata.description).to.equal(newDescription);
//     expect(updatedMetadata.tokenURI).to.equal(updatedIPFSHash);
//     expect(updatedMetadata.origin).to.equal(newOrigin);
//     expect(updatedMetadata.roastLevel).to.equal(newRoastLevel);
//   });
// });

// describe('Helper Functions', function () {
//   const listingId = 6;
//   const ipfsHash: string = 'https://example.com/panama.png';
//   const price = ethers.parseEther('0.1'); // 0.1 ETH

//   beforeEach(async function () {
//     const quantity: number = 3;

//     // Mint NFTs for the listing
//     await coffeeMarketplace.connect(roaster).addRoasterListing(
//       'Panama Geisha',
//       'Delicate, jasmine-like aroma with hints of peach.',
//       ipfsHash,
//       price,
//       quantity,
//       'Guatemala',
//       'Medium',
//       'Arabica',
//       'Washed'
//     );
//   });

//   it('Should correctly check NFT availability', async function () {
//     const tokenId = 1;

//     // Check NFT is owned by marketplace
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
//       await coffeeMarketplace.getAddress()
//     );

//     // Initial check - NFT should be available when first minted
//     const initialAvailability = await coffeeMarketplace.isNFTAvailableForPurchase(tokenId);
//     expect(initialAvailability).to.be.true;

//     // Purchase NFT
//     await coffeeMarketplace.connect(buyer).purchaseNFT(listingId, tokenId, {
//       value: ethers.parseEther('0.1')
//     });

//     // After purchase, NFT should not be available
//     const afterPurchaseAvailability = await coffeeMarketplace.isNFTAvailableForPurchase(tokenId);
//     expect(afterPurchaseAvailability).to.be.false;
//   });

//   it('Should return correct NFT price', async function () {
//     const tokenId = 1;

//     // Verify the NFT exists and is owned by marketplace
//     expect(await coffeeMarketplace.ownerOf(tokenId)).to.equal(
//       await coffeeMarketplace.getAddress()
//     );

//     // Check the price
//     const nftPrice = await coffeeMarketplace.getNFTPrice(tokenId);
//     expect(nftPrice).to.equal(price);
//   });

//   it('Should distribute monthly rewards to top 3 customers using Chainlink Keeper', async function () {
//     // Simulate top customers in the leaderboard
//     await createOrderFromData(customer1Order);
//     await createOrderFromData(customer2Order);
//     await createOrderFromData(customer3Order);

//     // Fast forward time by 31 days
//     await ethers.provider.send('evm_increaseTime', [31 * 24 * 60 * 60]); // Advance 31 days
//     await ethers.provider.send('evm_mine', []); // Mine the next block

//     // Trigger Chainlink upkeep manually
//     await coffeeMarketplace.performUpkeep('0x');

//     // Verify that reward NFTs were distributed to top 3 customers
//     const tokenCounter = await coffeeMarketplace.tokenCounter();
//     expect(await coffeeMarketplace.ownerOf(Number(tokenCounter) - 2)).to.equal(
//       customer3Order.address
//     );
//     expect(await coffeeMarketplace.ownerOf(Number(tokenCounter) - 1)).to.equal(
//       customer1Order.address
//     );
//     expect(await coffeeMarketplace.ownerOf(tokenCounter)).to.equal(
//       customer2Order.address
//     );
//   });

//   it('Should not allow performUpkeep before 30 days', async function () {
//     // Fast forward time by less than 30 days
//     await ethers.provider.send('evm_increaseTime', [15 * 24 * 60 * 60]); // Advance 15 days
//     await ethers.provider.send('evm_mine', []); // Mine the next block

//     // Attempt to trigger Chainlink upkeep manually
//     await expect(coffeeMarketplace.performUpkeep('0x')).to.be.revertedWith(
//       'Reward distribution is not available yet'
//     );
//   });
// });
