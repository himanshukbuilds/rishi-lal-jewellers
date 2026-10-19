'use client';

import React from 'react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-sm border border-gold-300 shadow-sm space-y-6 text-xs font-sans text-charcoal-700 leading-relaxed">
        <div className="border-b border-gold-200 pb-4">
          <p className="text-gold-700 font-bold uppercase tracking-widest text-[11px]">Data Stewardship</p>
          <h1 className="font-serif text-3xl text-emerald-950 font-normal mt-1">
            Privacy Policy
          </h1>
          <p className="text-charcoal-500 text-[11px] mt-1">Effective: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">1. Information We Collect</h2>
          <p>
            When patrons visit our digital boutique or register an account with {BRAND_CONFIG.legalName}, we collect basic contact information (name, email, shipping destination, phone number) necessary for armored courier fulfillment and statutory Indian tax invoicing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">2. Payment Security</h2>
          <p>
            We do not store or process payment card numbers or banking secrets directly on our servers. All digital transactions are handled via PCI-DSS certified gateway partners with 256-bit SSL encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">3. Demonstration Disclaimer</h2>
          <p>
            This website is an academic demonstration project for college evaluation. Any contact details provided during demo checkout are strictly preserved locally for testing and simulation purposes only.
          </p>
        </section>
      </div>
    </div>
  );
}

