'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Gem,
  Award,
  Crown,
  Heart,
  Share2,
} from 'lucide-react';

const CEREMONY_POLAROIDS = [
  {
    label: 'Haldi Ritual',
    image: '/images/wedding/jewellery-sets/traditional-rajasthani-bridal-set.png',
    rotation: '-rotate-2',
    desc: 'Pure gold tokens & auspicious floral yellow',
  },
  {
    label: 'Royal Mehendi',
    image: '/images/wedding/bangles/traditional-meenakari-bangles.png',
    rotation: 'rotate-1',
    desc: 'Enamelled meenakari bangles & intricate hathphool',
  },
  {
    label: 'The Royal Phera',
    image: '/images/wedding/necklaces/polki-bridal-choker-necklace.png',
    rotation: '-rotate-1',
    desc: 'Uncut syndicate polki choker with emerald droplets',
  },
  {
    label: 'Grand Reception',
    image: '/images/wedding/jewellery-sets/grand-polki-wedding-jewellery-set.png',
    rotation: 'rotate-2',
    desc: 'Imperial Aad collar & matching chandelier jhumkis',
  },
];

const HEIRLOOM_HIGHLIGHTS = [
  {
    title: 'Rajputana Kundan Choker',
    metal: '22KT Hallmarked Gold',
    stones: 'Uncut Syndicate Polki & Zambian Emeralds',
    desc: 'Hand-set by master karigars with pure 24KT gold foil foil-backing for unparalleled brilliance.',
  },
  {
    title: 'Heritage Borla & Matha Patti',
    metal: '22KT Yellow Gold',
    stones: 'Basra Pearls & Ruby Centerpiece',
    desc: 'The quintessential symbol of Rajput royalty, gracefully framing the forehead with auspicious motifs.',
  },
  {
    title: 'Imperial Meenakari Kada Suite',
    metal: '22KT Solid Gold Enamelled',
    stones: 'South Sea Pearls & Polki Diamonds',
    desc: 'Reverse meenakari floral motifs crafted using centuries-old Jaipur enamelling traditions.',
  },
  {
    title: 'Traditional Polki Hathphool',
    metal: '22KT Gold Wire Filigree',
    stones: 'Natural Uncut Polki Diamonds',
    desc: 'Graceful floral medallions cascading across the hands with delicate pearl chains.',
  },
];

const CATEGORIES = [
  { id: 'all', title: 'All Rajasthani Heirlooms' },
  { id: 'necklaces', title: 'Bridal Gold Necklaces' },
  { id: 'earrings', title: 'Wedding Earrings' },
  { id: 'bangles', title: 'Bridal Bangles' },
  { id: 'rings', title: 'Wedding Rings' },
  { id: 'maang-tikka', title: 'Maang Tikka' },
  { id: 'jewellery-sets', title: 'Bridal Jewellery Sets' },
];

