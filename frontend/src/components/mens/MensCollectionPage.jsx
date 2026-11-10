'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Award,
  Truck,
  Sparkles,
  ArrowLeft,
  Gem,
  Crown,
  Check,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';

const SUBCATEGORIES = [
  { id: 'all', label: 'All Creations', count: 30 },
  { id: "Men's Gold Chains", label: 'Gold Chains', count: 6 },
  { id: "Men's Gold Rings", label: 'Gold Rings', count: 5 },
  { id: "Men's Bracelets", label: 'Bracelets', count: 5 },
  { id: "Men's Kada", label: 'Royal Kadas', count: 4 },
  { id: "Men's Pendants", label: 'Pendants', count: 3 },
  { id: "Men's Silver Jewellery", label: 'Silver Jewellery', count: 4 },
  { id: "Men's Diamond Jewellery", label: 'Diamond Jewellery', count: 3 },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-15k', label: 'Under ₹15,000', min: 0, max: 15000 },
  { id: '15k-35k', label: '₹15,000 – ₹35,000', min: 15000, max: 35000 },
  { id: '35k-75k', label: '₹35,000 – ₹75,000', min: 35000, max: 75000 },
  { id: 'above-75k', label: 'Above ₹75,000', min: 75000, max: Infinity },
];

const METALS = [
  { id: 'all', label: 'All Metals' },
  { id: 'Gold', label: 'Gold' },
  { id: 'Diamond', label: 'Diamond' },
  { id: 'Silver', label: 'Silver' },
];

