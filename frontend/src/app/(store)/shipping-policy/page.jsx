'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-ivory-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-sm border border-gold-300 shadow-sm space-y-6 text-xs font-sans text-charcoal-700 leading-relaxed">
        <div className="border-b border-gold-200 pb-4">
          <p className="text-gold-700 font-bold uppercase tracking-widest text-[11px]">Client Protection</p>
          <h1 className="font-serif text-3xl text-emerald-950 font-normal mt-1">
            Insured Armored Delivery Policy
          </h1>
          <p className="text-charcoal-500 text-[11px] mt-1">Last Updated: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">1. Complimentary 100% Transit Insurance</h2>
          <p>
            Every order placed with Rishi Lal Jewellers is transported with comprehensive transit insurance underwritten by leading institutional insurers. The risk of loss or transit damage remains completely with Rishi Lal Jewellers until the package is handed over and an OTP signature is provided by the patron.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">2. Discreet & Tamper-Evident Packaging</h2>
          <p>
            For maximum discretion and security, the outer shipping box carries no indication of fine jewelry or brand branding. Inside, your creation is nestled within our signature velvet jewelry casket, sealed in a serial-numbered tamper-evident polymer pouch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">3. Delivery Timelines</h2>
          <p>
            • Metro Cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata): 2 to 3 business days.<br />
            • Tier-2 & Tier-3 Cities across India: 3 to 5 business days.<br />
            • Bespoke or custom bridal sizing: 7 to 10 business days including hallmarking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">4. Delivery Inspection</h2>
          <p>
            Patrons are requested to inspect the external tamper-proof seal before providing the delivery confirmation OTP to the armored courier representative. In the unlikely event that the outer seal appears breached, please refuse delivery and immediately alert our concierge at {BRAND_CONFIG.contact.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}