export default function RajasthaniBridePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from backend
  const { data, isLoading } = useQuery({
    queryKey: ['rajasthani-bridal-products'],
    queryFn: () => api.getProducts({ categorySlug: 'bridal', limit: 100, sort: 'newest' }),
  });

  const allProducts = data?.products || [];

  // Filter products relevant to Rajasthani royal bridal collection
  const filteredProducts = React.useMemo(() => {
    let list = allProducts;

    if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
      if (catObj) {
        list = list.filter((p) => p.subcategory === catObj.title || p.categorySlug === selectedCategory);
      }
    }

    // Match keywords: kundan, polki, aad, borla, choker, rajasthani, bridal
    const keywords = ['kundan', 'polki', 'aad', 'borla', 'choker', 'rajasthani', 'bridal', 'royal'];
    const matched = list.filter((p) => {
      const text = `${p.name} ${p.description || ''} ${(p.tags || []).join(' ')} ${p.subcategory || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    if (matched.length >= 6) return matched;
    const others = list.filter((p) => !matched.some((m) => m._id === p._id));
    return [...matched, ...others];
  }, [allProducts, selectedCategory]);

  return (
    <main className="w-full min-h-screen bg-[#FAF7F2] text-[#3B0712] selection:bg-[#C2AA6A] selection:text-[#3B0712] overflow-x-hidden animate-book-open">
      {/* ═══════════════════════════════════════════════════════════════════
          TOP BREADCRUMB & BACK TO WEDDING ALBUM NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#F4EDE2] border-b border-[#C2AA6A]/30 py-3 sm:py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
          <Link
            href="/wedding"
            className="inline-flex items-center gap-2 text-[#540D1D] hover:text-[#8B1E2D] font-sans font-medium tracking-wide transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#C2AA6A]" />
            <span>Return to Wedding Album</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-sans text-[#7A6355] uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-[#C2AA6A]" />
            <span>Royal Rajputana Heritage</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO BANNER: EXACT ATTACHED RAJASTHANI BRIDE IMAGE
          Preserving 100% original quality, sharpness, colors & proportions
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-4 sm:pt-6 pb-8 sm:pb-12 px-2 sm:px-6 md:px-8 max-w-[1560px] mx-auto">
        {/* Ornate Gold Bordered Luxury Frame */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#240307] border-2 border-[#C2AA6A]/40"
          style={{
            boxShadow:
              '0 30px 80px -20px rgba(50,10,20,0.4), 0 12px 30px -8px rgba(194,170,106,0.3)',
          }}
        >
          {/* Subtle Corner Filigree Ornaments */}
          <div className="absolute inset-2 sm:inset-3 pointer-events-none border border-[#C2AA6A]/30 rounded-xl z-20">
            <span className="absolute -top-1.5 -left-1.5 text-xs text-[#C2AA6A]">✦</span>
            <span className="absolute -top-1.5 -right-1.5 text-xs text-[#C2AA6A]">✦</span>
            <span className="absolute -bottom-1.5 -left-1.5 text-xs text-[#C2AA6A]">✦</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-xs text-[#C2AA6A]">✦</span>
          </div>

          {/* Exact Attached Image in Original 16:9 Aspect Ratio */}
          <div className="relative w-full aspect-[728/410] sm:aspect-[16/9] min-h-[260px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[660px]">
            <SafeImage
              src="/images/wedding/rajasthani_bride_banner.png"
              alt="Rajasthani Bride - Royal Grandeur & Heritage Polki by Rishi Lal Jewellers"
              fill
              priority
              quality={85}
              sizes="(max-width: 1560px) 100vw, 1560px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION: RAJPUTANA BRIDAL STORY & HEIRLOOM NARRATIVE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C2AA6A]/50 text-[#540D1D] text-xs font-sans tracking-[0.22em] uppercase font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
          <span>The Royal Rajputana Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#540D1D] tracking-tight">
          Royal Grandeur & Heritage Polki
        </h1>
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="w-12 h-px bg-[#C2AA6A]/60" />
          <span className="text-[#C2AA6A] text-sm">✦</span>
          <span className="w-12 h-px bg-[#C2AA6A]/60" />
        </div>
        <p className="font-serif italic text-base sm:text-lg lg:text-xl text-[#7A6355] max-w-3xl mx-auto leading-relaxed">
          Inspired by the timeless palaces of Jaipur, Udaipur, and Jodhpur. Hand-forged in 22KT hallmarked gold with certified uncut syndicate polki diamonds, natural Zambian emerald drops, and royal Jaipuri meenakari enamelling.
        </p>

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-[#C2AA6A]/25">
          <div className="p-3 bg-white/70 rounded-lg border border-[#D8C7B0]/60 text-center">
            <ShieldCheck className="w-5 h-5 text-[#C2AA6A] mx-auto mb-1" />
            <p className="text-xs font-semibold text-[#540D1D]">100% BIS Hallmarked</p>
            <p className="text-[10px] text-[#7A6355]">22KT Yellow Gold</p>
          </div>
          <div className="p-3 bg-white/70 rounded-lg border border-[#D8C7B0]/60 text-center">
            <Gem className="w-5 h-5 text-[#C2AA6A] mx-auto mb-1" />
            <p className="text-xs font-semibold text-[#540D1D]">Syndicate Polki</p>
            <p className="text-[10px] text-[#7A6355]">Uncut Natural Diamonds</p>
          </div>
          <div className="p-3 bg-white/70 rounded-lg border border-[#D8C7B0]/60 text-center">
            <Award className="w-5 h-5 text-[#C2AA6A] mx-auto mb-1" />
            <p className="text-xs font-semibold text-[#540D1D]">Heritage Meenakari</p>
            <p className="text-[10px] text-[#7A6355]">Master Artisans of Jaipur</p>
          </div>
          <div className="p-3 bg-white/70 rounded-lg border border-[#D8C7B0]/60 text-center">
            <Crown className="w-5 h-5 text-[#C2AA6A] mx-auto mb-1" />
            <p className="text-xs font-semibold text-[#540D1D]">Heirloom Assurance</p>
            <p className="text-[10px] text-[#7A6355]">Lifetime Authenticity</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION: CEREMONIAL POLAROIDS & KEY HEIRLOOMS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 bg-[#F5EFE4] border-y border-[#C2AA6A]/30 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#540D1D]">
              Ceremonial Jewellery Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6355] mt-1 font-serif italic">
              From the sacred Haldi rituals to the royal Phera vows
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CEREMONY_POLAROIDS.map((pol, idx) => (
              <div
                key={idx}
                className={`
                  relative bg-white p-3 sm:p-4 pb-4 sm:pb-5 rounded-xs shadow-md
                  border border-[#D8C7B0] hover:shadow-xl transition-all duration-300
                  hover:-translate-y-2 hover:rotate-0 cursor-default
                  ${pol.rotation}
                `}
              >
                {/* Gold Push Pin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C2AA6A] border border-white shadow-xs" />

                <div className="relative aspect-[4/5] w-full rounded-xs overflow-hidden bg-[#FAF6EE] mb-3">
                  <SafeImage
                    src={pol.image}
                    alt={pol.label}
                    fill
                    sizes="(max-width: 768px) 45vw, 22vw"
                    className="object-cover object-center"
                  />
                </div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#540D1D] text-center">
                  {pol.label}
                </h3>
                <p className="text-[11px] text-[#7A6355] text-center font-sans mt-0.5">
                  {pol.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Masterpiece Highlights Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {HEIRLOOM_HIGHLIGHTS.map((hl, idx) => (
              <div
                key={idx}
                className="bg-white/80 p-5 rounded-xl border border-[#C2AA6A]/40 shadow-xs hover:border-[#8B1E2D] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C2AA6A]/60 flex items-center justify-center text-[#540D1D] font-serif font-bold text-xs mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-serif text-base font-semibold text-[#540D1D]">{hl.title}</h4>
                <p className="text-[11px] font-sans font-medium text-[#C2AA6A] uppercase tracking-wider mt-0.5">
                  {hl.metal}
                </p>
                <p className="text-xs text-[#8B1E2D] font-serif italic mt-1">{hl.stones}</p>
                <p className="text-xs text-[#7A6355] font-sans mt-2 leading-relaxed">{hl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION: CURATED RAJASTHANI BRIDAL JEWELLERY CATALOGUE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C2AA6A]/40 text-[#540D1D] text-xs uppercase font-sans tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
            <span>Curated Bridal Catalogue</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3B0712] tracking-tight">
            Rajasthani Bridal Heirlooms
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-sans text-[#735C4A]">
            Discover hand-finished 22KT gold Kundan choker sets, Aad collars, borla maang tikkas, and bridal kadas.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-[#D8C7B0]/60 shadow-sm max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-5 py-2.5 rounded-full text-xs font-sans tracking-wider transition-all whitespace-nowrap cursor-pointer
                    ${
                      isSelected
                        ? 'bg-[#540D1D] text-white font-semibold shadow-xs'
                        : 'text-[#574438] hover:text-[#540D1D] hover:bg-[#FAF6EE]'
                    }
                  `}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count & Status */}
        <div className="mb-6 flex items-center justify-between text-xs sm:text-sm font-sans text-[#735C4A] border-b border-[#D8C7B0]/40 pb-3">
          <span>
            Showing <strong className="text-[#3B0712]">{filteredProducts.length}</strong> heirloom designs for{' '}
            <span className="text-[#540D1D] font-serif font-medium">Rajasthani Bride</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#C2AA6A] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% BIS Hallmarked 22KT Gold</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/70 animate-pulse rounded-lg border border-[#D8C7B0]/40" />
            ))}
          </div>
        )}

        {/* Real Product Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-[#D8C7B0] max-w-lg mx-auto">
            <Gem className="w-10 h-10 text-[#C2AA6A] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#3B0712]">No designs in this category</h3>
            <p className="mt-1.5 text-xs text-[#735C4A]">
              Try selecting &quot;All Rajasthani Heirlooms&quot; to view our complete collection.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#540D1D] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Show All Heirlooms
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CSS ANIMATION: BOOK-PAGE OPENING TRANSITION
      ═══════════════════════════════════════════════════════════════════ */}
      <style jsx>{`
        @keyframes bookOpen {
          0% {
            opacity: 0;
            transform: scale(0.97) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-book-open {
          animation: bookOpen 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-book-open {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}

