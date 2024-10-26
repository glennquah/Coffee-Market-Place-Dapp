import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
}

// Component for left and right navigation buttons
const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onPrevious, onNext }) => {
  return (
    <div className="navigation-buttons flex gap-1">
      <button
        className=" bg-primary-white text-black w-8 h-8 rounded-full hover:bg-primary-white-hover focus:outline-none focus:ring-2 focus:ring-main-bg focus:ring-offset-2"
        onClick={onPrevious}
      >
        <ArrowBackIcon />
      </button>
      <button
        className=" bg-primary-white text-black w-8 h-8 rounded-full hover:bg-primary-white-hover focus:outline-none focus:ring-2 focus:ring-main-bg focus:ring-offset-2"
        onClick={onNext}
      >
        <ArrowForwardIcon />
      </button>
    </div>
  );
};

export default NavigationButtons;
