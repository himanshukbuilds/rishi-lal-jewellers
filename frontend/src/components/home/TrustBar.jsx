import React from 'react';
import { ShieldCheck, Gift, Headphones, Gem } from 'lucide-react';

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: 'Secure Shopping',
    description: 'Industry-standard encryption for every transaction',
  },
  {
    icon: Gift,
    title: 'Signature Packaging',
    description: 'Every creation arrives in our royal velvet jewellery casket',
  },
  {
    icon: Headphones,
    title: 'Concierge Service',
    description: 'Dedicated jewelry consultants available 7 days a week',
  },
  {
    icon: Gem,
    title: 'Certified Authenticity',
    description: 'BIS hallmarked gold and IGI certified natural diamonds',
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-[#E6DFD3] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {trustHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="p-3.5 rounded-full bg-[#F8F5EF] border border-[#C2AA6A]/40 shadow-xs">
                  <Icon className="w-5 h-5 text-[#8B1E2D]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-[#4A0B13] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#454545] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
