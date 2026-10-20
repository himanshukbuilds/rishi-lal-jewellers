'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Mail,
  RefreshCw,
  Home,
  Sparkles,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'no-token'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Resend form state for expired links
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // 1. Process verification token on mount
  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    let isMounted = true;
    const executeVerification = async () => {
      try {
        await verifyEmail(token);
        if (isMounted) {
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(
            err.message ||
              'This email verification link is invalid, has expired, or has already been used.'
          );
        }
      }
    };

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Countdown redirect to Homepage ('/') upon success
  useEffect(() => {
    if (status !== 'success') return;

    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, router]);

  // 3. Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // 4. Handle resend request
  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail || resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setResendStatus(null);
    try {
      await resendVerification(resendEmail.trim().toLowerCase());
      setResendStatus({
        type: 'success',
        message: 'A fresh verification link has been dispatched to your email address.',
      });
      setResendCooldown(60);
    } catch (err) {
      setResendStatus({
        type: 'error',
        message: err.message || 'Unable to resend verification email.',
      });
      if (err.data?.retryAfterSeconds) {
        setResendCooldown(err.data.retryAfterSeconds);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
          Email Verification
        </h2>
        <p className="mt-2 text-xs text-charcoal-600 font-sans">
          Activating your Rishi Lal Privileges account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60 font-sans">
          {/* ==============================================================
              STATE 1: VERIFYING (LOADING)
              ============================================================== */}
          {status === 'loading' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-ivory-100 border border-gold-300 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#8B1E2D] animate-spin" />
              </div>
              <h3 className="font-serif text-lg text-emerald-950">
                Verifying Your Email Address...
              </h3>
              <p className="text-xs text-charcoal-600 max-w-xs mx-auto leading-relaxed">
                Please wait a moment while we validate your security token and activate your account.
              </p>
            </div>
          )}

          {/* ==============================================================
              STATE 2: VERIFICATION SUCCESS (REDIRECTS TO HOMEPAGE '/')
              ============================================================== */}
          {status === 'success' && (
            <div className="py-4 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-emerald-950 font-normal">
                  Email Verified Successfully!
                </h3>
                <p className="mt-2 text-xs text-charcoal-700 leading-relaxed">
                  Welcome to <strong>Rishi Lal Jewellers</strong>. Your patron account is fully activated and ready to explore our haute jewellery collections.
                </p>
              </div>

              <div className="p-3 bg-ivory-50 border border-gold-200/80 rounded-sm text-xs text-charcoal-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-700 shrink-0" />
                <span>
                  Redirecting to the homepage in <strong>{countdown}</strong> second{countdown === 1 ? '' : 's'}...
                </span>
              </div>

              {/* Primary Acceptance Button: "Continue to Home" linking to '/' */}
              <div className="pt-2">
                <Link
                  href="/"
                  className="w-full py-3.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-[#C2AA6A]/40 flex items-center justify-center gap-2 shadow-md"
                >
                  <Home className="w-4 h-4 text-gold-400" />
                  <span>Continue to Home</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* ==============================================================
              STATE 3: TOKEN INVALID OR EXPIRED
              ============================================================== */}
          {status === 'error' && (
            <div className="py-4 space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                <Clock className="w-7 h-7 text-amber-700" />
              </div>

              <div>
                <h3 className="font-serif text-lg text-emerald-950 font-normal">
                  Verification Link Expired or Invalid
                </h3>
                <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              {/* Resend Verification Form */}
              <div className="text-left pt-2 border-t border-gold-200 space-y-3">
                <h4 className="font-serif text-xs uppercase tracking-wider text-emerald-950 font-semibold">
                  Request a New Verification Link
                </h4>
                <p className="text-[11px] text-charcoal-600">
                  Enter your email address below and we will dispatch a fresh verification link.
                </p>

                {resendStatus && (
                  <div
                    className={`p-3 rounded-sm text-xs flex items-center gap-2 ${
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

                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                    />
                    <Mail className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                  </div>

                  <button
                    type="submit"
                    disabled={resendLoading || resendCooldown > 0 || !resendEmail}
                    className="w-full py-2.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors border border-[#C2AA6A]/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendLoading
                        ? 'Sending...'
                        : resendCooldown > 0
                        ? `Wait ${resendCooldown}s`
                        : 'Send New Verification Link'}
                    </span>
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-gold-200 flex items-center justify-between text-xs text-charcoal-600">
                <Link href="/login" className="text-emerald-950 hover:text-gold-700 underline font-medium">
                  Return to Sign In
                </Link>
                <Link href="/" className="text-emerald-950 hover:text-gold-700 underline font-medium">
                  Go to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* ==============================================================
              STATE 4: NO TOKEN IN URL
              ============================================================== */}
          {status === 'no-token' && (
            <div className="py-4 space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-ivory-100 border border-gold-300 flex items-center justify-center">
                <Mail className="w-7 h-7 text-[#8B1E2D]" />
              </div>

              <div>
                <h3 className="font-serif text-lg text-emerald-950 font-normal">
                  Verify Your Patron Email
                </h3>
                <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">
                  Please open the verification link sent directly to your email inbox from Rishi Lal Jewellers.
                </p>
              </div>

              {/* Request verification link form */}
              <div className="text-left pt-2 border-t border-gold-200 space-y-3">
                <h4 className="font-serif text-xs uppercase tracking-wider text-emerald-950 font-semibold">
                  Need a Verification Link?
                </h4>
                <p className="text-[11px] text-charcoal-600">
                  Enter your email address to receive a fresh verification link.
                </p>

                {resendStatus && (
                  <div
                    className={`p-3 rounded-sm text-xs flex items-center gap-2 ${
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

                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                    />
                    <Mail className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                  </div>

                  <button
                    type="submit"
                    disabled={resendLoading || resendCooldown > 0 || !resendEmail}
                    className="w-full py-2.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors border border-[#C2AA6A]/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendLoading
                        ? 'Sending...'
                        : resendCooldown > 0
                        ? `Wait ${resendCooldown}s`
                        : 'Send Verification Link'}
                    </span>
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-gold-200 flex items-center justify-between text-xs text-charcoal-600">
                <Link href="/login" className="text-emerald-950 hover:text-gold-700 underline font-medium">
                  Return to Sign In
                </Link>
                <Link href="/" className="text-emerald-950 hover:text-gold-700 underline font-medium">
                  Go to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

