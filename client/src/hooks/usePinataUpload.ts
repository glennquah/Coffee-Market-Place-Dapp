import { useState } from 'react';
import axios from 'axios';

interface UploadStatus {
  loading: boolean;
  error: string | null;
  imageUrl: string | null;
}

const usePinataUpload = () => {
  const [status, setStatus] = useState<UploadStatus>({
    loading: false,
    error: null,
    imageUrl: null,
  });

  const uploadImage = async (file: File): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Initialize FormData
    const formData = new FormData();
    formData.append('file', file);

    // Optional: Add metadata and options
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));
    formData.append(
      'pinataMetadata',
      JSON.stringify({ name: file.name, keyvalues: { company: 'NFTRoasters' } })
    );

    try {
      setStatus({
        loading: true,
        error: null,
        imageUrl: null,
      });

      const response = await axios.post(url, formData, {
        maxContentLength: Infinity, // Prevent axios from erroring out with large files
        headers: {
          // Let axios set the Content-Type header, including the boundary
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      setStatus({
        loading: false,
        error: null,
        imageUrl,
      });

      return imageUrl;
    } catch (error: unknown) {
      let errorMessage = 'Failed to upload image to IPFS.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Pinata Upload Error: ${error.response.data.error}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error uploading file to Pinata:', errorMessage);

      setStatus({
        loading: false,
        error: errorMessage,
        imageUrl: null,
      });

      throw new Error(errorMessage);
    }
  };

  return { uploadImage, status };
};

export default usePinataUpload;
