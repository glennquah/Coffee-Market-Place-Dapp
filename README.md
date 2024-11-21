# Coffee Marketplace dApp

## Table of Contents
1. [Introduction](#1-introduction)  
2. [Problem Statement](#2-problem-statement)  
3. [Solutions](#3-solutions)  
4. [Features](#4-features)  
5. [Smart Contracts](#5-smart-contracts)  
6. [Running it Locally](#6-running-it-locally)  
7. [Tech Stack](#7-tech-stack)  
8. [Deployment](#8-deployment)  
9. [How to Contribute](#9-how-to-contribute)  


## 1. Introduction

Welcome to **NFTRoasters, your Blockchain Coffee Marketplace**, a decentralized platform revolutionizing the global coffee industry. Leveraging blockchain technology, our platform connects coffee enthusiasts directly with growers and roasters, ensuring transparency, fairness, and community-driven product offerings. By integrating NFTs, voting systems, and sealed-bid auctions, we create an engaging and authentic coffee ecosystem that benefits all stakeholders.

---

## 2. Problem Statement

The specialty coffee market, particularly for rare and high-quality beans, faces several challenges:

- **Unfair Pricing Practices:** Middlemen inflate prices, reducing profits for growers and roasters while increasing costs for consumers.
- **Limited Customer Engagement:** Traditional marketplaces lack dynamic, gamified systems to retain customer interest.
- **Unfair Auction Systems:** Current auctions are susceptible to last-minute bidding, compromising fairness.
- **Reward Systems for Loyalty:** Few platforms offer robust loyalty rewards, hindering customer retention.

**Coffee Marketplace** addresses these issues by providing a transparent, fair, and engaging platform where consumers have control over product offerings and earn rewards through their participation.

---

## 3. Solutions

**Coffee Marketplace** offers a comprehensive solution tailored to both consumers and businesses:

- **NFT as Collectibles and Proof of Purchase:** Each purchase issues an NFT representing the specific coffee product, serving as a collectible and a digital receipt for tracking.
- **Gamification with Leaderboard:** A leaderboard ranks top spenders, rewarding them with exclusive NFTs redeemable for premium products.
- **Rewarding Loyalty with NFTs:** Top spenders receive NFTs that unlock special products, fostering loyalty and repeat engagement.
- **B2C Transactions and Community Involvement:**
  - **Direct Product Listings by Roasters:** Roasters list products directly, eliminating middlemen.
  - **Voting System for Product Selection:** Consumers vote on which coffee varieties to introduce, ensuring offerings align with community preferences.
  - **Auction Feature for Rare Products:** Sealed-bid auctions for limited-edition coffees ensure fairness and excitement.

---

## 4. Features

- **NFT Integration:** Unique NFTs for each coffee product, ensuring authenticity and traceability.
- **Sealed-Bid Auctions:** Fair auction system preventing last-minute bid manipulation.
- **Voting System:** Community-driven product selection through token-based voting.
- **Leaderboard and Rewards:** Incentivizes user engagement by rewarding top spenders with exclusive NFTs.
- **Decentralized Storage:** Utilizes IPFS for immutable storage of NFT metadata.
- **Automated Processes:** Chainlink Keepers automate monthly reward distributions.

---

## 5. Smart Contracts

The platform employs a suite of smart contracts to manage various functionalities:

- **CoffeeNFT Contract Module:** Handles minting, metadata management, pricing, and ownership of NFTs.
- **Cart Contract Module:** Manages user shopping carts, including adding, updating, and removing items.
- **Product Contract Module:** Manages product listings, inventory, and pricing.
- **Order Contract Module:** Tracks order creation, completion, and details.
- **Coffee Marketplace Contract Module:** Orchestrates listings, purchases, bulk transactions, and monthly reward distributions.
- **Auction Contract Module:** Manages auction creation, bidding, finalization, and fund withdrawals.
- **Voting Contract Module:** Facilitates community voting on product selections and mints reward NFTs based on results.
- **Leaderboard Contract Module:** Tracks and updates the leaderboard, rewarding top customers.

---

## 6. Running it locally

### Prerequisites

- **Node.js (>V20)**
- **npm**
- **Hardhat**
- **MetaMask Wallet**

### Backend Setup

**Clone the Repository:**
 **Remember to CD to smart_contract**
 ```bash
 git clone https://github.com/glennquah/Coffee-Market-Place-Dapp.git
 cd smart_contract
 npm install
 npm run compile
 npm run hardhat:network
 npm run deploy
 ```

### Frontend Setup

**Remember to CD to client**
 ```bash
 cd client
 npm install
 npm run dev
 ```
Access the application at http://localhost:5173

---

### 7. Tech Stack

#### Frontend
- **Vite + React**: Builds a fast and responsive user interface.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **MetaMask**: Facilitates wallet integration and transaction signing.
- **OpenZeppelin**: Provides secure smart contract standards and libraries.

#### Backend
- **Solidity**: Programming language for writing smart contracts.
- **Hardhat**: Development environment for compiling, testing, and deploying smart contracts.
- **Chainlink**: Integrates decentralized oracles for automated processes and verifiable randomness.
- **IPFS (Pinata)**: Decentralized storage for NFT metadata and assets.

#### Deployment
- **Alchemy**: Blockchain development platform for deploying smart contracts.
- **Vercel**: Hosts the frontend application, ensuring scalability and performance.

---

### 8. Deployment
#### Smart Contracts Deployment Through Alchemy
1. **Set Up Alchemy Account**:
   - Create an account on Alchemy.
   - Create an Ethereum app to obtain an API key.
2. **Configure Environment Variables**:
   - Store your Alchemy API key and wallet private key in a `.env` file.
3. **Deploy to Sepolia Testnet**:
   ```bash
   npx hardhat ignition deploy ignition/modules/ignition-deployment.ts --network sepolia
   ```
   
### Frontend Deployment Through Vercel
 - Create a pull request to trigger the build process.
 - Merge the pull request to deploy to production.

Access the deployed frontend at: [https://nft-roaster.vercel.app/](https://nft-roaster.vercel.app/)

---

### 9. How to Contribute
We would like this project to be `open source`, so feel free to create a branch & a PR, tagging any one of us as maintainers. Once approved, your changes will be merged into the main project.
