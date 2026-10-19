'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerAuth } = useAuth();
  const [authError, setAuthError] = useState(null);
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
    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
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
        <div className="bg-white py-8 px-6 shadow-luxury sm:rounded-sm sm:px-10 border border-gold-300/60">
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
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-2.5 text-charcoal-500">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
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
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'} className="absolute right-3 top-2.5 text-charcoal-500">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-charcoal-600">
                <input type="checkbox" {...register('terms')} className="mt-0.5 accent-[#8B1E2D]" />
                <span>I accept the <Link href="/terms" className="text-emerald-950 underline">Terms & Conditions</Link> and <Link href="/privacy-policy" className="text-emerald-950 underline">Privacy Policy</Link>.</span>
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
              <Link href={`/login${searchParams.get('next') ? `?next=${encodeURIComponent(searchParams.get('next'))}` : ''}`} className="font-semibold text-emerald-950 hover:text-gold-700 underline">
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

