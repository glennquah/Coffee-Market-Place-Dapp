'use client';
import dialogPhoto from '../../assets/dialogPhoto.svg';

import React from 'react';

interface LandingPageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LandingPageDialog: React.FC<LandingPageDialogProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-gray-500 hover:text-gray-700 float-right"
          onClick={onClose}
        >
          &#x2715;
        </button>
        <div className="flex flex-col gap-6 py-4 items-center">
          <h1 className="text-4xl font-bold text-center">
            Welcome to NFTRoasters
          </h1>
          <img
            src={dialogPhoto}
            alt="dialogPhoto"
            className="w-full h-52"
          ></img>
          <div className="text-center">
            Connect your MetaMask wallet to unlock the full potential of NFT
            Roasters! Explore, trade, and interact seamlessly with our unique
            features tailored to elevate your experience. Your wallet is your
            gateway to exclusive perks, personalized content, and a secure
            connection to the NFT universe.
          </div>
          <div className="text-xs text-gray-500 text-center px-12">
            We hope you enjoy this decentralized application as much as we
            enjoyed creating it for you. - The NFTRoasters Team
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageDialog;
