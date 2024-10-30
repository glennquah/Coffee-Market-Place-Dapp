import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import mockCoffeeData from '../../data/mockCoffeeItems';
import { CoffeeCardProps } from '../../types/types';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const CartDialog = () => {
    const [cartItems, setCartItems] = useState<CoffeeCardProps[]>(mockCoffeeData.filter((item): item is CoffeeCardProps => item.type === 'cart')); // TODO: Edit to call the `viewCart()` from smart contract
    const [itemToDelete, setItemToDelete] = useState<CoffeeCardProps | null>(null);
    const [modal, setModal] = useState(false);

    const [dialogConfig, setDialogConfig] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });

    // title
    const h1Header = "Shopping Cart";
    const h2Header = "Review your Coffee Beans and proceed to checkout";

    const toggleModal = (): void => {
        setModal(!modal);
    };

    const handleCloseDialog = (): void => {
        setDialogConfig(prev => ({ ...prev, open: false }));
        setItemToDelete(null);
    };

    const handleDeleteClick = (item: CoffeeCardProps): void => {
        setItemToDelete(item);
        setDialogConfig({
            open: true,
            title: 'Are you sure?',
            message: 'Are you sure you want to delete this item from your cart?',
            onConfirm: () => {
                // TODO: Edit to call the `removeFromCart()` from smart contract
                setCartItems(prevItems => 
                    prevItems.filter(cartItem => cartItem.id !== item.id)
                );
                handleCloseDialog();
            },
        });
    };

    const handleClearClick = (): void => {
        setDialogConfig({
            open: true,
            title: 'Clear All Items?',
            message: 'Are you sure you want to remove all items from your cart?',
            onConfirm: () => {
                // TODO: Edit to call `removeAllProductsFromCart()` from smart contract
                setCartItems([]);
                handleCloseDialog();
            },
        });
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
            setCartItems([]);
            alert("May the beans roast with you!");
        } else {
            alert("You have not added any item to the cart!");
        }
    };

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
                                onClick={checkout}
                            >
                                Checkout
                            </button>
                        </div>

                        <ConfirmationDialog
                            open={dialogConfig.open}
                            title={dialogConfig.title}
                            message={dialogConfig.message}
                            onClose={handleCloseDialog}
                            onConfirm={dialogConfig.onConfirm}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CartDialog;