import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.product_id);
            if (existing) {
                return prev.map(item => 
                    item.product_id === product.product_id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product_id !== productId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => {
        const itemPrice = parseFloat(item.PRICE || item.price || 0);
        return total + (itemPrice * item.quantity);
    }, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
