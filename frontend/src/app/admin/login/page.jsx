'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldAlert, Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const adminLoginSchema = z.object({
  email: z.string().min(1, 'Please enter admin email').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      await adminLogin(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Access Forbidden: Invalid administrator credentials.');
    }
  };

  const handleFillDemoAdmin = () => {
    setValue('email', 'admin@rishilaljewellers.demo');
    setValue('password', 'Admin@123');
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-ivory-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <BrandLogo variant="light" size="lg" className="justify-center" />
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 border border-gold-400/40 text-gold-300 text-[11px] font-sans font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>Curator & Master Administration Portal</span>
        </div>
        <p className="mt-2 text-xs text-ivory-300/80 font-sans">
          Restricted access for store curators, inventory managers, and fulfillment officers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-emerald-900/90 py-8 px-6 shadow-2xl sm:rounded-sm sm:px-10 border border-gold-400/30 backdrop-blur-md">
          {/* Demo Admin Autofill Pill */}
          <div className="mb-6 p-3.5 bg-emerald-950/80 rounded-sm border border-gold-400/40 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gold-300 block">Faculty Evaluation Admin:</span>
              <span className="text-[11px] text-ivory-300/80 font-mono">admin@rishilaljewellers.demo</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-emerald-950 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0"
            >
              Autofill
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-sm bg-red-900/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-xs">
            <div>
              <label className="font-serif uppercase tracking-wider text-gold-300 font-semibold block mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@rishilaljewellers.demo"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-emerald-950 border border-gold-400/40 rounded-sm focus:outline-none focus:border-gold-400 text-ivory-50 placeholder-ivory-400/50"
                />
                <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
              </div>
              {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-serif uppercase tracking-wider text-gold-300 font-semibold block mb-1">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-emerald-950 border border-gold-400/40 rounded-sm focus:outline-none focus:border-gold-400 text-ivory-50 placeholder-ivory-400/50"
                />
                <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
              </div>
              {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-emerald-950 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate as Administrator'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gold-400/20 text-center text-xs text-ivory-300/70 font-sans">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Boutique Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

