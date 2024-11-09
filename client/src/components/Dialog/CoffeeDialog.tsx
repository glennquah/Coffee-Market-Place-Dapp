// src/components/Dialog/CoffeeDialog.tsx
import { useState } from 'react';
import ImageNotFound from '../../assets/imageNotFound.png';
import '../../styles/Modal.css';
import useWallet from '../../hooks/useWallet';
import useBlockchain from '../../hooks/useBlockchain';
import { ethers } from 'ethers';
import Button from '../Button'; // Assuming you have a Button component

const CoffeeDialog = () => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [beanType, setBeanType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.0001);
  const [image, setImage] = useState<string>(ImageNotFound);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signer, currentAccount } = useWallet();
  const { coffeeMarketplace } = useBlockchain();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const createListing = async () => {
    if (!coffeeMarketplace) {
      setError("Smart contract not initialized.");
      return;
    }

    if (!signer) {
      setError("Wallet not connected.");
      return;
    }

    if (!currentAccount) {
      setError("No connected account.");
      return;
    }

    if (!name || !origin || !roastLevel || !beanType || !description || !quantity || !price) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Assuming your smart contract has a function like createListing
      // Replace the following parameters with actual ones as per your contract
      const tx = await coffeeMarketplace.addRoasterListing(
        name,
        description,
        image, // Assuming image is the IPFS hash or URL
        ethers.parseEther(price.toString()), // Convert ETH to Wei
        quantity,
        origin,
        roastLevel,
        beanType,
        description // Adjust parameters as needed
      );

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
      setSuccess("Listing created successfully!");

      // Optionally, reset form fields
      setName('');
      setOrigin('');
      setRoastLevel('');
      setBeanType('');
      setDescription('');
      setQuantity(0);
      setPrice(0);
      setImage(ImageNotFound);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error creating listing:", err);
        setError(err?.message || "An error occurred while creating the listing.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'center',
          padding: 15,
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
          Wanna list your coffee?
        </h1>
        <Button onClick={toggleModal} className="btn-modal">
          List my coffee
        </Button>
      </div>
      {modal && (
        <div
          className="modal"
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div style={{ width: '100%', justifyItems: 'center' }}>
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>
                Upload your coffee into an NFT ☕
              </h1>
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>
                Let’s tokenise your coffee into NFTs!
              </h1>
            </div>
            <div className="containers">
              <div className="inner-containers">
                <div style={{ width: 300, height: 300 }}>
                  <img src={image} style={{ width: 300, height: 300 }} alt="Coffee" />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    marginTop: 10,
                    justifyContent: 'center',
                  }}
                >
                  <label>Upload Image: </label>
                  <input
                    type="file"
                    style={{ marginLeft: 20, width: 110, borderRadius: 5 }}
                    multiple={false}
                    accept="image/png, image/jpeg" // Updated to accept more image types
                    onChange={onImageChange}
                  ></input>
                </div>
              </div>
              <div className="inner-containers">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Coffee Name:</label>
                  <input
                    type="text"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Coffee name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Coffee Origin:</label>
                  <input
                    type="text"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Coffee origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  ></input>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Roast Level:</label>
                  <input
                    type="text"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Roast level"
                    value={roastLevel}
                    onChange={(e) => setRoastLevel(e.target.value)}
                  ></input>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Bean Type:</label>
                  <input
                    type="text"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Bean type"
                    value={beanType}
                    onChange={(e) => setBeanType(e.target.value)}
                  ></input>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Description:</label>
                  <textarea
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: '45%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label style={{ fontSize: 20 }}>Quantity</label>
                    <input
                      type="number"
                      style={{
                        width: 50,
                        borderRadius: 5,
                        color: 'black',
                        padding: 5,
                      }}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Number.parseInt(e.target.value))
                      }
                      min="1"
                    ></input>
                  </div>
                  <div
                    style={{
                      width: '45%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label style={{ fontSize: 20 }}>Price (ETH)</label>
                    <input
                      type="number"
                      style={{
                        width: 50,
                        borderRadius: 5,
                        color: 'black',
                        padding: 5,
                      }}
                      value={price}
                      onChange={(e) =>
                        setPrice(Number.parseFloat(e.target.value))
                      }
                      min="0.01"
                      step="0.01"
                    ></input>
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                >
                  <button
                    style={{
                      width: 150,
                      height: 60,
                      backgroundColor: '#783E19',
                      borderRadius: 15,
                      fontSize: 20,
                    }}
                    className="mint-button"
                    onClick={createListing}
                    disabled={loading}
                  >
                    {loading ? 'Minting...' : 'Mint NFTs'}
                  </button>
                </div>
                {error && (
                  <div style={{ color: 'red', textAlign: 'center' }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{ color: 'green', textAlign: 'center' }}>
                    {success}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoffeeDialog;
