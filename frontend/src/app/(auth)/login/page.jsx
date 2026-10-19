'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      await login(data.email, data.password);
      const next = searchParams.get('next');
      let destination = '/account';
      if (next?.startsWith('/')) {
        try {
          const parsed = new URL(next, window.location.origin);
          if (parsed.origin === window.location.origin) destination = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        } catch {
          // Keep the safe account destination when the return path is malformed.
        }
      }
      router.push(destination);
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleFillDemoCustomer = () => {
    setValue('email', 'customer@rishilaljewellers.demo');
    setValue('password', 'Customer@123');
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
          Patron Sign In
        </h2>
        <p className="mt-2 text-xs text-charcoal-600 font-sans">
          Access your orders, saved trousseau wishlist, and concierge privileges.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60">
          {/* Quick Demo Autofill Pill */}
          <div className="mb-6 p-3 bg-ivory-100/90 rounded-sm border border-gold-300/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-950 block">Faculty / Demo Customer:</span>
              <span className="text-[11px] text-charcoal-600">customer@rishilaljewellers.demo</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCustomer}
              className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-emerald-950 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0"
            >
              Autofill
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-xs">
            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="patron@rishilaljewellers.demo"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                />
                <Mail className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-gold-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                />
                <Lock className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-2.5 text-charcoal-500"><span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-[#C2AA6A]/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-200 text-center text-xs text-charcoal-600 font-sans space-y-3">
            <p>
              New to Rishi Lal Jewellers?{' '}
              <Link href={`/register${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`} className="font-semibold text-emerald-950 hover:text-gold-700 underline">
                Create an Account
              </Link>
            </p>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-gold-800 hover:text-gold-900 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Looking for the Admin Portal? Click here</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

