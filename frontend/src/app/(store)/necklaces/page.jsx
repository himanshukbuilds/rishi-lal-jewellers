'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ShieldCheck,
  Gem,
  Award,
  Truck,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function NecklacesLandingPage() {
  const [sort, setSort] = useState('newest');
  const [activeSubFilter, setActiveSubFilter] = useState('all');

  // Query real necklace products from API (with robust offline fallback data)
  const { data, isLoading } = useQuery({
    queryKey: ['necklaces-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'necklaces',
        sort,
        limit: 24,
      }),
  });

  const rawProducts = data?.products || [];

  // Match the featured necklace hotspot with real database product
  const featuredNecklace = useMemo(() => {
    // Prefer the real pearl choker, emerald haar, or first necklace product in database
    return (
      rawProducts.find((p) => /pearl|choker|zubeda/i.test(p.name || '')) ||
      rawProducts[0] || {
        name: 'PEARL NECKLACE',
        slug: 'basra-heritage-natural-pearl-diamond-choker',
        price: 93500,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'],
      }
    );
  }, [rawProducts]);

  // Sub-filter tabs for the collection section
  const filteredProducts = useMemo(() => {
    if (!rawProducts.length) return [];
    if (activeSubFilter === 'all') return rawProducts;
    if (activeSubFilter === 'chokers') {
      return rawProducts.filter(
        (p) =>
          /choker|haar|kundan|polki/i.test(p.name || '') ||
          (p.tags && p.tags.some((t) => ['choker', 'haar', 'kundan', 'bridal'].includes(t.toLowerCase())))
      );
    }
    if (activeSubFilter === 'diamond') {
      return rawProducts.filter(
        (p) =>
          /diamond|mangalsutra|solitaire|pendant/i.test(p.name || '') ||
          (p.tags && p.tags.some((t) => ['diamond', 'mangalsutra', 'pendant'].includes(t.toLowerCase())))
      );
    }
    if (activeSubFilter === 'gold') {
      return rawProducts.filter(
        (p) =>
          /gold|temple|lakshmi|22k/i.test(p.name || '') ||
          /gold/i.test(p.metal || '') ||
          (p.tags && p.tags.some((t) => ['gold', 'temple', 'traditional'].includes(t.toLowerCase())))
      );
    }
    return rawProducts;
  }, [rawProducts, activeSubFilter]);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2A1810]">
      {/* =========================================================================
          HERO SECTION (Recreating Exact Reference Layout, Typography & Artwork)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#D4BDA3] min-h-[580px] lg:min-h-[640px] xl:min-h-[690px] flex items-center border-b border-[#C7B096]">
        {/* Subtle ambient lighting on studio wall */}
        <div className="absolute inset-0 bg-radial from-[#DFCEBF]/60 via-[#D4BDA3]/90 to-[#CAA88E] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* -------------------------------------------------------------------
                LEFT COLUMN: 8k Customers, Serif Heading, Supporting Text, CTA
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center order-2 lg:order-1 pt-4 lg:pt-0">
              {/* 8k CUSTOMERS Social Proof Badge matching reference */}
              <div className="inline-flex items-center gap-3 w-fit mb-4 sm:mb-6">
                {/* 3 Circular Patron Avatars */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="relative inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#D4BDA3] overflow-hidden bg-[#E2D5C3]">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Patron 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#D4BDA3] overflow-hidden bg-[#D8C7B0]">
                    <Image
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Patron 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-[#D4BDA3] overflow-hidden bg-[#CDB79E]">
                    <Image
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                      alt="Patron 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 8k CUSTOMERS Box */}
                <div className="bg-[#DFCEBF]/80 backdrop-blur-xs border border-[#C6B09B] rounded-sm px-2.5 py-1 flex flex-col leading-tight">
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#4A3525]">
                    8k
                  </span>
                  <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-[#7D6654] font-semibold -mt-0.5">
                    Customers
                  </span>
                </div>
              </div>

              {/* Main Heading: Timeless Just Like You */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.5rem] leading-[0.96] tracking-tight text-[#4A3525]">
                <span className="block">Timeless</span>
                <span className="block mt-1 sm:mt-2">Just Like You</span>
              </h1>

              {/* Supporting Copy */}
              <p className="font-sans text-xs sm:text-sm lg:text-[14px] text-[#634E41] leading-relaxed max-w-md mt-6 sm:mt-8">
                Each piece at Rishi Lal Jewellers begins as a sketch and ends, months later, as
                something you&apos;ll hand down rather than replace. No two settings leave our bench
                identical.
              </p>

              {/* Primary Terracotta Pill Button */}
              <div className="mt-8 sm:mt-10">
                <button
                  onClick={scrollToCollection}
                  className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full bg-[#BA724F] hover:bg-[#A66240] text-white text-xs sm:text-sm font-sans font-medium tracking-wide transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <span>Shop Necklaces</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT COLUMN: Model Artwork with Interactive Hotspots
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-6 relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] lg:max-w-[540px]">
                {/* Model Artwork Image */}
                <div className="relative aspect-[514/530] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#D4BDA3]">
                  <Image
                    src="/images/necklaces/model-clean.png"
                    alt="Rishi Lal Jewellers — Timeless Necklaces"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />

                  {/* Hotspot 1: Earring Glass Capsule */}
                  <div
                    style={{ top: '35%', left: '20%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <div className="w-9 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex flex-col items-center pt-1 shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer">
                      <span className="w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold">
                        +
                      </span>
                    </div>
                  </div>

                  {/* Hotspot 2: Ring Glass Capsule */}
                  <div
                    style={{ top: '60%', left: '68%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <div className="w-8 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex flex-col items-center pt-1 shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer">
                      <span className="w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold">
                        +
                      </span>
                    </div>
                  </div>

                  {/* Hotspot 3: Floating Necklace Product Card (Matching Reference Card) */}
                  <div
                    style={{ bottom: '6%', left: '24%' }}
                    className="absolute z-30"
                  >
                    <Link
                      href={`/products/${featuredNecklace.slug || featuredNecklace._id}`}
                      className="block bg-[#DDE3DE] hover:bg-[#D5DCD6] p-2.5 sm:p-3 rounded-lg shadow-xl border border-black/5 transition-transform duration-300 hover:scale-105 text-center w-28 sm:w-32 group"
                    >
                      {/* Product Thumbnail with + badge */}
                      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[#FAF7F2] mb-1.5">
                        <Image
                          src={
                            (featuredNecklace.images && featuredNecklace.images[0]) ||
                            featuredNecklace.image ||
                            '/images/placeholder.jpg'
                          }
                          alt={featuredNecklace.name}
                          fill
                          sizes="120px"
                          className="object-contain p-1"
                        />
                        {/* + Badge in top right corner */}
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[9px] font-bold">
                          +
                        </span>
                      </div>

                      {/* Product Name */}
                      <p className="font-serif text-[10px] sm:text-[11px] font-semibold text-[#2D2A26] uppercase tracking-wider truncate">
                        {featuredNecklace.name.length > 18
                          ? 'Pearl Necklace'
                          : featuredNecklace.name}
                      </p>

                      {/* Real Price */}
                      <p className="font-serif text-[10px] sm:text-[11px] text-[#4A3525] font-bold mt-0.5">
                        {formatPrice(featuredNecklace.price)}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRODUCT COLLECTION SECTION (#collection)
         ========================================================================= */}
      <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-widest font-sans font-semibold text-[#BA724F] mb-2">
            Rishi Lal Masterpieces
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#4A3525]">
            The Royal Necklace Atelier
          </h2>
          <div className="w-16 h-0.5 bg-[#BA724F] mx-auto mt-4 mb-4" />
          <p className="font-sans text-xs sm:text-sm text-[#716D64] leading-relaxed">
            From imperial seven-strand emerald haars and syndicate polki chokers to delicate everyday
            diamond mangalsutras, each creation is sculpted in pure hallmarked gold.
          </p>
        </div>

        {/* Filter Tabs & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DFD3]">
          {/* Sub-filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Necklaces' },
              { id: 'chokers', label: 'Royal Haars & Chokers' },
              { id: 'diamond', label: 'Diamonds & Contemporary' },
              { id: 'gold', label: '22KT Temple Gold' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubFilter(tab.id)}
                className={`px-4 py-2 text-xs font-sans font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  activeSubFilter === tab.id
                    ? 'bg-[#4A3525] text-white shadow-xs'
                    : 'bg-white border border-[#E6DFD3] text-[#635B50] hover:border-[#BA724F] hover:text-[#4A3525]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Count & Sort Selector */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="font-sans text-xs text-[#716D64]">
              Showing <span className="font-bold text-[#4A3525]">{filteredProducts.length}</span> creations
            </span>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-[#D6CBB8] text-xs text-[#4A3525] py-2 pl-3.5 pr-8 rounded-md focus:outline-none focus:border-[#BA724F] font-sans cursor-pointer shadow-xs"
              >
                <option value="newest">Newest Additions</option>
                <option value="bestseller">Bestselling First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6A53] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white rounded-sm aspect-[3/4] border border-[#E6DFD3]"
              />
            ))}
          </div>
        )}

        {/* Real Product Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg border border-[#E6DFD3] p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <p className="font-serif text-lg text-[#4A3525] mb-2">
              No creations currently match this filter.
            </p>
            <p className="font-sans text-xs text-[#716D64] mb-5">
              Reset the filter to view the complete necklace atelier catalog.
            </p>
            <button
              onClick={() => setActiveSubFilter('all')}
              className="inline-block px-6 py-2.5 bg-[#4A3525] text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-[#BA724F] transition-colors"
            >
              View All Necklaces
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          HERITAGE ATELIER PILLARS (Luxury Trust & Guarantee Bar)
         ========================================================================= */}
      <section className="bg-[#EFEAE2] border-t border-[#E2DBD1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white border border-[#D6CBB8] text-[#BA724F] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#BA724F]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#4A3525]">
                  100% BIS Hallmarked
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Every gram of gold is certified with a 6-digit laser HUID hallmark for unquestioned purity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white border border-[#D6CBB8] text-[#BA724F] shrink-0">
                <Gem className="w-5 h-5 text-[#BA724F]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#4A3525]">
                  IGI & GIA Diamonds
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Conflict-free natural solitaires and polki diamonds with international certification cards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white border border-[#D6CBB8] text-[#BA724F] shrink-0">
                <Award className="w-5 h-5 text-[#BA724F]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#4A3525]">
                  Lifetime Buyback
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Transparent gold buyback and exchange guarantee across all Rishi Lal Jewellers ateliers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-white border border-[#D6CBB8] text-[#BA724F] shrink-0">
                <Truck className="w-5 h-5 text-[#BA724F]" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#4A3525]">
                  Insured Delivery
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Complimentary, fully insured doorstep transit across India in our signature tamper-evident casket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
