import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import mockCoffeeData from '../../data/mockCoffeeItems';
import { CoffeeCardProps } from '../../types/types';

const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        backgroundColor: '#5F6F52',
        color: 'white',
    }
});

const StyledButton = styled(Button)({
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
});


const CoffeeDialog = () => {
    const [cartItems, setCartItems] = useState<CoffeeCardProps[]>(mockCoffeeData.filter((item): item is CoffeeCardProps => item.type === 'cart')); // TODO: Edit to call the `viewCart()` from smart contract
    const [itemToDelete, setItemToDelete] = useState<CoffeeCardProps | null>(null);

    // dialogs
    const [modal, setModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showClearDialog, setShowClearDialog] = useState<boolean>(false);

    // title
    const h1Header = "Shopping Cart";
    const h2Header = "Review your Coffee Beans and proceed to checkout";

    const toggleModal = (): void => {
        setModal(!modal);
    };

    const handleDeleteClick = (item: CoffeeCardProps): void => {
        setItemToDelete(item);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = (): void => {
        if (itemToDelete) {
            // TODO: Edit to call the `removeFromCart()` from smart contract
            setCartItems(prevItems => 
                prevItems.filter(item => item.id !== itemToDelete.id)
            );
        }
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const handleDeleteCancel = (): void => {
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const handleClearClick = (): void => {
        setShowClearDialog(true);
    };

    const handleClearConfirm = (): void => {
        // TODO: Edit to call `removeAllProductsFromCart()` from smart contract
        setCartItems([]);
        setShowClearDialog(false);
    };

    const handleClearCancel = (): void => {
        setShowClearDialog(false);
    };

    const fetchCartItems = (): JSX.Element | JSX.Element[] => {
        if (cartItems.length === 0) {
            return (
                <div className="flex flex-col justify-center items-center p-12 text-white">
                    <FaShoppingCart size={48} className="mb-4 opacity-50" />
                    <p className="text-xl font-medium">Your cart is empty</p>
                    <p className="text-sm opacity-75 mt-2">No items have been added yet</p>
                </div>
            );
        }

        return cartItems
            .map((item, index) => (
                <div 
                    key={item.id || index} 
                    className="grid grid-cols-5 gap-4 px-6 py-4 items-center border-t border-green-600 text-white"
                >
                    <div>
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-20 h-20 rounded" 
                        />
                    </div>
                    <span>{item.name}</span>
                    <span className="text-center">{item.numberOfNFT}</span>
                    <span className="text-right">{item.price} ETH</span>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 hover:bg-red-600 rounded-full transition-colors"
                        >
                            <FaTrash size={16} />
                        </button>
                    </div>
                </div>
            ));
    };

    const checkout = (): void => {
        if (cartItems.length > 0) {
            // TODO: Edit to call `checkout()` from smart contract
            handleClearConfirm();
            alert("May the beans roast with you!");
        } else {
            alert("You have not added any item to the cart!");
        };
    }

    return (
        <>
            <a onClick={toggleModal} className="cursor-pointer">
                <FaShoppingCart size={25} />
            </a>
            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={toggleModal}>
                    <div 
                        className="bg-[#5F6F52] rounded-lg w-full max-w-2xl shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center text-white">
                        <h1 className="text-2xl font-bold mb-2">{h1Header}</h1>
                        <h2 className="text-lg">{h2Header}</h2>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="px-6 pb-3 flex justify-end">
                                <button 
                                    onClick={handleClearClick}
                                    className="text-white py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition-colors"
                                >
                                    Clear Items
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-5 gap-4 px-6 py-3 text-white font-semibold">
                            <div>Image</div>
                            <div>Name</div>
                            <div className="text-center">Number of NFTs</div>
                            <div className="text-center">Total Price</div>
                            <div className="text-right">Action</div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {fetchCartItems()}
                        </div>

                        <div className="p-6 mt-auto border-t border-green-600 flex justify-end">
                            <button 
                                className="bg-[#a0522d] text-white py-2 px-4 rounded hover:bg-[#8b4513]"
                                onClick={checkout}>
                                Checkout
                            </button>
                        </div>

                        <StyledDialog
                            open={showClearDialog}
                            onClose={handleClearCancel}
                            aria-labelledby="clear-dialog-title"
                            aria-describedby="clear-dialog-description"
                        >
                            <DialogTitle id="clear-dialog-title">
                                {"Clear All Items?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="clear-dialog-description" sx={{ color: 'white' }}>
                                    Are you sure you want to remove all items from your cart?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <StyledButton onClick={handleClearCancel}>No</StyledButton>
                                <StyledButton 
                                    onClick={handleClearConfirm} 
                                    autoFocus
                                    sx={{ 
                                        '&:hover': { 
                                            backgroundColor: 'rgba(239, 68, 68, 0.2)' 
                                        } 
                                    }}
                                >
                                    Yes
                                </StyledButton>
                            </DialogActions>
                        </StyledDialog>

                        <StyledDialog
                            open={showDeleteDialog}
                            onClose={handleDeleteCancel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Are you sure?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description" sx={{ color: 'white' }}>
                                    Are you sure you want to delete this item from your cart?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <StyledButton onClick={handleDeleteCancel}>No</StyledButton>
                                <StyledButton 
                                    onClick={handleDeleteConfirm} 
                                    autoFocus
                                    sx={{ 
                                        '&:hover': { 
                                            backgroundColor: 'rgba(239, 68, 68, 0.2)' 
                                        } 
                                    }}
                                >
                                    Yes
                                </StyledButton>
                            </DialogActions>
                        </StyledDialog>

                    </div>
                </div>
            )}
        </>
    );
};

export default CoffeeDialog;
