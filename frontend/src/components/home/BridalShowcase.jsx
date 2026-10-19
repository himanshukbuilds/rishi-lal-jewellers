'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Calendar, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function BridalShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-[#4A0B13] text-[#F8F5EF] relative overflow-hidden">
      {/* Decorative filigree glow with dusty rose & crimson */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DEB1A8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B1E2D]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Imagery Grid */}
          <div className="relative">
            <div className="relative aspect-[4/5] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] w-full rounded-sm overflow-hidden border border-[#C2AA6A]/40 shadow-2xl bg-[#4A0B13]">
              <Image
                src="/images/categories/bridal.jpg"
                alt="Rishi Lal Royal Bridal Suite"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A0B13]/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Luxury Detail Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-white text-[#4A0B13] p-5 rounded-sm shadow-xl border border-[#DEB1A8]/60 max-w-xs hidden sm:block animate-fade-in">
              <div className="flex items-center gap-2 text-[#8B1E2D] font-sans text-xs uppercase tracking-widest font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#DEB1A8]" />
                <span>The Padmavati Trousseau</span>
              </div>
              <p className="font-serif text-sm font-semibold text-[#4A0B13]">
                180+ hours of hand-engraving in solid 22KT gold & syndicate polki.
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B1E2D] border border-[#DEB1A8]/40 text-[#FAF2F0] text-xs font-sans tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#DEB1A8]" />
              <span>Haute Joaillerie Mariage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.15]">
              The Royal Bridal <br />
              <span className="italic font-light text-[#DEB1A8]">Pavilion of Heirlooms</span>
            </h2>

            <p className="font-sans text-sm text-[#F8F5EF]/85 leading-relaxed">
              Every Indian wedding is an epic of eternal promise. Our bridal suites unite the grand traditions
              of Jaipur jadau, Tanjore temple casting, and Belgian-cut diamond collars.
              Designed not merely for the wedding day, but to be passed down as treasured family heirlooms.
            </p>

            {/* Feature Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-sans text-[#F8F5EF]/90">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA6A] mt-1.5 shrink-0" />
                <span>Custom bridal consultations with our master jewelry curators</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA6A] mt-1.5 shrink-0" />
                <span>Government-verified HUID Hallmark on every bridal necklace</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA6A] mt-1.5 shrink-0" />
                <span>Bespoke trousseau caskets in royal crimson velvet & brass hardware</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA6A] mt-1.5 shrink-0" />
                <span>Full buyback & exchange valuation on all gold and solitaires</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/categories/bridal"
                className="px-8 py-3.5 bg-[#C2AA6A] hover:bg-[#D8C596] text-[#4A0B13] text-xs uppercase tracking-[0.2em] font-bold rounded-sm transition-colors flex items-center justify-center gap-2 group shadow-gold-glow"
              >
                <span>Explore Bridal Sets</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#8B1E2D]/80 hover:bg-[#8B1E2D] text-white border border-[#C2AA6A]/40 text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#C2AA6A]" />
                <span>Book Atelier Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

