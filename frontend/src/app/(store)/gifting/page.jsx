'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import {
  Gift,
  Heart,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Package,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const GIFT_CATEGORIES = [
  { id: 'all', name: 'All Gifts', image: '/images/gifting/categories/gift-sets.jpg', count: 30 },
  { id: 'Pendants', name: 'Pendants', image: '/images/gifting/categories/pendants.jpg', count: 5 },
  { id: 'Earrings', name: 'Earrings', image: '/images/gifting/categories/earrings.jpg', count: 5 },
  { id: 'Bracelets', name: 'Bracelets', image: '/images/gifting/categories/bracelets.jpg', count: 4 },
  { id: 'Rings', name: 'Rings', image: '/images/gifting/categories/rings.jpg', count: 4 },
  { id: 'Chains', name: 'Chains', image: '/images/gifting/categories/chains.jpg', count: 3 },
  { id: 'Anklets', name: 'Anklets', image: '/images/gifting/categories/anklets.jpg', count: 3 },
  { id: 'Silver Gifts', name: 'Silver Gifts', image: '/images/gifting/categories/silver-gifts.jpg', count: 3 },
  { id: 'Gift Sets', name: 'Gift Sets', image: '/images/gifting/categories/gift-sets.jpg', count: 3 },
];

const OCCASIONS = [
  { name: 'Birthday Gifts', desc: 'Sparkling treasures for their special day', tag: 'birthday', image: '/images/gifting/earrings/minimal-gold-stud-earrings.jpg' },
  { name: 'Anniversary Gifts', desc: 'Timeless tokens of enduring love', tag: 'anniversary', image: '/images/gifting/pendants/heart-gold-pendant.jpg' },
  { name: 'Wedding Gifts', desc: 'Cherished blessings for lifelong unions', tag: 'wedding', image: '/images/gifting/bracelets/elegant-diamond-tennis-bracelet.jpg' },
  { name: 'Festive Gifts', desc: 'Auspicious pure gold & silver celebrations', tag: 'festive', image: '/images/gifting/pendants/traditional-om-gold-pendant.jpg' },
  { name: "Mother's Day Gifts", desc: 'Luminous pearls and heart-felt appreciation', tag: 'mothers-day', image: '/images/gifting/pendants/pearl-drop-pendant.jpg' },
  { name: 'Special Moments', desc: 'Milestones, achievements & gratitude', tag: 'special-moments', image: '/images/gifting/gift-sets/elegant-diamond-inspired-gift-set.jpg' },
];

const PRICE_TIERS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹2,999', value: 'under-2999', max: 2999 },
  { label: 'Under ₹4,999', value: 'under-4999', max: 4999 },
  { label: 'Under ₹9,999', value: 'under-9999', max: 9999 },
  { label: 'Premium Gifts (₹10,000+)', value: 'premium', min: 10000 },
];

const METALS = [
  { label: 'All Metals', value: 'all' },
  { label: 'Gold', value: 'Gold' },
  { label: 'Diamond', value: 'Diamond' },
  { label: 'Silver', value: 'Silver' },
];

