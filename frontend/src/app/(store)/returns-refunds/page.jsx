'use client';

import React from 'react';
import Link from 'next/link';

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-ivory-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-sm border border-gold-300 shadow-sm space-y-6 text-xs font-sans text-charcoal-700 leading-relaxed">
        <div className="border-b border-gold-200 pb-4">
          <p className="text-gold-700 font-bold uppercase tracking-widest text-[11px]">Patron Assurance</p>
          <h1 className="font-serif text-3xl text-emerald-950 font-normal mt-1">
            Exchange, Returns & Buyback Terms
          </h1>
          <p className="text-charcoal-500 text-[11px] mt-1">Last Updated: October 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">1. 15-Day Complimentary Exchange</h2>
          <p>
            If you wish to exchange your unworn creation for a different ring size, bangle dimension, or design, we offer a 15-day return and exchange window from the date of physical receipt. The item must be returned in its original casket with all security tags intact and accompanied by the original IGI/GIA certificate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">2. Lifetime Buyback Guarantee</h2>
          <p>
            • Plain Gold Jewelry: 100% of benchmark market gold valuation based on certified net gold weight.<br />
            • Diamond & Solitaire Jewelry: 100% of diamond value on exchange, or 90% in cash buyback against prevailing market rates.<br />
            • Making charges and statutory GST are non-refundable upon buyback.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-semibold text-emerald-950">3. Non-Returnable Articles</h2>
          <p>
            Custom engraved creations, personalized initial signets, or bespoke bridal trousseaus altered to individual patron specifications are ineligible for the 15-day return window, but remain permanently covered under our Lifetime Buyback Guarantee.
          </p>
        </section>
      </div>
    </div>
  );
}

