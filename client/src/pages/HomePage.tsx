// src/pages/HomePage.tsx
import { useContext } from 'react';
import homePagehero from '../assets/homePageHero.svg';
import CoffeeCarousel from '../components/CoffeeCardCarousel/CoffeeCardCarousel';
import CustomerService from '../components/CustomerService';
import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { coffeeMockListings } from '../data/mockCoffeeItems';
import { HeroVariant } from '../types/types';
import { TransactionContext } from '../context/TransactionContext';
import Button from '../components/Button';

function HomePage() {
  const transactionContext = useContext(TransactionContext);

  if (!transactionContext) {
    throw new Error("TransactionContext is undefined. Make sure you are using the TransactionsProvider.");
  }

  const { connectWallet, disconnectWallet, currentAccount, chainId } = transactionContext;

  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          title="Welcome to NFTRoasters"
          subTitle="Buy and Sell your Coffee NFTs here at NFTRoasters"
          imageUrl={homePagehero}
          variant={HeroVariant.V1}
        />
        {currentAccount ? (
          <Button onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {currentAccount && (
          <div className="mt-4">
            <p>{chainId && `Connected chain: ${chainId}`}</p>
            <p>{currentAccount && `Connected account: ${currentAccount}`}</p>
          </div>
        )}

        <div className="pt-8">
          <CoffeeCarousel
            items={coffeeMockListings}
            title="Our Coffee For You"
            subtitle="NFTRoasters Coffee" />
        </div>
        <CustomerService />
      </ResponsiveContainer>
    </div>
  );
}

export default HomePage;
