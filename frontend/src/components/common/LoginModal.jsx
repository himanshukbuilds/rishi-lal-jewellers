'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, X, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function LoginModal({ open, source, onClose, onSuccess, onNavigate, setSubmitting }) {
  const { login } = useAuth();
  const cardRef = useRef(null);
  const priorFocus = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(open);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const safeClose = () => { if (!isSubmitting) onClose(); };

  useEffect(() => {
    setSubmitting(isSubmitting);
  }, [isSubmitting, setSubmitting]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      priorFocus.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setVisible(true);
        cardRef.current?.querySelector('input')?.focus();
      });
      return () => { document.body.style.overflow = ''; };
    }
    setVisible(false);
    reset();
    setAuthError('');
    if (priorFocus.current?.focus) priorFocus.current.focus();
    document.body.style.overflow = '';
    const removal = window.setTimeout(() => setMounted(false), 210);
    return () => window.clearTimeout(removal);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return undefined;
    const keydown = (event) => {
      if (event.key === 'Escape') safeClose();
      if (event.key !== 'Tab' || !cardRef.current) return;
      const nodes = cardRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])');
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [open, isSubmitting, onClose]);

  const submit = async ({ email, password }) => {
    setAuthError('');
    try {
      await login(email.trim().toLowerCase(), password);
      onSuccess();
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in. Please try again.');
    }
  };

  if (!mounted) return null;
  const next = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
  const query = next !== '/' ? `?next=${encodeURIComponent(next)}` : '';

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-colors duration-200 motion-reduce:transition-none ${visible ? 'bg-black/40' : 'bg-black/0'}`}
      onMouseDown={(event) => { if (event.target === event.currentTarget) safeClose(); }}
      aria-hidden={!open}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      <section
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className={`relative max-h-[calc(100dvh-32px)] w-[min(360px,calc(100vw-32px))] overflow-y-auto rounded-[18px] border border-[#D6B36A] bg-[#F8F1E7] px-7 py-6 text-[#35050D] shadow-[0_22px_70px_rgba(0,0,0,.32)] transition-all duration-200 ease-out motion-reduce:transition-none ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
      >
        <button type="button" onClick={safeClose} aria-label="Close sign in" className="absolute right-3 top-3 rounded-full p-2 text-[#6B5448] hover:bg-[#EADCC8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6B36A]">
          <X size={18} />
        </button>
        <div className="mb-3 flex justify-center">
          <Image src="/images/logo.png" alt="Rishi Lal Jewellers crest" width={56} height={56} className="h-14 w-14 object-contain" priority />
        </div>
        <h2 id="login-title" className="text-center font-serif text-[26px] leading-tight text-[#650B19]">Welcome Back</h2>
        <p className="mb-5 mt-1 text-center text-[13px] text-[#705E52]">Sign in to continue your jewellery journey.</p>
        {authError && <div role="alert" className="mb-3 flex gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-800"><AlertCircle size={16} className="shrink-0" />{authError}</div>}
        <form onSubmit={handleSubmit(submit)} className="space-y-3.5">
          <div>
            <label htmlFor="modal-email" className="mb-1 block text-xs font-semibold text-[#4A1820]">Email Address</label>
            <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#927E70]" /><input id="modal-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} className="h-10 w-full rounded-md border border-[#DCCBB4] bg-[#FFFCF7] pl-9 pr-3 text-[13px] text-[#35050D] outline-none focus:border-[#D6B36A] focus:ring-2 focus:ring-[#D6B36A]/25" placeholder="Enter your email" /></div>
            {errors.email && <p className="mt-1 text-[11px] text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="modal-password" className="mb-1 block text-xs font-semibold text-[#4A1820]">Password</label>
            <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#927E70]" /><input id="modal-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={!!errors.password} {...register('password')} className="h-10 w-full rounded-md border border-[#DCCBB4] bg-[#FFFCF7] pl-9 pr-10 text-[13px] text-[#35050D] outline-none focus:border-[#D6B36A] focus:ring-2 focus:ring-[#D6B36A]/25" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#78685D] hover:text-[#650B19]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            {errors.password && <p className="mt-1 text-[11px] text-red-700">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="h-10 w-full rounded-md border border-[#D6B36A] bg-[#650B19] text-xs font-semibold tracking-[.12em] text-[#FFFCF7] transition-colors hover:bg-[#35050D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B36A] disabled:cursor-wait disabled:opacity-70">{isSubmitting ? 'SIGNING IN…' : 'SIGN IN'}</button>
        </form>
        <div className="my-4 flex items-center gap-3 text-[11px] text-[#927E70]"><span className="h-px flex-1 bg-[#E4D5C1]" />or<span className="h-px flex-1 bg-[#E4D5C1]" /></div>
        <p className="text-center text-xs text-[#55463F]">New customer?{' '}<button type="button" onClick={() => onNavigate(`/register${query}`)} className="font-semibold text-[#8A2631] underline underline-offset-2">Create an account</button></p>
        {source === 'reminder' && <span className="sr-only">Sign in reminder</span>}
      </section>
    </div>
  );
}
