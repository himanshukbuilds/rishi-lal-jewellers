'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const sampleReviews = [
  {
    name: 'Ananya & Siddharth Mehta',
    city: 'South Mumbai',
    occasion: 'Royal Wedding Trousseau',
    item: 'Padmavati Kundan & Polki Choker Set',
    rating: 5,
    quote:
      'Choosing our bridal jewellery with Rishi Lal Jewellers was the highlight of our wedding planning. The weight, the finish of the gold, and the intricate meenakari work on the reverse side left our families spellbound. The HUID certification gave us 100% peace of mind.',
  },
  {
    name: 'Dr. Radhika Sen',
    city: 'New Delhi',
    occasion: '10th Anniversary Milestone',
    item: 'The Crown 1.50 Ct Solitaire Diamond Ring',
    rating: 5,
    quote:
      'The fire and brilliance in this IGI-certified solitaire is breathtaking. Ordering online was seamless with armored express delivery right to our residence in Golf Links. Truly an authentic luxury experience comparable to high Parisian ateliers.',
  },
  {
    name: 'Vikramaditya Singhania',
    city: 'Bengaluru',
    occasion: 'Festival Gifting',
    item: 'Mayur Heritage 22K Gold Temple Jhumkas',
    rating: 5,
    quote:
      'I purchased the temple jhumkas as a Diwali gift for my mother. The sheer detailing of the dancing peacocks and the antique matte finish is extraordinary. Transparent gold weight and making charges make Rishi Lal Jewellers completely trustworthy.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8F5EF] border-t border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C2AA6A] font-semibold mb-2">
            Patron Reflections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A0B13] font-normal tracking-tight">
            Cherished by Connoisseurs
          </h2>
          <div className="w-16 h-0.5 bg-[#C2AA6A] mx-auto mt-4" />
          <p className="font-sans text-[11px] text-[#454545] mt-3 italic">
            *Demonstration feedback reflecting real customer standards across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleReviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-sm border border-[#E6DFD3] hover:border-[#C2AA6A]/40 shadow-xs flex flex-col justify-between relative hover:shadow-luxury transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#C2AA6A]/30 absolute top-6 right-6" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C2AA6A] text-[#C2AA6A]" />
                  ))}
                </div>

                <p className="font-serif text-sm text-[#454545] leading-relaxed italic mb-6">
                  “{rev.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6DFD3]">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-[#4A0B13]">
                    {rev.name}
                  </h4>
                  <span className="flex items-center gap-1 text-[10px] text-[#8B1E2D] font-sans font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1E2D]" />
                    <span>Verified Patron</span>
                  </span>
                </div>
                <p className="font-sans text-xs text-[#454545] mt-0.5">
                  {rev.city} • <span className="text-[#C2AA6A] font-semibold">{rev.occasion}</span>
                </p>
                <p className="font-sans text-[11px] text-[#6E6E6E] mt-1 truncate">
                  Purchased: {rev.item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

