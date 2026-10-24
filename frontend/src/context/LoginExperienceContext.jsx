'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import LoginModal from '@/components/common/LoginModal';

const LoginExperienceContext = createContext(null);
const REMINDER_MS = 2 * 60 * 1000;

export function LoginExperienceProvider({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [homeReady, setHomeReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [source, setSource] = useState('manual');
  const pendingAction = useRef(null);

  const openLogin = useCallback((options = {}) => {
    if (isAuthenticated) return;
    if (options.onSuccess) pendingAction.current = options.onSuccess;
    setSource(options.source || 'manual');
    setIsOpen(true);
  }, [isAuthenticated]);

  const closeLogin = useCallback(() => {
    if (isSubmitting) return;
    pendingAction.current = null;
    setIsOpen(false);
  }, [isSubmitting]);

  const loginSucceeded = useCallback(() => {
    const action = pendingAction.current;
    pendingAction.current = null;
    setIsOpen(false);
    if (action) action();
  }, []);

  useEffect(() => {
    const ready = () => setHomeReady(true);
    const notReady = () => setHomeReady(false);
    window.addEventListener('store-home-ready', ready);
    window.addEventListener('store-home-hidden', notReady);
    if (pathname !== '/') setHomeReady(false);
    return () => {
      window.removeEventListener('store-home-ready', ready);
      window.removeEventListener('store-home-hidden', notReady);
    };
  }, [pathname]);

  useEffect(() => {
    if (loading || isAuthenticated || pathname !== '/' || !homeReady || isOpen) return undefined;
    const timer = window.setTimeout(() => {
      if (!isSubmitting) {
        setSource('reminder');
        setIsOpen(true);
      }
    }, REMINDER_MS);
    return () => window.clearTimeout(timer);
  }, [loading, isAuthenticated, pathname, homeReady, isOpen, isSubmitting]);

  const value = { openLogin, closeLogin, setIsSubmitting, loginSucceeded };
  return (
    <LoginExperienceContext.Provider value={value}>
      {children}
      <LoginModal
        open={isOpen && !isAuthenticated}
        source={source}
        onClose={closeLogin}
        onSuccess={loginSucceeded}
        onNavigate={(path) => { setIsOpen(false); router.push(path); }}
        setSubmitting={setIsSubmitting}
      />
    </LoginExperienceContext.Provider>
  );
}

export const useLoginExperience = () => {
  const context = useContext(LoginExperienceContext);
  if (!context) throw new Error('useLoginExperience must be used within LoginExperienceProvider');
  return context;
};
