import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

// Reusable Button Component
const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            className={`button ${className} bg-primary-green text-main-bg px-12 py-3 rounded-2xl font-bold hover:bg-primary-green-hover focus:outline-none focus:ring-2 focus:ring-ring-green focus:ring-offset-2`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
