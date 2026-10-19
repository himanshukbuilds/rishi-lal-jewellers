'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rishilal_wishlist') || localStorage.getItem('aurelia_wishlist');
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('[WishlistContext] Error reading from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rishilal_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistItems.some((item) => (item._id || item.id) === productId);
    },
    [wishlistItems]
  );

  // Toggle in wishlist
  const toggleWishlist = useCallback(
    async (product) => {
      const authToken = localStorage.getItem('rishilal_token') || localStorage.getItem('aurelia_token');
      if (!authToken) {
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/login?${new URLSearchParams({ next }).toString()}`);
        return;
      }
      const id = product._id || product.id;
      const exists = wishlistItems.some((item) => (item._id || item.id) === id);

      if (exists) {
        setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } else {
        setWishlistItems((prev) => [...prev, product]);
      }

      // If user is authenticated, sync with server
      if (isAuthenticated) {
        try {
          await api.toggleWishlist(id);
        } catch (e) {
          console.warn('[WishlistContext] Backend sync failed:', e);
        }
      }
    },
    [wishlistItems, isAuthenticated]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  }, []);

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

