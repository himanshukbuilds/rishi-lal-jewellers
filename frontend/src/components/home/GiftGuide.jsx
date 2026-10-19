'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';

export default function GiftGuide() {
  const tiers = [
    {
      label: 'Fine Keepsakes',
      priceTag: 'Under ₹25,000',
      description: 'Dainty diamond studs, gold pendants, and auspicious chains.',
      link: '/products?maxPrice=25000',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Precious Milestones',
      priceTag: 'Under ₹50,000',
      description: 'Diamond solitaire bands, gold bangles, and everyday luxury.',
      link: '/products?maxPrice=50000',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Anniversary Connoisseur',
      priceTag: 'Under ₹1,00,000',
      description: 'Temple jhumkas, emerald medallions, and modern mangalsutras.',
      link: '/products?maxPrice=100000',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Grand Heirlooms',
      priceTag: 'Above ₹1,00,000',
      description: 'Royal polki chokers, diamond tennis bracelets, and bridal suites.',
      link: '/products?minPrice=100000',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#C2AA6A] font-sans text-xs uppercase tracking-[0.25em] font-semibold mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Gifts of Distinction</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A0B13] font-normal tracking-tight">
              Curated for Every Celebration
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-sans text-xs sm:text-sm text-[#454545] max-w-md">
            Whether welcoming a milestone anniversary or celebrating Diwali, find the ideal treasure packaged in our signature royal casket.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Link
              key={tier.label}
              href={tier.link}
              className="group relative rounded-sm overflow-hidden bg-[#F8F5EF] border border-[#E8C0B8]/50 p-5 flex flex-col justify-between hover:border-[#C2AA6A] hover:shadow-luxury transition-all duration-300"
            >
              <div className="relative aspect-square w-full rounded-sm overflow-hidden mb-4 bg-white border border-[#E6DFD3]">
                <Image
                  src={tier.image}
                  alt={tier.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <span className="text-[11px] font-sans font-bold text-[#8B1E2D] uppercase tracking-wider block mb-1">
                  {tier.priceTag}
                </span>
                <h3 className="font-serif text-lg font-medium text-[#4A0B13] group-hover:text-[#C2AA6A] transition-colors">
                  {tier.label}
                </h3>
                <p className="font-sans text-xs text-[#454545] mt-1 line-clamp-2">
                  {tier.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DFD3] flex items-center justify-between text-xs font-sans font-semibold text-[#8B1E2D] group-hover:text-[#C2AA6A]">
                <span>Explore Range</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

