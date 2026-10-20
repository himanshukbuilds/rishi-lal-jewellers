'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, resendVerification } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Email verification unverified state handling
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmit = async (data) => {
    setAuthError(null);
    setUnverifiedEmail(null);
    setResendStatus(null);

    const normalizedEmail = data.email.trim().toLowerCase();

    try {
      const authenticatedUser = await login(normalizedEmail, data.password);

      // Default destination for patron login is the HOMEPAGE ('/')
      let destination = '/';

      // If user is administrator, route to admin dashboard
      if (authenticatedUser?.role === 'admin') {
        destination = '/admin/dashboard';
      } else {
        // Safe return destination validation (prevents open redirects)
        const next = searchParams.get('next');
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          try {
            const parsed = new URL(next, window.location.origin);
            if (parsed.origin === window.location.origin) {
              destination = `${parsed.pathname}${parsed.search}${parsed.hash}`;
            }
          } catch {
            // Keep the default homepage destination if malformed
            destination = '/';
          }
        }
      }

      router.push(destination);
    } catch (err) {
      // Check if error is due to unverified email
      if (err.data?.code === 'EMAIL_NOT_VERIFIED' || err.status === 403) {
        setUnverifiedEmail(err.data?.email || normalizedEmail);
        setAuthError(
          err.message ||
            'Your email address has not been verified yet. Please check your inbox for the verification link.'
        );
      } else {
        setAuthError(err.message || 'Invalid credentials. Please verify your email and password.');
      }
    }
  };

  const handleResendForUnverified = async () => {
    if (!unverifiedEmail || resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setResendStatus(null);
    try {
      await resendVerification(unverifiedEmail);
      setResendStatus({
        type: 'success',
        message: 'A fresh verification link has been dispatched to your email address.',
      });
      setResendCooldown(60);
    } catch (err) {
      setResendStatus({
        type: 'error',
        message: err.message || 'Unable to resend verification email at this time.',
      });
      if (err.data?.retryAfterSeconds) {
        setResendCooldown(err.data.retryAfterSeconds);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleFillDemoCustomer = () => {
    setValue('email', 'customer@rishilaljewellers.demo');
    setValue('password', 'Customer@123');
    setAuthError(null);
    setUnverifiedEmail(null);
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
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60 font-sans">
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

          {/* Unverified Email Warning Box with Resend Option */}
          {unverifiedEmail ? (
            <div className="mb-5 p-4 rounded-sm bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Email Verification Required</strong>
                  <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
                    Please verify that you own <strong>{unverifiedEmail}</strong> before signing in. Check your inbox or click below to request a new link.
                  </p>
                </div>
              </div>

              {resendStatus && (
                <div
                  className={`p-2 rounded-xs text-[11px] flex items-center gap-1.5 ${
                    resendStatus.type === 'success'
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                      : 'bg-red-100 border border-red-300 text-red-900'
                  }`}
                >
                  {resendStatus.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-700" />
                  )}
                  <span>{resendStatus.message}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleResendForUnverified}
                disabled={resendLoading || resendCooldown > 0}
                className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : ''}`} />
                <span>
                  {resendLoading
                    ? 'Sending Link...'
                    : resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Resend Verification Link'}
                </span>
              </button>
            </div>
          ) : authError ? (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
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
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-charcoal-500"
                >
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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

          <div className="mt-6 pt-6 border-t border-gold-200 text-center text-xs text-charcoal-600 space-y-3">
            <p>
              New to Rishi Lal Jewellers?{' '}
              <Link
                href={`/register${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`}
                className="font-semibold text-emerald-950 hover:text-gold-700 underline"
              >
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
