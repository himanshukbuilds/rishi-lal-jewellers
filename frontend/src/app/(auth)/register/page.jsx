'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the terms and conditions.' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerAuth } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setAuthError(null);
    setSuccessInfo(null);
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const res = await registerAuth({
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone.trim(),
        password: data.password,
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('rj_intro_seen', 'true');
      }

      const isVerified = res?.user?.isEmailVerified || !res?.requiresVerification;
      const message = isVerified
        ? 'Welcome to Rishi Lal Privileges. Your account is active. Taking you to the homepage...'
        : 'Your patron account has been created. A verification link has been sent to your email. Guiding you to the homepage...';

      setSuccessInfo({
        title: 'Account Created Successfully',
        message,
      });

      // Safe return destination validation (defaults to homepage '/')
      const next = searchParams.get('next');
      let destination = '/';
      if (next && next.startsWith('/') && !next.startsWith('//')) {
        try {
          const parsed = new URL(next, window.location.origin);
          if (parsed.origin === window.location.origin) {
            destination = `${parsed.pathname}${parsed.search}${parsed.hash}`;
          }
        } catch {
          destination = '/';
        }
      }

      setTimeout(() => {
        router.push(destination);
      }, 1100);
    } catch (err) {
      setAuthError(err.message || 'Unable to register. Please verify your details.');
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
          Join Rishi Lal Privileges
        </h2>
        <p className="mt-2 text-xs text-charcoal-600 font-sans">
          Register to unlock bespoke bridal previews, personal curation, and order tracking.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60 font-sans">
          {/* Luxury Success Banner */}
          {successInfo && (
            <div className="mb-6 p-4 rounded-sm bg-[#35050D] border border-[#D6B36A] text-xs text-[#F8F1E7] flex items-start gap-3 shadow-md animate-fadeIn">
              <Sparkles className="w-5 h-5 text-[#D6B36A] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-serif text-sm text-[#D6B36A] font-medium tracking-wide">
                  {successInfo.title}
                </strong>
                <p className="mt-1 text-[11px] text-[#F8F1E7]/90 leading-relaxed font-sans">
                  {successInfo.message}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={Boolean(successInfo)}
                  {...register('name')}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 disabled:bg-gray-50"
                />
                <User className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
              </div>
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled={Boolean(successInfo)}
                  {...register('email')}
                  placeholder="e.g. radhika@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 disabled:bg-gray-50"
                />
                <Mail className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Indian Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  disabled={Boolean(successInfo)}
                  {...register('phone')}
                  placeholder="e.g. 9811234567"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 disabled:bg-gray-50"
                />
                <Phone className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
              </div>
              {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={Boolean(successInfo)}
                  {...register('password')}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 disabled:bg-gray-50"
                />
                <Lock className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-charcoal-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={Boolean(successInfo)}
                  {...register('confirmPassword')}
                  placeholder="Re-enter your password"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 disabled:bg-gray-50"
                />
                <Lock className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                  className="absolute right-3 top-2.5 text-charcoal-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-charcoal-600">
                <input
                  type="checkbox"
                  disabled={Boolean(successInfo)}
                  {...register('terms')}
                  className="mt-0.5 accent-[#8B1E2D]"
                />
                <span>
                  I accept the <Link href="/terms" className="text-emerald-950 underline">Terms & Conditions</Link> and{' '}
                  <Link href="/privacy-policy" className="text-emerald-950 underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-[11px] text-red-600 mt-1">{errors.terms.message}</p>}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || Boolean(successInfo)}
                className="w-full py-3 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-[#C2AA6A]/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>
                  {successInfo
                    ? 'Redirecting to Homepage...'
                    : isSubmitting
                    ? 'Creating Account...'
                    : 'Register Account'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-200 text-center text-xs text-charcoal-600 font-sans">
            <p>
              Already registered?{' '}
              <Link
                href={`/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`}
                className="font-semibold text-emerald-950 hover:text-gold-700 underline"
              >
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
