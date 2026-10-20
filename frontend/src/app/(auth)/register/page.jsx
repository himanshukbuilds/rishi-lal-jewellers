'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  terms: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms and conditions.' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const { register: registerAuth, resendVerification } = useAuth();
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification state
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (cooldownSeconds > 0) {
      timer = setTimeout(() => {
        setCooldownSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      await registerAuth({
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone.trim(),
        password: data.password,
      });

      // Show "Check Your Inbox" screen
      setRegisteredEmail(normalizedEmail);
      setIsSuccessState(true);
      setCooldownSeconds(60);
    } catch (err) {
      setAuthError(err.message || 'Unable to register. Please verify your details.');
    }
  };

  const handleResend = async () => {
    if (!registeredEmail || cooldownSeconds > 0 || resendLoading) return;
    setResendLoading(true);
    setResendStatus(null);
    try {
      await resendVerification(registeredEmail);
      setResendStatus({
        type: 'success',
        message: 'A fresh verification link has been sent to your email inbox.',
      });
      setCooldownSeconds(60);
    } catch (err) {
      setResendStatus({
        type: 'error',
        message: err.message || 'Unable to resend verification email at this time.',
      });
      if (err.data?.retryAfterSeconds) {
        setCooldownSeconds(err.data.retryAfterSeconds);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleStartOver = () => {
    setIsSuccessState(false);
    setRegisteredEmail('');
    setResendStatus(null);
    setAuthError(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
          {isSuccessState ? 'Verify Your Email' : 'Join Rishi Lal Privileges'}
        </h2>
        <p className="mt-2 text-xs text-charcoal-600 font-sans">
          {isSuccessState
            ? 'Complete this step to activate your patron account and continue.'
            : 'Register to unlock bespoke bridal previews, personal curation, and order tracking.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60">
          {/* ==============================================================
              STATE 1: "CHECK YOUR EMAIL" CONFIRMATION SCREEN
              ============================================================== */}
          {isSuccessState ? (
            <div className="space-y-6 text-center font-sans">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Mail className="w-7 h-7 text-[#8B1E2D]" />
              </div>

              <div>
                <h3 className="font-serif text-lg text-emerald-950 font-normal">
                  Check Your Email Inbox
                </h3>
                <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                  We have sent a secure verification email to:
                </p>
                <p className="mt-1 font-semibold text-xs text-emerald-950 bg-ivory-100 py-1.5 px-3 rounded-sm border border-gold-200 inline-block max-w-full truncate">
                  {registeredEmail}
                </p>
              </div>

              <div className="p-4 bg-ivory-50 rounded-sm border border-gold-200/80 text-left space-y-2 text-xs text-charcoal-700">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#8B1E2D] shrink-0">1.</span>
                  <span>Open the email from <strong>Rishi Lal Jewellers</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#8B1E2D] shrink-0">2.</span>
                  <span>Click the <strong>Verify Email Address</strong> button.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#8B1E2D] shrink-0">3.</span>
                  <span>You will be automatically verified and guided to the <strong>Homepage</strong>.</span>
                </div>
              </div>

              {resendStatus && (
                <div
                  className={`p-3 rounded-sm text-xs flex items-center gap-2 text-left ${
                    resendStatus.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {resendStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{resendStatus.message}</span>
                </div>
              )}

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldownSeconds > 0 || resendLoading}
                  className="w-full py-2.5 bg-ivory-100 hover:bg-ivory-200 text-emerald-950 text-xs font-semibold uppercase tracking-wider rounded-sm border border-gold-300 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-gold-700 ${resendLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendLoading
                      ? 'Sending...'
                      : cooldownSeconds > 0
                      ? `Resend in ${cooldownSeconds}s`
                      : 'Resend Verification Email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleStartOver}
                  className="text-[11px] text-charcoal-500 hover:text-emerald-950 underline block mx-auto"
                >
                  Entered wrong email? Register with a different address
                </button>
              </div>

              <div className="pt-4 border-t border-gold-200 text-xs text-charcoal-600">
                <p>
                  Already verified?{' '}
                  <Link
                    href={`/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`}
                    className="font-semibold text-emerald-950 hover:text-gold-700 underline"
                  >
                    Sign In to Your Account
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* ==============================================================
               STATE 2: REGISTRATION FORM
               ============================================================== */
            <>
              {authError && (
                <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
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
                      {...register('email')}
                      placeholder="e.g. radhika@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
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
                      {...register('phone')}
                      placeholder="e.g. 9811234567"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
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
                      {...register('password')}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
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
                      {...register('confirmPassword')}
                      placeholder="Re-enter your password"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
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
                    <input type="checkbox" {...register('terms')} className="mt-0.5 accent-[#8B1E2D]" />
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
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-[#C2AA6A]/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
