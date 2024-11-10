// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { MetaMaskProvider } from "@metamask/sdk-react";

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
      <App />
    </MetaMaskProvider>
  </StrictMode>
);
