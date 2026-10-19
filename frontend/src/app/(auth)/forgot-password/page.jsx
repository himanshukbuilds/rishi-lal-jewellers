'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h2 className="mt-6 font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
          Password Recovery
        </h2>
        <p className="mt-2 text-xs text-charcoal-600 font-sans">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-900/20 text-emerald-900 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-emerald-950">Instructions Dispatched</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-emerald-950">{email}</span>, a secure password reset link has been dispatched.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-700 hover:text-emerald-950 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-serif uppercase tracking-wider text-emerald-950 font-semibold block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@rishilaljewellers.demo"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                  />
                  <Mail className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-gold-300 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-gold-400/40"
              >
                Send Recovery Instructions
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-gold-700 hover:text-emerald-950 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

