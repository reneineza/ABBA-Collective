'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeJsonParse } from '@/lib/utils/json';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from LocalStorage safely on mount
  useEffect(() => {
    try {
      const savedCart = safeJsonParse(localStorage.getItem('abba_collective_cart'), []);
      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to LocalStorage when modified
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('abba_collective_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cart, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product, selectedSize = 'M', selectedColor = 'Charcoal', quantity = 1) => {
    const itemKey = `${product.id}-${selectedSize}-${selectedColor}`;
    const mainImage = product.images && product.images.length > 0 
      ? product.images[0].image_url 
      : (product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800');

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            itemKey,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            size: selectedSize,
            color: selectedColor,
            image: mainImage,
            quantity,
            collection: product.collection || product.category || 'ABBA Collective',
          },
        ];
      }
    });

    setIsOpen(true);
  };

  const removeItem = (itemKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemKey);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.itemKey === itemKey ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
