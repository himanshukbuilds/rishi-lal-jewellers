'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '@/services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rishilal_cart') || localStorage.getItem('aurelia_cart');
      const storedCoupon = localStorage.getItem('rishilal_coupon') || localStorage.getItem('aurelia_coupon');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.warn('[CartContext] Error restoring cart from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rishilal_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (coupon) {
        localStorage.setItem('rishilal_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('rishilal_coupon');
        localStorage.removeItem('aurelia_coupon');
      }
    }
  }, [coupon, isLoaded]);

  // Add Item to Cart
  const addToCart = useCallback((product, quantity = 1, selectedSize = 'Standard') => {
    const authToken = localStorage.getItem('rishilal_token') || localStorage.getItem('aurelia_token');
    if (!authToken) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/login?${new URLSearchParams({ next }).toString()}`);
      return;
    }
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === (product._id || product.id) && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem = {
        productId: product._id || product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images && product.images[0] ? product.images[0] : '/images/placeholder-jewelry.jpg',
        selectedSize: selectedSize || (product.availableSizes ? product.availableSizes[0] : 'Standard'),
        quantity: Math.max(1, quantity),
        metal: product.metal,
        purity: product.purity,
        grossWeight: product.grossWeight,
      };

      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  }, []);

  // Remove Item
  const removeFromCart = useCallback((productId, selectedSize) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedSize === selectedSize))
    );
  }, []);

  // Update Quantity
  const updateQuantity = useCallback((productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear Cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('rishilal_cart');
    localStorage.removeItem('rishilal_coupon');
    localStorage.removeItem('aurelia_cart');
    localStorage.removeItem('aurelia_coupon');
  }, []);

  // Apply Coupon
  const applyCoupon = useCallback(async (code) => {
    try {
      const currentSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const res = await api.validateCoupon(code, currentSubtotal);
      if (res.success && res.coupon) {
        setCoupon(res.coupon);
        return { success: true, message: res.message, coupon: res.coupon };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to apply coupon' };
    }
  }, [cartItems]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  // Subtotal, Tax, Discount, and Total calculations using useMemo
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.03); // 3% GST
    let discount = 0;

    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
      } else {
        discount = coupon.discountValue || 0;
      }
    }

    const shippingCharges = 0; // Free insured shipping
    const total = Math.max(0, subtotal + tax - discount + shippingCharges);
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return {
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      itemCount,
    };
  }, [cartItems, coupon]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    openCart: () => {
      const authToken = typeof window !== 'undefined' && (localStorage.getItem('rishilal_token') || localStorage.getItem('aurelia_token'));
      if (!authToken) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/login?${new URLSearchParams({ next: next === '/' ? '/cart' : next }).toString()}`);
        return;
      }
      setIsCartOpen(true);
    },
    closeCart: () => setIsCartOpen(false),
    ...calculations,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

