import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

import mockCoffeeData from '../../data/mockCoffeeItems';

const CoffeeDialog = () => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };

    const h1Header = "Shopping Cart";
    const h2Header = "Review your Coffee Beans and proceed to checkout";

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

                        <div className="grid grid-cols-5 gap-4 px-6 py-3 text-white font-semibold">
                            <div>Image</div>
                            <div>Name</div>
                            <div className="text-center">Number of NFTs</div>
                            <div className="text-center">Total Price</div>
                            <div className="text-right">Action</div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {mockCoffeeData.map((item, index) => (
                                <div key={index} className="grid grid-cols-5 gap-4 px-6 py-4 items-center border-t border-green-600 text-white">
                                    <div>
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded" />
                                    </div>
                                    <span>{item.name}</span>
                                    <span className="text-center">12</span>
                                    <span className="text-right">{item.price} ETH</span>
                                    <div className="flex justify-end">
                                        <button
                                            className="p-2 hover:bg-red-600 rounded-full transition-colors"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 mt-auto border-t border-green-600 flex justify-end">
                            <button 
                                className="bg-[#a0522d] text-white py-2 px-4 rounded hover:bg-[#8b4513]"
                                onClick={toggleModal}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoffeeDialog;
