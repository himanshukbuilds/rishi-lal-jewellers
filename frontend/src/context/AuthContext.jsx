'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('rishilal_token') || localStorage.getItem('aurelia_token');
        const storedUser = localStorage.getItem('rishilal_user') || localStorage.getItem('aurelia_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Silently verify and refresh profile from backend
          try {
            const data = await api.getMe();
            if (data?.user) {
              setUser(data.user);
              localStorage.setItem('rishilal_user', JSON.stringify(data.user));
            }
          } catch (e) {
            // Token might have expired
            if (e.status === 401) {
              localStorage.removeItem('rishilal_token');
              localStorage.removeItem('rishilal_user');
              localStorage.removeItem('aurelia_token');
              localStorage.removeItem('aurelia_user');
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Error restoring session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Customer Login
  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data.user?.role !== 'customer') {
      throw new Error('This sign-in is for customer accounts. Please use the Admin Portal for staff access.');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('rishilal_token', data.token);
    localStorage.setItem('rishilal_user', JSON.stringify(data.user));
    return data.user;
  };

  // Dedicated Admin Login with strict RBAC enforcement
  const adminLogin = async (email, password) => {
    const data = await api.login(email, password);
    if (data.user?.role !== 'admin') {
      throw new Error('Access Denied: Ordinary customer accounts cannot access the Master Admin Portal.');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('rishilal_token', data.token);
    localStorage.setItem('rishilal_user', JSON.stringify(data.user));
    return data.user;
  };

  // Customer Registration
  const register = async (userData) => {
    const data = await api.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('rishilal_token', data.token);
    localStorage.setItem('rishilal_user', JSON.stringify(data.user));
    return data.user;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rishilal_token');
    localStorage.removeItem('rishilal_user');
    localStorage.removeItem('aurelia_token');
    localStorage.removeItem('aurelia_user');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    const data = await api.updateProfile(profileData);
    setUser(data.user);
    localStorage.setItem('rishilal_user', JSON.stringify(data.user));
    return data.user;
  };

  // Add Address
  const addAddress = async (addressData) => {
    const data = await api.addAddress(addressData);
    const updatedUser = { ...user, addresses: data.addresses };
    setUser(updatedUser);
    localStorage.setItem('rishilal_user', JSON.stringify(updatedUser));
    return data.addresses;
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    const data = await api.deleteAddress(addressId);
    const updatedUser = { ...user, addresses: data.addresses };
    setUser(updatedUser);
    localStorage.setItem('rishilal_user', JSON.stringify(updatedUser));
    return data.addresses;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

