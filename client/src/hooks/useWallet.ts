// src/hooks/useWallet.ts
import { useState, useEffect, useCallback } from "react";
import { MetaMaskSDKEventType, useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";

interface Wallet {
  currentAccount: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

const useWallet = (): Wallet => {
  const { sdk, connected, chainId } = useSDK();
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Connect Wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!sdk) {
        alert("Please install MetaMask.");
        return;
      }

      const accounts = await sdk.connect();
      if (accounts && accounts.length > 0) {
        console.log("Connected Account:", accounts[0]);
        setCurrentAccount(accounts[0]);
        setCurrentChainId(chainId ? chainId.toString() : null);
        localStorage.setItem("isWalletConnected", "true");

        // Initialize provider and signer using MetaMask's provider
        const ethProvider = new ethers.BrowserProvider(window.ethereum!);
        setProvider(ethProvider);
        setSigner(await ethProvider.getSigner());
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }, [sdk, chainId]);

  const disconnectWallet = useCallback(() => {
    console.log("Disconnecting Wallet");
    setCurrentAccount(null);
    setCurrentChainId(null);
    setProvider(null);
    setSigner(null);
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
        console.log("Reconnecting wallet from local storage");
        await connectWallet();
      }
    };
    initialize();
  }, [sdk, connected, currentAccount, connectWallet]);

  // Listen to Account and Chain Changes
  useEffect(() => {
    if (sdk) {
      const handleAccountsChanged = async (payload: unknown) => {
        const accounts = payload as string[];
        if (accounts.length > 0) {
          console.log("Account Changed:", accounts[0]);
          setCurrentAccount(accounts[0]);

          // Update provider and signer when account changes
          const ethProvider = new ethers.BrowserProvider(window.ethereum!);
          setProvider(ethProvider);
          setSigner(await ethProvider.getSigner());
        } else {
          console.log("No accounts available, disconnecting wallet");
          disconnectWallet();
        }
      };

      const handleChainChanged = (payload: unknown) => {
        const newChainId = payload as string;
        console.log("Chain Changed:", newChainId);
        setCurrentChainId(newChainId);
      };

      sdk.on("accountsChanged" as MetaMaskSDKEventType, handleAccountsChanged);
      sdk.on("chainChanged" as MetaMaskSDKEventType, handleChainChanged);

      return () => {
        sdk.off("accountsChanged" as MetaMaskSDKEventType, handleAccountsChanged);
        sdk.off("chainChanged" as MetaMaskSDKEventType, handleChainChanged);
      };
    }
  }, [disconnectWallet, sdk]);

  useEffect(() => {
    console.log("Current Account State:", currentAccount);
    console.log("Current Chain ID State:", currentChainId);
    console.log("signer", signer)
  }, [currentAccount, currentChainId, signer]);

  return { currentAccount, chainId: currentChainId, connectWallet, disconnectWallet, provider, signer };
};

export default useWallet;
