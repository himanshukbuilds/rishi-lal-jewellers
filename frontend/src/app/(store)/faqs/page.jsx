'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';

const faqData = [
  {
    q: 'How do I verify the BIS Hallmark on my Rishi Lal jewelry?',
    a: 'Every piece of gold jewelry crafted by Rishi Lal Jewellers features the mandatory Bureau of Indian Standards (BIS) hallmark, which includes the BIS triangular logo, the purity grade (e.g., 22K916 or 18K750), and a unique 6-digit alphanumeric HUID (Hallmark Unique Identification). You can verify this HUID directly on the official BIS Care mobile app.',
  },
  {
    q: 'Are the diamonds and gemstones independently certified?',
    a: 'Yes. All our natural solitaires and diamond-studded jewelry are certified by leading global gemological institutions such as the International Gemological Institute (IGI) or the Gemological Institute of America (GIA). Each piece arrives with an official physical grading certificate specifying diamond carat weight, cut, color (E-F colorless), and clarity (VVS).',
  },
  {
    q: 'How does complimentary insured shipping operate across India?',
    a: 'Every delivery is dispatched in tamper-evident, sealed armored courier packaging and is 100% transit-insured from our atelier until signed for at your doorstep. We partner with specialized high-value logistics providers across 26,000+ Indian PIN codes. Deliveries typically conclude within 2 to 4 business days.',
  },
  {
    q: 'What is your Lifetime Exchange & Buyback policy?',
    a: 'We offer a transparent lifetime buyback and exchange guarantee across all our boutique salons. Gold is exchanged at 100% of the benchmark prevailing market gold rate. Certified diamonds are exchanged at 100% of the invoice valuation (or 90% in case of cash buyback).',
  },
  {
    q: 'How do I determine my correct ring or bangle size?',
    a: 'Indian standard ring sizes range from 8 to 22. Standard bangle sizes range from 2.4 (small) to 2.8 (large). You can consult our printable sizing chart or request a complimentary Rishi Lal ring sizer dispatched to your address by contacting our concierge hotline.',
  },
  {
    q: 'How are making charges and taxes structured?',
    a: 'We maintain absolute transparency. Your final invoice explicitly separates: (1) Pure gold value based on certified gross and net weight, (2) Diamond and precious gemstone valuation, (3) Artisan making charges (ranging from 8% to 14% based on craftsmanship complexity), and (4) Standard 3% Indian GST.',
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-emerald-950 text-ivory-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold">
            Knowledge & Purity
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ivory-50">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
          <p className="font-sans text-xs sm:text-sm text-ivory-200/85 mt-3 leading-relaxed">
            Everything you need to know regarding hallmarking, diamond certification, insured shipping, and buyback policies.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-sm border border-gold-300/60 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-ivory-50/70 transition-colors"
                >
                  <span className="font-serif text-base font-semibold text-emerald-950">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full text-gold-700 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-charcoal-700 font-sans leading-relaxed border-t border-ivory-200/70">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

