// src/hooks/useWallet.ts
import { useState, useEffect } from "react";
import { MetaMaskSDKEventType, useSDK } from "@metamask/sdk-react";
import { useCallback } from "react";

interface Wallet {
  currentAccount: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const useWallet = (): Wallet => {
  const { sdk, connected, chainId } = useSDK();
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!sdk) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await sdk.connect();
      if (accounts && accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setCurrentChainId(chainId ? chainId.toString() : null);
        localStorage.setItem("isWalletConnected", "true");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = useCallback(() => {
    setCurrentAccount(null);
    setCurrentChainId(null);
    localStorage.removeItem("isWalletConnected");
    if (sdk && sdk.terminate) {
      sdk.terminate();
    }
  }, [sdk]);

  // Check Wallet Connection on Mount
  useEffect(() => {
    const initialize = async () => {
      const isWalletConnected = localStorage.getItem("isWalletConnected");
      if (isWalletConnected === "true" && sdk && !currentAccount) {
        await connectWallet();
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk, connected]);

  // Listen to Account and Chain Changes
  useEffect(() => {
    if (sdk) {
      const handleAccountsChanged = (payload: unknown) => {
        const accounts = payload as string[];
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = (payload: unknown) => {
        const newChainId = payload as string;
        setCurrentChainId(newChainId);
      };

      sdk.on("accountsChanged" as MetaMaskSDKEventType, handleAccountsChanged);
      sdk.on("chainChanged" as MetaMaskSDKEventType, handleChainChanged);

      return () => {
        sdk.off("accountsChanged", handleAccountsChanged);
        sdk.off("chainChanged" as MetaMaskSDKEventType, handleChainChanged);
      };
    }
  }, [disconnectWallet, sdk]);

  return { currentAccount, chainId: currentChainId, connectWallet, disconnectWallet };
};

export default useWallet;
