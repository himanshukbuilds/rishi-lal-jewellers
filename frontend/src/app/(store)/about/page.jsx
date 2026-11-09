'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Gem, Hammer, Sparkles, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

export default function AboutPage() {
  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-emerald-950 text-ivory-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold">
            Our Heritage & Karigari
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ivory-50">
            The Rishi Lal Legacy
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
          <p className="font-sans text-xs sm:text-sm text-ivory-200/85 mt-4 leading-relaxed">
            Born from an enduring reverence for India’s royal jewelry traditions and modern aesthetic purity,
            Rishi Lal Jewellers curates heirlooms of sovereign beauty.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-gold-300 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80"
              alt="Rishi Lal Karigar Artistry"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 font-sans text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            <span className="text-gold-700 font-bold uppercase tracking-widest text-xs block">
              The Genesis
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
              Where Ancient Karigari Meets Contemporary Design
            </h2>
            <p>
              In royal Indian history, jewelry was never merely ornamental; it was an embodiment of sacred ceremonies, family honor, and architectural symmetry.
            </p>
            <p>
              At Rishi Lal Jewellers, our master karigars carry forward ancestral methods: Tanjore die-casting, Jaipur meenakari kilning, and micro-claw diamond setting. Every creation begins with certified pure gold, alloyed to perfection and certified under the Bureau of Indian Standards HUID framework.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gold-200">
          <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-900" />
            <h3 className="font-serif text-base font-semibold text-emerald-950">100% Purity Guarantee</h3>
            <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
              Every creation is stamped with BIS Hallmarking and 6-digit alphanumeric HUID traceability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-2">
            <Gem className="w-6 h-6 text-emerald-900" />
            <h3 className="font-serif text-base font-semibold text-emerald-950">Conflict-Free Solitaires</h3>
            <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
              Internationally certified natural diamonds meeting IGI and GIA cut, color, and clarity benchmarks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-2">
            <Hammer className="w-6 h-6 text-emerald-900" />
            <h3 className="font-serif text-base font-semibold text-emerald-950">Bespoke Atelier Service</h3>
            <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
              Personalized wedding trousseau consultations with our master gemologists at our boutique in Baharagora, Jharkhand.
            </p>
          </div>
        </div>

        {/* Boutique Visit Card */}
        <div className="bg-white p-8 rounded-sm border border-gold-300 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-gold-700 font-bold uppercase tracking-widest text-[11px] block mb-1">
                Experience Our Creations
              </span>
              <h3 className="font-serif text-2xl text-emerald-950 font-normal">
                Visit Rishi Lal Jewellers
              </h3>
              <p className="text-xs text-charcoal-600 font-sans mt-2 leading-relaxed">
                We warmly welcome you to experience our bridal jewellery and gold collections in person. Our knowledgeable advisors are ready to assist you in selecting timeless family heirlooms.
              </p>
              <div className="mt-4 space-y-2 text-xs font-sans text-charcoal-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                  <a
                    href={BRAND_CONFIG.flagshipStore.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8B1E2D] transition-colors leading-relaxed underline underline-offset-2"
                  >
                    {BRAND_CONFIG.flagshipStore.formattedAddress}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold-700 shrink-0" />
                  <span>
                    Call:{' '}
                    <a
                      href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                      className="font-medium text-emerald-950 hover:text-[#8B1E2D] underline underline-offset-2"
                    >
                      {BRAND_CONFIG.contact.phone}
                    </a>
                    {' / '}
                    <a
                      href={`tel:${BRAND_CONFIG.contact.phoneSecondaryRaw}`}
                      className="font-medium text-emerald-950 hover:text-[#8B1E2D] underline underline-offset-2"
                    >
                      {BRAND_CONFIG.contact.phoneSecondary}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold-700 shrink-0" />
                  <a
                    href={`mailto:${BRAND_CONFIG.contact.email}`}
                    className="hover:text-[#8B1E2D] underline underline-offset-2"
                  >
                    {BRAND_CONFIG.contact.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <a
                href={BRAND_CONFIG.flagshipStore.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-wider font-semibold rounded-sm text-center transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-gold-300" />
                <span>Google Maps Location</span>
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 border border-emerald-950 text-emerald-950 hover:bg-emerald-950 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-sm text-center transition-colors"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

