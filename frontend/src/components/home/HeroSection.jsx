'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Gem, Award } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-emerald-950 text-ivory-50 overflow-hidden">
      {/* Background Photography with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85"
          alt="Rishi Lal Jewellers Royal Collection"
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-emerald-950/50 to-emerald-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36 flex flex-col justify-center min-h-[75vh]">
        <div className="max-w-2xl space-y-6">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-gold-400/40 text-gold-300 text-xs font-sans tracking-[0.2em] uppercase backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>The Royal Heritage Edition 2026</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-ivory-50">
            Timeless Elegance. <br />
            <span className="italic font-light text-gold-300">Crafted for You.</span>
          </h1>

          {/* Subtext */}
          <p className="font-sans text-sm sm:text-base text-ivory-200/85 font-light leading-relaxed max-w-xl">
            Immerse yourself in authentic Indian haute joaillerie. Handcrafted in 22KT hallmarked gold
            and rare certified natural solitaires, created to be treasured across generations.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/products"
              className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-emerald-950 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-300 shadow-gold-glow flex items-center justify-center gap-2 group"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/categories/bridal"
              className="px-8 py-4 bg-transparent hover:bg-emerald-900/60 text-ivory-50 border border-gold-400/60 hover:border-gold-300 text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
            >
              <span>Bridal Heirlooms</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Highlights Strip */}
      <div className="relative z-10 border-t border-gold-400/25 bg-emerald-900/70 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-gold-200/90 tracking-wider">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>100% BIS Hallmarked 22KT Gold</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Gem className="w-4 h-4 text-gold-400 shrink-0" />
            <span>IGI & GIA Certified Natural Diamonds</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Award className="w-4 h-4 text-gold-400 shrink-0" />
            <span>Transparent Making Charges</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Complimentary Armored Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}

