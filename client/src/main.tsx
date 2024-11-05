// src/index.tsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { MetaMaskProvider } from "@metamask/sdk-react";
import { TransactionsProvider } from './context/TransactionContext'; // Adjust the path as needed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "NFTRoasters",
          url: window.location.href,
        },
      }}
    >
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </MetaMaskProvider>
  </StrictMode>,
);
