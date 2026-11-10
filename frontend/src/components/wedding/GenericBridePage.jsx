'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Sparkles, ShieldCheck, Gem, Crown } from 'lucide-react';

/**
 * GenericBridePage – reusable full-screen bridal collection page
 * Used for Marathi, Bengali, Telugu, Tamil and Metro brides
 */
export default function GenericBridePage({ config }) {
  const {
    id,
    title,
    shortTitle,
    tagline,
    bannerImage,
    imagePosition = 'center 20%',
    cardImage,
    description,
    keywords,
    accentColor = '#8B1E2D',
    highlights = [],
    ceremonies = [],
  } = config;

  const { data, isLoading } = useQuery({
    queryKey: ['bride-products', id],
    queryFn: () => api.getProducts({ categorySlug: 'bridal', limit: 60, sort: 'newest' }),
  });

  const allProducts = data?.products || [];

  // Filter products by keyword relevance
  const products = React.useMemo(() => {
    const matched = allProducts.filter((p) => {
      const text = `${p.name} ${p.description || ''} ${(p.tags || []).join(' ')} ${p.subcategory || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });
    if (matched.length >= 4) return matched;
    return [...matched, ...allProducts.filter((p) => !matched.some((m) => m._id === p._id))].slice(0, 24);
  }, [allProducts, keywords]);

  return (
    <main className="w-full min-h-screen bg-[#FBF8F2] text-[#3B0712] overflow-x-hidden">
      {/* ── HERO BANNER ── */}
      <section className="relative w-full overflow-hidden">
        {/* Back Navigation */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-30">
          <Link
            href="/wedding"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#C2AA6A]/60 text-[#F8F5EF] text-[10px] sm:text-xs font-sans tracking-widest uppercase hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Wedding Collection</span>
          </Link>
        </div>

        {/* Main Banner Image */}
        <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '380px', maxHeight: '720px' }}>
          <SafeImage
            src={bannerImage}
            alt={`${title} – Rishi Lal Jewellers`}
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover transition-transform duration-700"
            style={{ objectPosition: imagePosition }}
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Text Overlay */}
          <div className="absolute bottom-10 sm:bottom-16 left-6 sm:left-14 z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-[#C2AA6A]/50 text-[#C2AA6A] text-[10px] uppercase tracking-widest font-sans mb-3">
              <Crown className="w-3 h-3" />
              <span>Rishi Lal Jewellers · The Wedding Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-normal text-white leading-tight drop-shadow-2xl">
              {title}
            </h1>
            <p className="mt-3 font-serif italic text-sm sm:text-base text-[#F8F5EF]/90 drop-shadow-lg">
              {tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO DESCRIPTION ── */}
      <section className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C2AA6A]/40 text-[#540D1D] text-xs uppercase font-sans tracking-widest mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
          <span>Heritage Jewellery Collection</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#3B0712] tracking-tight mb-4">
          {shortTitle} Bridal Heirlooms
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#735C4A] leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </section>

      {/* ── SIGNATURE HIGHLIGHTS ── */}
      {highlights.length > 0 && (
        <section className="py-10 sm:py-14 bg-[#F4EDE0]/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#3B0712]">Signature Heirlooms</h3>
              <div className="mt-2 mx-auto w-16 h-px bg-[#C2AA6A]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D8C7B0]/50 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF4EC] border border-[#C2AA6A]/40 flex items-center justify-center flex-shrink-0">
                      <Gem className="w-4 h-4 text-[#C2AA6A]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-semibold text-[#540D1D]">{h.title}</h4>
                      <p className="text-[11px] text-[#C2AA6A] font-sans font-medium mt-0.5">{h.metal}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#735C4A] font-sans leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BADGES ── */}
      <section className="py-8 sm:py-10 border-y border-[#D8C7B0]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { icon: ShieldCheck, label: 'BIS Hallmarked', sub: '22KT Certified Gold' },
              { icon: Gem, label: 'Expert Crafted', sub: 'Handmade Heirlooms' },
              { icon: Crown, label: 'Premium Quality', sub: 'Luxury Standards' },
              { icon: Sparkles, label: 'Lifetime Polish', sub: 'Free Maintenance' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#FAF4EC] border border-[#C2AA6A]/40 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C2AA6A]" />
                </div>
                <p className="font-sans text-xs font-semibold text-[#540D1D]">{label}</p>
                <p className="font-sans text-[11px] text-[#735C4A]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C2AA6A]/40 text-[#540D1D] text-xs uppercase font-sans tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
            <span>Bridal Jewellery Collection</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#3B0712] tracking-tight">
            Shop {title} Jewellery
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#F0E9DD] animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Gem className="w-12 h-12 text-[#C2AA6A]/60 mx-auto mb-4" />
            <p className="font-serif text-lg text-[#735C4A] mb-2">New Collection Coming Soon</p>
            <p className="font-sans text-sm text-[#A08C7C] mb-6">
              Our {title} collection is being curated. Visit our store for exclusive designs.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#540D1D] text-white text-sm font-sans tracking-wider hover:bg-[#8B1E2D] transition-colors"
            >
              Browse All Jewellery
            </Link>
          </div>
        )}
      </section>

      {/* ── BACK TO WEDDING ── */}
      <section className="py-10 sm:py-14 text-center border-t border-[#D8C7B0]/40">
        <Link
          href="/wedding"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full border-2 border-[#8B1E2D] text-[#540D1D] font-sans text-sm tracking-widest uppercase font-semibold hover:bg-[#8B1E2D] hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Bridal Collections
        </Link>
      </section>
    </main>
  );
}
