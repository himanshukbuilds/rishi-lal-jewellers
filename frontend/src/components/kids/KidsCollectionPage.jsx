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
  Heart,
  Baby,
  Smile,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';

const SUBCATEGORIES = [
  { id: 'all', label: 'All Treasures', count: 30 },
  { id: 'Kids Gold Earrings', label: 'Gold Earrings', count: 5 },
  { id: 'Kids Gold Chains', label: 'Gold Chains', count: 4 },
  { id: 'Kids Gold Pendants', label: 'Gold Pendants', count: 5 },
  { id: 'Kids Gold Bangles', label: 'Gold Bangles', count: 4 },
  { id: 'Kids Gold Rings', label: 'Gold Rings', count: 3 },
  { id: 'Kids Silver Anklets', label: 'Silver Anklets', count: 3 },
  { id: 'Kids Silver Bracelets', label: 'Silver Bracelets', count: 3 },
  { id: 'Kids Silver Chains', label: 'Silver Chains', count: 3 },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-3k', label: 'Under ₹3,000', min: 0, max: 3000 },
  { id: '3k-10k', label: '₹3,000 – ₹10,000', min: 3000, max: 10000 },
  { id: '10k-20k', label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { id: 'above-20k', label: 'Above ₹20,000', min: 20000, max: Infinity },
];

const METALS = [
  { id: 'all', label: 'All Metals' },
  { id: 'Gold', label: 'Gold (22K & 18K)' },
  { id: 'Silver', label: 'Silver (925 Sterling)' },
];

const AGE_GROUPS = [
  { id: 'all', label: 'All Ages' },
  { id: 'baby', label: '0–3 Years (Infant & Baby)', pattern: /0[–-]3|1[–-]3|1[–-]5|0[–-]4|infant|baby/i },
  { id: 'toddler', label: '3–6 Years (Toddler)', pattern: /2[–-]6|2[–-]8|3[–-]8|3[–-]6|1[–-]6/i },
  { id: 'junior', label: '6–12 Years (Junior)', pattern: /4[–-]12|5[–-]12|3[–-]12|3[–-]10|3[–-]11/i },
];

export default function KidsCollectionPage() {
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch all kids' products from MongoDB through API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['kids-collection-products'],
    queryFn: () => api.getProducts({ categorySlug: 'kids', limit: 50 }),
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

    // Age Group Filter
    if (selectedAge !== 'all') {
      const ageSpec = AGE_GROUPS.find((a) => a.id === selectedAge);
      if (ageSpec && ageSpec.pattern) {
        result = result.filter((p) => {
          const sizeStr = (p.availableSizes || []).join(' ') + ' ' + (p.description || '');
          return ageSpec.pattern.test(sizeStr);
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
  }, [allProducts, selectedSubcategory, selectedMetal, selectedPriceRange, selectedAge, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedSubcategory !== 'all' ||
    selectedMetal !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedAge !== 'all' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedMetal('all');
    setSelectedPriceRange('all');
    setSelectedAge('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FCFAF7] min-h-screen text-[#17382D]">
      {/* ═════════════════════════════════════════════════════════════════════
          1. EDITORIAL LUXURY HERO BANNER FOR KIDS
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#21160D] via-[#332214] to-[#1F1710] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C2AA6A]/30">
        {/* Subtle Decorative Star Sparkle Motif */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(220, 190, 130, 0.45) 1px, transparent 0)',
            backgroundSize: '28px 28px',
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
              Rishi Lal Atelier · Precious Little Heirlooms
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C2AA6A] inline-block" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white font-normal mb-4">
            Kids&apos; Fine Jewellery
          </h1>

          {/* Tagline */}
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#E8D9B5] max-w-2xl mx-auto mb-6">
            Auspicious First Treasures &amp; Keepsake Family Heirlooms
          </p>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-[#D1C7B7] max-w-2xl mx-auto leading-relaxed">
            Discover lightweight 22KT gold balis, protective evil-eye nazariya cuffs, playful animal charms,
            and pure 925 sterling silver anklets designed with rounded edges and secure child-safe closures.
          </p>

          {/* Trust Highlights */}
          <div className="mt-8 pt-8 border-t border-[#C2AA6A]/20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-left">
              <ShieldCheck className="w-5 h-5 text-[#C2AA6A] shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-white">100% BIS Hallmarked</p>
                <p className="text-[10px] text-[#A69B88]">916 &amp; 750 Pure Gold</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-left">
              <Baby className="w-5 h-5 text-[#C2AA6A] shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-white">Child-Safe Finish</p>
                <p className="text-[10px] text-[#A69B88]">Smooth Burr-Free Contours</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-left">
              <Award className="w-5 h-5 text-[#C2AA6A] shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-white">925 Sterling Silver</p>
                <p className="text-[10px] text-[#A69B88]">Lead &amp; Nickel Safe</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-left">
              <Truck className="w-5 h-5 text-[#C2AA6A] shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-white">Insured Delivery</p>
                <p className="text-[10px] text-[#A69B88]">Tamper-Proof Gift Pack</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. SUBCATEGORY PILLS (ALL, EARRINGS, CHAINS, PENDANTS, BANGLES, ETC)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#E6DFD3] sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {SUBCATEGORIES.map((cat) => {
              const isSelected = selectedSubcategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubcategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#8B1E2D] text-white shadow-xs font-medium'
                      : 'bg-[#F4EFEA] text-[#4A3B32] hover:bg-[#EBE3D9]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#E3D9CC] text-[#6E5D4F]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. FILTER BAR (SEARCH, METAL, PRICE, AGE, SORT, COUNTS)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-[#E6DFD3] p-4 rounded-sm shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Live Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search butterflies, nazariya, hearts, balis, silver payal..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-[#D8CFBD] rounded-sm bg-[#FCFAF7] focus:outline-none focus:border-[#8B1E2D] text-[#17382D] placeholder-[#9E9080] font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A6B] hover:text-[#8B1E2D]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Metal Filter */}
              <div className="relative">
                <select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#D8CFBD] rounded-sm bg-[#FCFAF7] text-[#17382D] focus:outline-none focus:border-[#8B1E2D] font-sans cursor-pointer"
                >
                  {METALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Price Range Filter */}
              <div className="relative">
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#D8CFBD] rounded-sm bg-[#FCFAF7] text-[#17382D] focus:outline-none focus:border-[#8B1E2D] font-sans cursor-pointer"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Age Suitability Filter */}
              <div className="relative">
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#D8CFBD] rounded-sm bg-[#FCFAF7] text-[#17382D] focus:outline-none focus:border-[#8B1E2D] font-sans cursor-pointer"
                >
                  {AGE_GROUPS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs border border-[#D8CFBD] rounded-sm bg-[#FCFAF7] text-[#17382D] focus:outline-none focus:border-[#8B1E2D] font-sans cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7A6B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reset button if active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[#8B1E2D] hover:text-[#641520] hover:bg-[#FBECEE] rounded-sm border border-[#EAC2C8] transition-colors cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active summary line */}
          <div className="mt-3 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#6E5D4F] font-sans">
            <div>
              Showing <span className="font-semibold text-[#17382D]">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-[#17382D]">{allProducts.length}</span> handcrafted children&apos;s pieces
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#A07028]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified BIS Hallmarked Gold &amp; 925 Sterling Silver</span>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            4. PRODUCTS GRID
        ═════════════════════════════════════════════════════════════════════ */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#8B1E2D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif text-lg text-[#17382D]">Curating the Kids&apos; Collection...</p>
            <p className="font-sans text-xs text-[#8C7A6B] mt-1">Fetching hallmarked jewellery from our royal atelier</p>
          </div>
        ) : isError ? (
          <div className="bg-white border border-[#E6DFD3] p-12 text-center rounded-sm max-w-lg mx-auto">
            <p className="font-serif text-lg text-[#8B1E2D] mb-2">Unable to load Kids&apos; Collection</p>
            <p className="font-sans text-xs text-[#6E5D4F] mb-4">
              Please check your connection or contact our boutique concierge for assistance.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8B1E2D] text-white text-xs uppercase tracking-wider rounded-sm cursor-pointer hover:bg-[#641520]"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E6DFD3] p-12 text-center rounded-sm max-w-lg mx-auto my-8">
            <Baby className="w-10 h-10 text-[#C2AA6A] mx-auto mb-3" />
            <p className="font-serif text-lg text-[#17382D] mb-2">No Matching Pieces Found</p>
            <p className="font-sans text-xs text-[#6E5D4F] mb-4">
              Try adjusting your subcategory, price, metal, or age filter parameters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#8B1E2D] text-white text-xs uppercase tracking-wider rounded-sm cursor-pointer hover:bg-[#641520]"
            >
              View All 30 Kids Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.sku} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. CHILD SAFETY & JEWELLERY CARE GUIDELINES
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#E6DFD3] mt-16 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8B1E2D] block mb-1">
              Safety, Comfort &amp; Authenticity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#17382D]">
              Child-Safe Craftsmanship &amp; Care Guidance
            </h2>
            <p className="font-sans text-xs text-[#6E5D4F] mt-2">
              Every creation in the Rishi Lal Jewellers kids collection is engineered specially with tender skin, active movement, and peace-of-mind in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 border border-[#EFE8DD] bg-[#FCFAF7] rounded-sm">
              <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/10 flex items-center justify-center text-[#8B1E2D] mb-3">
                <Smile className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base text-[#17382D] mb-1.5">Gentle Edge Finishing</h3>
              <p className="font-sans text-xs text-[#6E5D4F] leading-relaxed">
                All butterfly, floral, star, and animal contours are triple-tumbled and hand-buffed with diamond rouge to ensure zero sharp burrs or pinching edges against young skin.
              </p>
            </div>

            <div className="p-5 border border-[#EFE8DD] bg-[#FCFAF7] rounded-sm">
              <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/10 flex items-center justify-center text-[#8B1E2D] mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base text-[#17382D] mb-1.5">Secure Fastenings &amp; Sizing</h3>
              <p className="font-sans text-xs text-[#6E5D4F] leading-relaxed">
                Earrings utilize child-safe screw-back bells or snug flush-fit huggie closures. Bangles and anklets feature smooth sliding expansion links to grow alongside your child.
              </p>
            </div>

            <div className="p-5 border border-[#EFE8DD] bg-[#FCFAF7] rounded-sm">
              <div className="w-8 h-8 rounded-full bg-[#8B1E2D]/10 flex items-center justify-center text-[#8B1E2D] mb-3">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base text-[#17382D] mb-1.5">Parental Supervision &amp; Care</h3>
              <p className="font-sans text-xs text-[#6E5D4F] leading-relaxed">
                Children under 3 years should wear jewellery under adult supervision. Clean gently with lukewarm water and a soft cloth; avoid harsh perfumes or chlorinated water.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
