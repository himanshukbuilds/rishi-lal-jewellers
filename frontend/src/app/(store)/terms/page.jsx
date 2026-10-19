'use client';

import React from 'react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function TermsPage() {
  return (
    <div className="bg-ivory-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-sm border border-gold-300 shadow-sm space-y-6 text-xs font-sans text-charcoal-700 leading-relaxed">
        <div className="border-b border-gold-200 pb-4">
          <p className="text-gold-700 font-bold uppercase tracking-widest text-[11px]">Commercial Framework</p>
          <h1 className="font-serif text-3xl text-emerald-950 font-normal mt-1">
            Terms of Service
          </h1>
          <p className="text-charcoal-500 text-[11px] mt-1">Effective: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">1. Acceptance of Terms</h2>
          <p>
            By perusing or procuring jewelry through Rishi Lal Jewellers, you enter an agreement governed by the commercial laws of India and the jurisdiction of the courts of Mumbai, Maharashtra.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">2. Pricing & Market Gold Benchmarks</h2>
          <p>
            Gold jewelry prices fluctuate in alignment with international bullion markets (MCX India). Rishi Lal Jewellers guarantees the locked purchase price at the instant an order is formally confirmed through our digital checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">3. Academic College Project Scope</h2>
          <p>
            This website represents an educational engineering submission for INT252 (Web App Development with ReactJS) and INT257 (Modern Web Application Development). Real financial payments are not executed on this platform.
          </p>
        </section>
      </div>
    </div>
  );
}

