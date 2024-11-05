import React, { useEffect, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { MetaMaskSDKEventType, useSDK } from "@metamask/sdk-react";
import { contractABI, contractAddress } from "../utils/constants";

interface TransactionContextProps {
    transactionCount: number | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    currentAccount: string | null;
    isLoading: boolean;
    sendTransaction: () => Promise<void>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
    formData: FormData;
    chainId: string | null;
    listings: any[];
    getListing: (productId: number) => Promise<any>;
}

interface FormData {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
}

interface TransactionsProviderProps {
    children: ReactNode;
}

export const TransactionContext = React.createContext<TransactionContextProps | undefined>(undefined);

export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
    const { sdk, connected, chainId } = useSDK();
    const [formData, setFormData] = useState<FormData>({ addressTo: "", amount: "", keyword: "", message: "" });
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [transactionCount, setTransactionCount] = useState<number | null>(
        parseInt(localStorage.getItem("transactionCount") || "0")
    );
    const [listings, setListings] = useState<any[]>([]); // State for listings

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    // Create Ethereum Contract Instance
    const createEthereumContract = async () => {
        if (!sdk) {
            throw new Error("SDK not initialized");
        }
        const provider = new ethers.BrowserProvider(sdk.getProvider()!);
        console.log("Ethers provider:", provider);

        const signer = await provider.getSigner();
        if (!signer) {
            throw new Error("Signer is undefined");
        }
        console.log("Ethers signer:", signer);

        const coffeeMarketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("Contract instance created:", coffeeMarketplaceContract);
        return coffeeMarketplaceContract;
    };

    // Connect Wallet
    const connectWallet = async () => {
        try {
            console.log("Attempting to connect wallet...");
            if (!sdk) {
                alert("Please install MetaMask.");
                return;
            }

            const accounts = await sdk.connect();
            console.log("Connected accounts:", accounts);
            if (accounts && accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                localStorage.setItem("isWalletConnected", "true");
                await getListing(1); // Fetch listing for product ID 1
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            throw new Error("Failed to connect wallet");
        }
    };

    // Disconnect Wallet
    const disconnectWallet = () => {
        console.log("Disconnecting wallet...");
        setCurrentAccount(null);
        localStorage.removeItem("isWalletConnected");
        
        // If the SDK has a disconnect method, call it here
        if (sdk && sdk.disconnect) {
            sdk.disconnect(); // Call the disconnect method from the SDK
        }
    };

    // Send Transaction
    const sendTransaction = async () => {
        try {
            if (sdk && connected && currentAccount) {
                const { addressTo, amount, keyword, message } = formData;
                const coffeeMarketplaceContract = await createEthereumContract();
                const parsedAmount = ethers.parseEther(amount);

                // Send Transaction via MetaMask
                const provider = sdk.getProvider();
                if (!provider) {
                    throw new Error("Provider is undefined");
                }
                await provider.request({
                    method: "eth_sendTransaction",
                    params: [
                        {
                            from: currentAccount,
                            to: addressTo,
                            gas: "0x5208", // 21000 Gwei
                            value: ethers.hexlify(parsedAmount.toString()), // Correct hex value
                        },
                    ],
                });

                // Add Transaction to Blockchain
                const transactionHash = await coffeeMarketplaceContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

                setIsLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`Success - ${transactionHash.hash}`);
                setIsLoading(false);

                const transactionsCount = await coffeeMarketplaceContract.getTransactionCount();
                console.log("Updated transaction count:", transactionsCount);
                setTransactionCount(transactionsCount.toNumber());
                window.localStorage.setItem("transactionCount", transactionsCount.toString());
            } else {
                console.log("SDK not connected");
            }
        } catch (error) {
            console.error("Error sending transaction:", error);
            throw new Error("Failed to send transaction");
        }
    };

    // Fetch Listing
    const getListing = async (productId: number) => {
        try {
            console.log(`Fetching listing for product ID: ${productId}`);
            if (sdk && connected) {
                const coffeeMarketplaceContract = await createEthereumContract();
                const listing = await coffeeMarketplaceContract.getListing(productId);
                console.log("Listing fetched:", listing);

                // Access values, converting BigInt to regular number or string where necessary
                const structuredListing = {
                    name: listing[0],
                    description: listing[1],
                    ipfsHash: listing[2],
                    price: ethers.formatUnits(listing[3], 18), // Convert price from BigInt to a readable string
                    quantity: Number(listing[4]), // Convert BigInt to a number
                    nftIds: listing[5], // Assuming this is an array of token IDs
                    available: listing[6],
                    origin: listing[7],
                    roastLevel: listing[8],
                    beanType: listing[9],
                    processMethod: listing[10],
                    roastDate: new Date(Number(listing[11]) * 1000).toLocaleString(), // Convert BigInt to number and then to a Date
                };

                setListings(prevListings => [...prevListings, structuredListing]);
                return structuredListing; // Optionally return structured listing
            } else {
                console.log("SDK not connected");
            }
        } catch (error) {
            console.error("Error fetching listing:", error);
        }
    };

    // Check Wallet Connection on Mount
    useEffect(() => {
        const initialize = async () => {
            const isWalletConnected = localStorage.getItem("isWalletConnected");
            console.log("Initializing TransactionsProvider, isWalletConnected:", isWalletConnected);
            if (isWalletConnected === "true" && sdk && !currentAccount) {
                await connectWallet();
            } else if (connected && sdk) {
                // If already connected via MetaMask, fetch account details
                const accounts = await sdk.connect();
                console.log("Accounts from SDK:", accounts);
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                }
            }
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sdk, connected]);

    // Listen to Account and Chain Changes
    useEffect(() => {
        if (sdk) {
            // Handle Account Changes
            const handleAccountsChanged = (payload: unknown) => {
                const accounts = payload as string[];
                console.log("Accounts changed:", accounts);
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                } else {
                    disconnectWallet(); // Clear the account if none are present
                }
            };

            // Handle Chain Changes
            const handleChainChanged = () => {
                console.log("Chain changed, reloading...");
                window.location.reload();
            };

            sdk.on("accountsChanged" as MetaMaskSDKEventType, handleAccountsChanged);
            sdk.on("chainChanged" as MetaMaskSDKEventType, handleChainChanged);

            // Cleanup on Unmount
            return () => {
                sdk.off("accountsChanged", handleAccountsChanged);
                sdk.off("chainChanged", handleChainChanged);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sdk]);

    return (
        <TransactionContext.Provider
            value={{
                transactionCount,
                connectWallet,
                disconnectWallet,
                currentAccount,
                isLoading,
                sendTransaction,
                handleChange,
                formData,
                chainId: chainId ? chainId.toString() : null,
                listings,
                getListing,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
