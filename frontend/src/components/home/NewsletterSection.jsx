'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
});

export default function NewsletterSection() {
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubscribed(true);
    reset();
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FAF2F0] border-y border-[#E8C0B8]/60 relative overflow-hidden">
      {/* Decorative ambient blush glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#E8C0B8]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DEB1A8]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#DEB1A8]/50 text-[#8B1E2D] text-xs font-sans tracking-[0.2em] uppercase font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
          <span>The Connoisseur Circle</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A0B13] font-normal tracking-tight mb-4">
          Receive Private Invitations &amp; Heritage Edits
        </h2>

        <div className="w-16 h-0.5 bg-[#C2AA6A] mx-auto mb-5" />

        <p className="font-sans text-xs sm:text-sm text-[#454545] max-w-xl mx-auto leading-relaxed mb-8">
          Join our intimate circle to receive bespoke announcements for high-jewelry salon previews,
          bridal trunk shows, and seasonal privileges before public unveilings.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-4 bg-white border border-[#8B1E2D] rounded-sm text-[#4A0B13] shadow-sm animate-fade-in text-sm font-sans">
            <CheckCircle2 className="w-5 h-5 text-[#8B1E2D] shrink-0" />
            <span className="font-medium">
              Welcome to our private circle. An official invitation has been dispatched to your inbox.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  className="w-full px-4 py-3 bg-white border border-[#DEB1A8] rounded-sm text-xs sm:text-sm text-[#4A0B13] placeholder-[#454545]/60 focus:outline-none focus:border-[#4A0B13] focus:ring-1 focus:ring-[#4A0B13] transition-all font-sans shadow-xs"
                />
                {errors.email && (
                  <p className="absolute -bottom-5 left-1 text-[11px] text-red-600 font-sans">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 shrink-0 border border-[#C2AA6A]/30"
              >
                <span>{isSubmitting ? 'Joining...' : 'Request Invitation'}</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#454545] font-sans">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B1E2D]" />
                100% Privacy Guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
                Curated High-Jewelry Dispatch
              </span>
              <span>No Spam • Unsubscribe Anytime</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