export default function GiftingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [selectedPriceTier, setSelectedPriceTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch Gifting products dynamically from MongoDB backend API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['gifting-collection-products'],
    queryFn: () => api.getProducts({ categorySlug: 'gifting', limit: 60 }),
    staleTime: 60_000,
  });

  const rawProducts = data?.products || [];

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by Subcategory
    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          (p.subcategory || '').toLowerCase() === selectedCategory.toLowerCase() ||
          (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Metal Type
    if (selectedMetal !== 'all') {
      list = list.filter((p) => {
        const text = `${p.metalType || ''} ${p.metal || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
        return text.includes(selectedMetal.toLowerCase());
      });
    }

    // Filter by Price Tier
    if (selectedPriceTier !== 'all') {
      const tier = PRICE_TIERS.find((t) => t.value === selectedPriceTier);
      if (tier) {
        if (tier.max) list = list.filter((p) => Number(p.price) <= tier.max);
        if (tier.min) list = list.filter((p) => Number(p.price) >= tier.min);
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter((p) => {
        const hay = `${p.name} ${p.description} ${p.subcategory} ${p.metal} ${(p.tags || []).join(' ')}`.toLowerCase();
        return hay.includes(query);
      });
    }

    // Sort
    if (sortBy === 'price-low') list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === 'price-high') list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return list;
  }, [rawProducts, selectedCategory, selectedMetal, selectedPriceTier, searchQuery, sortBy]);

  // Handler for category card click
  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const el = document.getElementById('gifting-products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handler for occasion select
  const handleOccasionSelect = (tag) => {
    setSearchQuery(tag);
    setSelectedCategory('all');
    const el = document.getElementById('gifting-products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17382D]">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#766F61]">
          <li>
            <Link href="/" className="transition-colors hover:text-[#7D2934]">Home</Link>
          </li>
          <li><ChevronRight className="h-3 w-3 text-[#A09A8E]" /></li>
          <li className="font-semibold text-[#7D2934]" aria-current="page">Gifting Collection</li>
        </ol>
      </nav>

      {/* LUXURY HERO BANNER */}
      <header className="relative isolate overflow-hidden bg-[#32070C] text-[#FAF7F2]">
        {/* Background Overlay with Silk Texture & Gold Highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5C1D26] via-[#32070C] to-[#1F0407] opacity-95" />
        
        {/* Subtle Decorative Golden Border Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="#C6A15B" strokeWidth="0.15" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E7D19A]">
              <Sparkles className="h-3 w-3 text-[#C6A15B]" />
              <span>Curated Gifting Collection</span>
            </div>

            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#FDFBF7] sm:text-5xl lg:text-6xl">
              MAKE EVERY MOMENT <span className="italic text-[#E7D19A]">PRECIOUS</span>
            </h1>

            <p className="mt-4 max-w-xl font-serif text-base italic leading-relaxed text-[#F2E8D5] sm:text-lg">
              &ldquo;Celebrate life&rsquo;s special moments with jewellery that speaks from the heart.&rdquo;
            </p>

            <p className="mt-3 max-w-lg text-xs leading-relaxed text-[#D2C5B4] sm:text-sm">
              Discover 30 handcrafted treasures in pure 22K gold, certified diamonds, and hallmarked sterling silver. Each creation arrives nestled in our signature luxury presentation box with satin ribbon detailing.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#gifting-products-grid"
                className="inline-flex items-center gap-2 border border-[#C6A15B] bg-[#C6A15B] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#32070C] transition-all hover:bg-[#E7D19A] hover:shadow-lg"
              >
                <span>Explore All 30 Gifts</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#C6A15B]/20 pt-6">
              <div>
                <p className="font-serif text-xl font-bold text-[#E7D19A] sm:text-2xl">30</p>
                <p className="text-[10px] uppercase tracking-wider text-[#D2C5B4]">Individual Gifts</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#E7D19A] sm:text-2xl">8</p>
                <p className="text-[10px] uppercase tracking-wider text-[#D2C5B4]">Gift Categories</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#E7D19A] sm:text-2xl">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#D2C5B4]">Certified Authenticity</p>
              </div>
            </div>
          </div>

          {/* Hero Featured Showcase Box */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-sm border border-[#C6A15B]/40 bg-[#420A10]/90 p-5 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-[#240306]">
                <SafeImage
                  src="/images/gifting/hero/gifting-hero-banner.jpg"
                  alt="Rishi Lal Jewellers signature gifting collection presentation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                  fallbackSrc="/images/categories/bridal.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26050B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E7D19A]">Signature Packaging</p>
                  <p className="font-serif text-sm">Royal Rishi Lal Presentation Box with Hand-Tied Satin Ribbon</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-[#E7D19A]">
                <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Complimentary Gift Wrap</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Insured Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: SHOP BY GIFT CATEGORY (8 Category Cards) */}
      <section className="border-b border-[#E6DFD3] bg-white py-14 sm:py-20" aria-labelledby="shop-by-category-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B8050]">Artisanal Selections</p>
            <h2 id="shop-by-category-heading" className="mt-1 font-serif text-2xl font-normal text-[#17382D] sm:text-4xl">
              Shop by Gift Category
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-[#C6A15B]" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4 xl:gap-6">
            {GIFT_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`group flex flex-col overflow-hidden rounded-sm border text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#9B8050] hover:shadow-lg ${
                  selectedCategory === cat.name ? 'border-[#7D2934] ring-1 ring-[#7D2934]' : 'border-[#E6DFD3] bg-[#FAF7F2]'
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#F2EDE2]">
                  <SafeImage
                    src={cat.image}
                    alt={`${cat.name} gift category`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-108"
                    fallbackSrc="/images/placeholder-jewelry.jpg"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium text-[#7D2934]">
                    {cat.count} Designs
                  </span>
                </div>
                <div className="p-3.5 text-center">
                  <h3 className="font-serif text-sm font-medium text-[#17382D] group-hover:text-[#7D2934] sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#9B8050]">Explore Collection →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOP BY OCCASION (6 Cards) */}
      <section className="bg-[#FAF7F2] py-14 sm:py-20" aria-labelledby="shop-by-occasion-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B8050]">Meaningful Moments</p>
            <h2 id="shop-by-occasion-heading" className="mt-1 font-serif text-2xl font-normal text-[#17382D] sm:text-4xl">
              Shop by Occasion
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-16 bg-[#C6A15B]" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map((occ) => (
              <div
                key={occ.name}
                onClick={() => handleOccasionSelect(occ.tag)}
                className="group relative cursor-pointer overflow-hidden rounded-sm border border-[#E6DFD3] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#9B8050] hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-[#FAF7F2] border border-[#E6DFD3]">
                    <SafeImage
                      src={occ.image}
                      alt={occ.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
                      fallbackSrc="/images/placeholder-jewelry.jpg"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#17382D] group-hover:text-[#7D2934]">
                      {occ.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#766F61] line-clamp-2">{occ.desc}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#9B8050] group-hover:text-[#7D2934]">
                      Shop Gifts <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: QUICK PRICE-BASED COLLECTIONS */}
      <section className="border-y border-[#E6DFD3] bg-[#F4EFE6] py-10" aria-label="Price range filter shortcuts">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B8050]">
            Browse by Budget
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {PRICE_TIERS.map((tier) => (
              <button
                type="button"
                key={tier.value}
                onClick={() => {
                  setSelectedPriceTier(tier.value);
                  const el = document.getElementById('gifting-products-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`rounded-xs border px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
                  selectedPriceTier === tier.value
                    ? 'border-[#7D2934] bg-[#7D2934] text-white font-medium shadow-sm'
                    : 'border-[#D6CBB8] bg-white text-[#17382D] hover:border-[#7D2934]'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE ALL GIFTS (All 30 Products with Dynamic MongoDB API) */}
      <section id="gifting-products-grid" className="py-14 sm:py-20" aria-labelledby="all-gifts-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-[#E6DFD3] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B8050]">
                Live Catalogue
              </p>
              <h2 id="all-gifts-heading" className="font-serif text-2xl font-normal text-[#17382D] sm:text-3xl">
                Explore All Gifts
              </h2>
              <p className="mt-1 text-xs text-[#766F61]">
                Showing {filteredProducts.length} of {rawProducts.length} curated jewellery designs
              </p>
            </div>

            {/* Quick Reset Button if filtered */}
            {(selectedCategory !== 'all' || selectedMetal !== 'all' || selectedPriceTier !== 'all' || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMetal('all');
                  setSelectedPriceTier('all');
                  setSearchQuery('');
                  setSortBy('recommended');
                }}
                className="text-xs uppercase tracking-wider text-[#7D2934] underline hover:text-[#5C1D26]"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* FILTERS & SEARCH BAR */}
          <div className="mt-6 grid grid-cols-1 gap-3 rounded-sm border border-[#E6DFD3] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Category Select */}
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">
              Category
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"
              >
                {GIFT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name === 'All Gifts' ? 'all' : c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Metal Select */}
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">
              Metal
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"
              >
                {METALS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Price Tier Select */}
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">
              Price Range
              <select
                value={selectedPriceTier}
                onChange={(e) => setSelectedPriceTier(e.target.value)}
                className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"
              >
                {PRICE_TIERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Sorting Select */}
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">
              Sort By
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"
              >
                <option value="recommended">Featured / Curated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </label>

            {/* Search Input */}
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">
              Search
              <span className="relative mt-1 block">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#9B8050]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts..."
                  className="w-full border border-[#D6CBB8] py-2 pl-8 pr-2 text-xs normal-case tracking-normal text-[#292923]"
                />
              </span>
            </label>
          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="mt-8">
            {isLoading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-[#EEE7DC]" />
                ))}
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-sm border border-[#E6DFD3] bg-white p-12 text-center text-sm text-[#766F61]">
                <Gift className="mx-auto h-8 w-8 text-[#9B8050]" />
                <p className="mt-3">The Gifting Collection is temporarily loading. Please refresh the page.</p>
              </div>
            )}

            {!isLoading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.sku} product={product} />
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="rounded-sm border border-[#E6DFD3] bg-white p-16 text-center">
                <Gift className="mx-auto h-10 w-10 text-[#C6A15B]" />
                <h3 className="mt-3 font-serif text-xl text-[#17382D]">No designs match your filters</h3>
                <p className="mt-2 text-xs text-[#766F61]">
                  Try resetting the category, price tier, or search keyword.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedMetal('all');
                    setSelectedPriceTier('all');
                    setSearchQuery('');
                  }}
                  className="mt-5 inline-flex items-center gap-2 border border-[#7D2934] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#7D2934] transition-colors hover:bg-[#7D2934] hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: PERSONALIZED GIFTING & PACKAGING */}
      <section className="border-t border-[#E6DFD3] bg-white py-16 sm:py-24" aria-labelledby="personalized-gifting-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B8050]">The Art of Giving</p>
              <h2 id="personalized-gifting-heading" className="mt-2 font-serif text-3xl font-normal text-[#17382D] sm:text-4xl">
                Personalized Gifting Experience
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#766F61]">
                At Rishi Lal Jewellers, we believe presentation is an intrinsic part of the gift. Every order is meticulously wrapped by hand, accompanied by bespoke personal touches.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FAF7F2] text-[#7D2934]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#17382D]">Signature Velvet &amp; Satin Box</h3>
                    <p className="text-xs text-[#766F61]">Rich burgundy presentation case lined with ivory velvet and adorned with a hand-tied champagne ribbon.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FAF7F2] text-[#7D2934]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#17382D]">Handwritten Calligraphy Card</h3>
                    <p className="text-xs text-[#766F61]">Include a personal message in handwritten calligraphy on gold-foil trimmed cotton rag stationery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FAF7F2] text-[#7D2934]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#17382D]">Certificate of Authenticity</h3>
                    <p className="text-xs text-[#766F61]">Complete documentation detailing gold purity hallmark and diamond grade certification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-sm border border-[#E6DFD3] bg-[#FAF7F2] p-3 shadow-lg">
                <div className="relative h-full w-full overflow-hidden">
                  <SafeImage
                    src="/images/gifting/categories/gift-sets.jpg"
                    alt="Rishi Lal signature gift packaging"
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-cover"
                    fallbackSrc="/images/placeholder-jewelry.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

