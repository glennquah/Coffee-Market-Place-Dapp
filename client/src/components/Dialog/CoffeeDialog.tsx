import { useState } from 'react';
import ImageNotFound from '../../assets/imageNotFound.png';
import '../../styles/Modal.css';
import useWallet from '../../hooks/useWallet';
import Button from '../Button';
import usePinataUpload from '../../hooks/usePinataUpload';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CoffeeDialogProps } from '../../types/types';
import useCoffeeMarketplace from '../../hooks/useCoffeeMarketplace';

const CoffeeDialog = ({ onListingAdded }: CoffeeDialogProps) => {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [beanType, setBeanType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.0001);
  const [image, setImage] = useState<string>(ImageNotFound);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { currentAccount } = useWallet();
  const { addRoasterListing } = useCoffeeMarketplace();
  const { uploadImage, status: uploadStatus } = usePinataUpload();

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setImage(URL.createObjectURL(selectedFile));

      try {
        const imageUrl = await uploadImage(selectedFile);
        setImage(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const createListing = async () => {
    if (!currentAccount) {
      setError('Wallet not connected.');
      return;
    }
    if (!name || !origin || !roastLevel || !beanType || !description || quantity < 1 || price <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    if (image === ImageNotFound || !image) {
      setError('Please upload an image for your coffee.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await addRoasterListing(
        name,
        description,
        image,
        price.toString(),
        quantity,
        origin,
        roastLevel,
        beanType
      );

      setSuccess('Listing created successfully!');
      onListingAdded();

      // Reset form fields
      setName('');
      setOrigin('');
      setRoastLevel('');
      setBeanType('');
      setDescription('');
      setQuantity(1);
      setPrice(0.0001);
      setImage(ImageNotFound);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
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
      <div style={{ backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', padding: 15 }}>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
          Wanna list your coffee?
        </h1>
        <Button onClick={toggleModal} className="btn-modal">
          List my coffee
        </Button>
      </div>

      {modal && (
        <div className="modal" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div style={{ width: '100%', justifyItems: 'center' }}>
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Upload your coffee into an NFT ☕</h1>
              <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Let’s tokenise your coffee into NFTs!</h1>
            </div>
            <div className="containers">
              <div className="inner-containers">
                <div style={{ width: 300, height: 300, position: 'relative' }}>
                  <img src={image} style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: '10px' }} alt="Coffee" />
                  {uploadStatus.loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'blue' }}>
                      <AiOutlineLoading3Quarters size={50} className="spinner" />
                    </div>
                  )}
                </div>
                <div style={{ width: '100%', display: 'flex', marginTop: 10, justifyContent: 'center' }}>
                  <label>Upload Image: </label>
                  <input type="file" style={{ marginLeft: 20, width: 110, borderRadius: 5 }} multiple={false} accept="image/png, image/jpeg" onChange={onImageChange}></input>
                </div>
              </div>
              <div className="inner-containers">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                  <label style={{ fontSize: 20 }}>Coffee Name:</label>
                  <input type="text" style={{ width: 250, borderRadius: 5, color: 'black', padding: 5 }} placeholder="Coffee name" value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>

                {/* Coffee Origin */}
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

                {/* Roast Level */}
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

                {/* Bean Type */}
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

                {/* Description */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontSize: 20 }}>Process Method:</label>
                  <input
                    type="text"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Process method"
                    onChange={(e) => setProcessMethod(e.target.value)}
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
                  <label style={{ fontSize: 20 }}>Roast Date:</label>
                  <input
                    type="date"
                    style={{
                      width: 250,
                      borderRadius: 5,
                      color: 'black',
                      padding: 5,
                    }}
                    placeholder="Roast date"
                    onChange={(e) => setRoastDate(new Date(e.target.value))}
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

                {/* Quantity and Price */}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                >
                  {/* Quantity */}
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
                      step="1"
                    ></input>
                  </div>

                  {/* Price */}
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
                        width: 80,
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

                {/* Action Button */}
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
                      cursor: 'pointer',
                    }}
                    className="mint-button"
                    onClick={createListing}
                    disabled={
                      uploadStatus.loading ||
                      loading
                    }
                  >
                    {loading || uploadStatus.loading ? 'Processing...' : 'Mint NFTs'}
                  </button>
                </div>

                {/* Feedback Messages */}
                {error && (
                  <div
                    style={{
                      color: 'red',
                      textAlign: 'center',
                      marginTop: '10px',
                      fontSize: '16px',
                    }}
                  >
                    {error}
                  </div>
                )}
                {success && (
                  <div
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      marginTop: '10px',
                      fontSize: '16px',
                    }}
                  >
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