export default function MensCollectionPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch all men's products from MongoDB through API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mens-collection-products'],
    queryFn: () => api.getProducts({ categorySlug: 'men', limit: 50 }),
  });

  const allProducts = data?.products || [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Subcategory Filter
    if (selectedSubcategory !== 'all') {
      result = result.filter(
        (p) =>
          p.subcategory === selectedSubcategory ||
          (p.category && p.category.toLowerCase() === selectedSubcategory.toLowerCase())
      );
    }

    // Metal Type Filter
    if (selectedMetal !== 'all') {
      result = result.filter(
        (p) =>
          p.metalType === selectedMetal ||
          (p.metal && p.metal.toLowerCase().includes(selectedMetal.toLowerCase()))
      );
    }

    // Price Range Filter
    if (selectedPriceRange !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        result = result.filter((p) => {
          const price = Number(p.price) || 0;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      // 'featured' / default: prioritize featured & bestsellers
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        return 0;
      });
    }

    return result;
  }, [allProducts, selectedSubcategory, selectedMetal, selectedPriceRange, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedSubcategory !== 'all' ||
    selectedMetal !== 'all' ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedMetal('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen text-[#17382D]">
      {/* ═════════════════════════════════════════════════════════════════════
          1. EDITORIAL LUXURY HERO BANNER
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#07130E] via-[#0E2419] to-[#1C160B] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C2AA6A]/30">
        {/* Subtle Ornamental Geometric Background Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(194, 170, 106, 0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#C2AA6A] hover:text-[#E8D9B5] uppercase tracking-widest font-sans mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Boutique Home</span>
          </Link>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C2AA6A] inline-block" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#C2AA6A]">
              Rishi Lal Atelier · Haute Fine Jewellery
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C2AA6A] inline-block" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#FFFFFF]">
            Men’s Jewellery Collection
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-[#D8C596] text-base sm:text-xl mt-2.5 sm:mt-3">
            Commanding Presence · Refined Sophistication · Heritage Karigari
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C2AA6A] to-transparent mx-auto mt-4" />

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-[#F8F5EF]/85 mt-4 max-w-2xl mx-auto leading-relaxed">
            Discover 30 signature creations in 22KT BIS Hallmarked yellow gold, solid royal kadas,
            heavy curb and Franco chains, sovereign signet rings, handcrafted 925 sterling silver,
            and certified natural solitaire diamonds forged for the modern gentleman.
          </p>

          {/* Trust Value Badges Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-[#F8F5EF]/80 font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C2AA6A]" />
              <span>100% BIS HUID Hallmarked</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#C2AA6A]" />
              <span>Certified Natural Solitaires</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C2AA6A]" />
              <span>Complimentary Insured Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C2AA6A]" />
              <span>15-Day Exchange Privileges</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. SUBCATEGORY PILL NAVIGATION
      ═════════════════════════════════════════════ */}
      <nav
        aria-label="Men's Jewellery Categories"
        className="bg-white border-b border-[#E6DFD3] sticky top-[60px] sm:top-[72px] z-20 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {SUBCATEGORIES.map((cat) => {
              const isSelected = selectedSubcategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubcategory(cat.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-sans tracking-wide whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#7D2934] text-white shadow-xs font-semibold'
                      : 'bg-[#F5F2EB] text-[#4A0B13] hover:bg-[#EBE5D8]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-charcoal-500'
                    }`}
                  >
                    {cat.id === 'all'
                      ? allProducts.length
                      : allProducts.filter((p) => p.subcategory === cat.id).length || cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════════════
          3. MAIN CONTENT CONTAINER WITH FILTERS & PRODUCTS
      ═════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Search, Filter Summary & Sorting Bar */}
        <div className="bg-white border border-[#E6DFD3] rounded-sm p-3 sm:p-4 mb-6 sm:mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search chains, rings, kadas, silver, diamonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF8F5] border border-[#E6DFD3] rounded-sm text-[#17382D] placeholder-charcoal-500 focus:outline-none focus:border-[#C2AA6A] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#C2AA6A] absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns (Desktop) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              {/* Metal Filter */}
              <div className="relative">
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-[#E6DFD3] text-xs text-[#17382D] py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#C2AA6A] cursor-pointer"
                >
                  {METALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Price Filter */}
              <div className="relative">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-[#E6DFD3] text-xs text-[#17382D] py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#C2AA6A] cursor-pointer"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-[#E6DFD3] text-xs text-[#17382D] py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#C2AA6A] cursor-pointer font-medium"
                >
                  <option value="featured">Featured &amp; Bestsellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Additions</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reset Filters CTA */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[#7D2934] hover:bg-[#7D2934]/10 rounded-sm font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Tags */}
          <div className="mt-3 pt-3 border-t border-[#F0EBE0] flex items-center justify-between text-xs text-charcoal-600">
            <p>
              Showing <span className="font-bold text-[#7D2934]">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-[#17382D]">{allProducts.length}</span> creations
              {selectedSubcategory !== 'all' && (
                <span className="ml-1 text-[#9B8050]">in {selectedSubcategory}</span>
              )}
            </p>

            <span className="text-[11px] text-charcoal-500 hidden sm:inline">
              Every creation is certified by Government BIS HUID &amp; IGI
            </span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            4. PRODUCT GRID
        ═════════════════════════════════════════════ */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#C2AA6A] border-r-transparent" />
            <p className="mt-4 font-serif text-sm text-[#7D2934]">
              Loading the Men’s Haute Jewellery Collection…
            </p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center bg-white border border-red-200 rounded-sm p-8">
            <p className="font-serif text-lg text-red-700">
              Unable to load the collection at this moment.
            </p>
            <p className="mt-2 text-xs text-charcoal-500">
              Please check your connection or contact our boutique concierge.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E6DFD3] rounded-sm p-8">
            <Crown className="w-10 h-10 text-[#C2AA6A] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#17382D]">No matching jewellery found</h3>
            <p className="mt-2 text-xs text-charcoal-600 max-w-md mx-auto">
              We couldn’t find any creations matching your active filter criteria. Try adjusting
              your search keywords or clearing active filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7D2934] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#5C1D26] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.sku} product={product} />
            ))}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            5. HERITAGE & ATELIER STORY STRIP
        ═════════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-24 border-t border-[#E6DFD3] pt-12 sm:pt-16">
          <div className="bg-gradient-to-br from-[#F5EFE6] to-[#FAF7F2] border border-[#E6DFD3] rounded-sm p-6 sm:p-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#C2AA6A]/10 text-[#C2AA6A] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#17382D]">
              Bespoke Men’s Atelier &amp; Custom Sizing
            </h2>
            <div className="w-12 h-0.5 bg-[#C2AA6A] mx-auto my-3" />
            <p className="font-sans text-xs sm:text-sm text-charcoal-700 leading-relaxed max-w-2xl mx-auto">
              Need a personalized chain length, custom Kada wrist diameter, or an engraved monogram
              on your signet ring? Our generational karigars offer custom sizing, metal purity upgrades,
              and dedicated concierge consultations for discerning collectors.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#17382D] text-[#E8D9B5] text-xs uppercase tracking-widest font-semibold hover:bg-[#0A1A12] transition-colors"
              >
                Book Atelier Appointment
              </Link>
              <Link
                href="/about"
                className="px-6 py-2.5 border border-[#17382D] text-[#17382D] text-xs uppercase tracking-widest font-semibold hover:bg-[#17382D] hover:text-white transition-colors"
              >
                Our Heritage Karigari
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
