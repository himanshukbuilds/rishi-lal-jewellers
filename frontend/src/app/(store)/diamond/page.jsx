'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Award,
  Truck,
  Sparkles,
  Gem
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';
import { useWishlist } from '@/context/WishlistContext';

// Diamond carousel slides matching the editorial luxury reference
const HERO_SLIDES = [
  {
    eyebrow: 'Shop By Collection',
    line1: 'WEDDING STYLE',
    line2: 'CASUAL COLLECTION',
    line3: 'ESSENTIAL STYLE',
    description:
      'Discover our diamond collection, where timeless brilliance meets modern elegance. Each piece is crafted to make every moment unforgettable.',
    modelImage: '/images/diamond/diamond-hero-model.jpg',
    modelAlt: 'Editorial portrait of woman wearing diamond drop earrings and sapphire halo ring',
    necklaceBoxImage: '/images/diamond/diamond-hero-box-necklace.jpg',
    necklaceBoxAlt: 'Diamond necklace and matching earrings in luxury midnight-blue velvet box',
    ringBoxImage: '/images/diamond/diamond-hero-box-ring.jpg',
    ringBoxAlt: 'Brilliant diamond solitaire ring in circular dark velvet presentation box',
  },
  {
    eyebrow: 'High Jewellery Suite',
    line1: 'SOLITAIRE CROWNS',
    line2: 'TENNIS BRACELETS',
    line3: 'DEWDROP STUDS',
    description:
      'Handcrafted with IGI and GIA certified natural solitaires. Micro-pavé halos, continuous brilliant lines, and four-prong platinum settings.',
    modelImage: '/images/home/royal_bridal_portrait.jpg',
    modelAlt: 'Royal diamond trousseau portrait',
    necklaceBoxImage: '/images/diamond/diamond-hero-box-necklace.jpg',
    necklaceBoxAlt: 'Certified solitaire diamond jewels in midnight display casket',
    ringBoxImage: '/images/diamond/diamond-hero-box-ring.jpg',
    ringBoxAlt: 'Solitaire diamond ring in box',
  },
  {
    eyebrow: 'Royal Heritage Polki',
    line1: 'IMPERIAL POLKI',
    line2: 'BASRA PEARL HAARS',
    line3: 'STATEMENT RINGS',
    description:
      'Uncut syndicate polki diamonds set in 22KT gold with Colombian emerald beads and luminous natural pearls.',
    modelImage: '/images/categories/bridal.jpg',
    modelAlt: 'Uncut syndicate polki and natural diamond bridal suite',
    necklaceBoxImage: '/images/diamond/diamond-hero-box-necklace.jpg',
    necklaceBoxAlt: 'Polki choker in luxury display',
    ringBoxImage: '/images/diamond/diamond-hero-box-ring.jpg',
    ringBoxAlt: 'Polki diamond cocktail ring in presentation casket',
  },
];

// Fallback diamond products from the reference image in case offline/loading
const FALLBACK_DIAMOND_PRODUCTS = [
  {
    _id: 'fb-dia-1',
    name: 'Diamond Necklace',
    slug: 'zubeda-royal-emerald-diamond-statement-haar',
    price: 185000,
    category: 'Necklace',
    image: '/images/diamond/products/diamond-necklace.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-dia-2',
    name: 'Diamond Earrings',
    slug: 'celestial-dewdrop-solitaire-diamond-studs-1-00-ct',
    price: 92000,
    category: 'Earrings',
    image: '/images/diamond/products/diamond-earrings.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-dia-3',
    name: 'Diamond Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    price: 110000,
    category: 'Rings',
    image: '/images/diamond/products/diamond-ring.jpg',
    metal: 'Platinum & 18K Gold',
  },
  {
    _id: 'fb-dia-4',
    name: 'Diamond Bracelet',
    slug: 'eternal-rose-diamond-tennis-bracelet-3-00-ct',
    price: 225000,
    category: 'Bracelet',
    image: '/images/diamond/products/diamond-bracelet.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-dia-5',
    name: 'Diamond Pendant',
    slug: 'kashmir-royale-colombian-emerald-pendant-18k-chain',
    price: 98000,
    category: 'Pendant',
    image: '/images/diamond/products/diamond-pendant.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-dia-6',
    name: 'Diamond Studs',
    slug: 'celestial-dewdrop-solitaire-diamond-studs-1-00-ct',
    price: 75000,
    category: 'Earrings',
    image: '/images/diamond/products/diamond-studs.jpg',
    metal: '18K White Gold',
  },
];

export default function DiamondLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query genuine diamond products from backend API
  const { data, isLoading } = useQuery({
    queryKey: ['diamond-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'diamond',
        sort: sort === 'featured' ? undefined : sort,
        limit: 48,
      }),
  });

  const rawProducts = data?.products && data.products.length > 0 ? data.products : FALLBACK_DIAMOND_PRODUCTS;

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by jewellery type
    if (selectedType !== 'all') {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        if (selectedType === 'rings') {
          return /ring|band|solitaire/i.test(name) || /ring/i.test(cat) || tags.includes('rings');
        }
        if (selectedType === 'earrings') {
          return /earring|stud|jhumka|drop/i.test(name) || /earring/i.test(cat) || tags.some((t) => ['earring', 'studs'].includes(t));
        }
        if (selectedType === 'bracelets') {
          return /bracelet|tennis|bangle/i.test(name) || /bracelet/i.test(cat) || tags.includes('bracelet');
        }
        if (selectedType === 'necklaces') {
          return /necklace|choker|haar|pendant|mangalsutra/i.test(name) || /necklace/i.test(cat) || tags.some((t) => ['necklace', 'choker', 'mangalsutra'].includes(t));
        }
        return true;
      });
    }

    // Sort products
    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [rawProducts, selectedType, sort]);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2A1810]">
      {/* =========================================================================
          HERO SECTION — MIDNIGHT NAVY EDITORIAL HERO (MATCHING REFERENCE EXACTLY)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#061F32] text-white border-b border-[#0C2D46]">
        {/* Deep navy radial ambient gradient */}
        <div className="absolute inset-0 bg-radial from-[#092B45]/80 via-[#061F32] to-[#041624] pointer-events-none" />

        {/* Subtle decorative curved background lines & diamond sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1440 520" fill="none">
            <path
              d="M -100 260 Q 300 120 720 260 T 1540 260"
              stroke="#D6B36A"
              strokeWidth="0.75"
              strokeDasharray="4 8"
            />
            <path
              d="M -100 340 Q 400 480 820 300 T 1540 200"
              stroke="#D6B36A"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Sparkle 1 near top left box */}
        <span className="absolute top-28 left-[27%] text-[#D6B36A] text-lg select-none pointer-events-none opacity-80 animate-pulse">
          ✦
        </span>
        {/* Sparkle 2 near bottom left */}
        <span className="absolute bottom-20 left-[29%] text-[#D6B36A] text-base select-none pointer-events-none opacity-70 animate-pulse">
          ✦
        </span>

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] sm:min-h-[510px] lg:min-h-[530px] items-stretch">
            
            {/* -------------------------------------------------------------------
                LEFT PANEL: TWO SUPPORTING JEWELLERY BOX PHOTOGRAPHS (~28% desktop)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 xl:col-span-3.5 relative flex flex-col justify-between p-6 sm:p-8 lg:pl-10 lg:pr-4 order-2 lg:order-1">
              {/* Image 1: Horizontal Photograph of Diamond Necklace Box */}
              <div className="relative w-full max-w-[260px] sm:max-w-[280px] aspect-[16/10] rounded-sm overflow-hidden border border-[#D6B36A]/50 shadow-2xl bg-[#03111C] group transition-transform duration-300 hover:scale-102">
                <Image
                  src={slide.necklaceBoxImage}
                  alt={slide.necklaceBoxAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" aria-hidden="true" />
              </div>

              {/* Image 2: Circular Photograph of Diamond Ring Box */}
              <div className="relative -mt-4 sm:-mt-6 ml-auto mr-4 sm:mr-8 w-32 sm:w-36 lg:w-40 aspect-square rounded-full overflow-hidden border-2 border-[#D6B36A]/70 shadow-2xl bg-[#03111C] z-20 group transition-transform duration-300 hover:scale-105">
                <Image
                  src={slide.ringBoxImage}
                  alt={slide.ringBoxAlt}
                  fill
                  sizes="160px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-[#D6B36A]/30 pointer-events-none" />
              </div>

              {/* Lower-left decorative text matching reference */}
              <div className="mt-4 pt-2 select-none">
                <div className="flex items-center gap-1.5 text-[#D6B36A] text-xs mb-1">
                  <span>✦</span>
                  <div className="w-6 h-px bg-[#D6B36A]/60" />
                </div>
                <div className="flex flex-col font-serif text-[10px] uppercase tracking-[0.28em] text-[#BACED8] leading-tight">
                  <span className="text-[9px]">A</span>
                  <span className="font-semibold text-white">LEGACY</span>
                  <span>IN EVERY</span>
                  <span className="text-[#D6B36A]">SPARKLE</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                CENTER: CENTRAL EDITORIAL TEXT (~44% desktop: lg:col-span-5)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-5 relative flex flex-col justify-center items-center text-center px-4 sm:px-8 py-8 sm:py-12 z-10 order-1 lg:order-2">
              {/* Small Heading: Shop By Collection */}
              <div className="mb-2">
                <p className="font-serif text-xs sm:text-sm tracking-wide text-[#E8F1F5] font-light">
                  {slide.eyebrow}
                </p>
              </div>

              {/* Subtle Gold Ornamental Divider with Diamond Icon */}
              <div className="flex items-center justify-center gap-3 w-48 mb-5 sm:mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D6B36A] to-[#D6B36A]" />
                <span className="text-[#D6B36A] text-xs">💎</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D6B36A] to-[#D6B36A]" />
              </div>

              {/* Three Large Uppercase Serif Headings */}
              <div className="space-y-1 sm:space-y-1.5 mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.15rem] leading-[1.08] tracking-widest text-white uppercase font-normal drop-shadow-sm">
                  {slide.line1}
                </h1>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.15rem] leading-[1.08] tracking-widest text-[#E2EFF6] uppercase font-normal drop-shadow-sm">
                  {slide.line2}
                </h2>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.15rem] leading-[1.08] tracking-widest text-[#BACED8] uppercase font-normal drop-shadow-sm">
                  {slide.line3}
                </h3>
              </div>

              {/* Supporting Copy */}
              <p className="font-sans text-xs sm:text-sm text-[#B0CAD6] font-light leading-relaxed max-w-md mx-auto mb-8 px-2">
                {slide.description}
              </p>

              {/* Centered Outlined CTA Button */}
              <div>
                <button
                  onClick={scrollToCollection}
                  className="group inline-flex items-center gap-3 px-8 sm:px-9 py-3 rounded-full border border-white/85 text-white hover:border-[#D6B36A] hover:bg-[#D6B36A] hover:text-[#061F32] bg-transparent text-xs sm:text-[13px] font-sans font-medium tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B36A]"
                  aria-label="Explore the diamond collection"
                >
                  <span>EXPLORE DIAMONDS</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT-SIDE: MAIN EDITORIAL PHOTOGRAPH & DECORATIVE PANEL (~28%)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-3 xl:col-span-3.5 relative flex items-stretch order-3">
              {/* Main Model Photograph */}
              <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-[#0A2438] border-l border-[#0C2D46]">
                <Image
                  src={slide.modelImage}
                  alt={slide.modelAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover object-center transition-all duration-700 ease-out"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#061F32]/50 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Narrow Right Decorative Panel */}
              <div className="hidden sm:flex flex-col justify-between items-center py-8 px-3 sm:px-4 bg-[#051A2B] border-l border-[#0C2D46] z-10">
                {/* Circular Diamond Ornamental Graphic */}
                <div className="pt-2">
                  <div className="w-12 h-12 rounded-full border border-[#D6B36A]/60 flex items-center justify-center text-[#D6B36A] shadow-xs">
                    <span className="text-sm">✦</span>
                  </div>
                </div>

                {/* Vertical Stacked Text: BRILLIANCE THAT LASTS FOREVER */}
                <div className="my-auto py-6 text-center select-none">
                  <div className="flex flex-col items-center gap-1 font-serif text-[10px] uppercase tracking-[0.26em] text-[#D6B36A]/90 font-light leading-tight">
                    <span className="font-semibold text-white">BRILLIANCE</span>
                    <span>THAT LASTS</span>
                    <span className="text-[#D6B36A]">FOREVER</span>
                  </div>
                </div>

                {/* Slide Indicator & Carousel Controls */}
                <div className="flex flex-col items-center gap-2.5 pb-2">
                  <div className="font-mono text-xs tracking-wider text-[#D6B36A]">
                    <span className="font-bold text-white">0{currentSlide + 1}</span>
                    <span className="text-[#5B7885] mx-1">/</span>
                    <span className="text-[#5B7885]">0{HERO_SLIDES.length}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevSlide}
                      className="w-7 h-7 rounded-full border border-[#143B57] bg-[#09253B]/70 hover:bg-[#D6B36A] hover:text-[#061F32] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="w-7 h-7 rounded-full border border-[#143B57] bg-[#09253B]/70 hover:bg-[#D6B36A] hover:text-[#061F32] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DIAMOND COLLECTION SECTION (#collection) — WARM IVORY ATELIER
         ========================================================================= */}
      <section id="collection" className="bg-[#F8F1E7] border-b border-[#E8DFD3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 pb-6 border-b border-[#E6DFD3]">
            {/* Left: Eyebrow and Heading matching reference */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-px bg-[#B49A58]" aria-hidden="true" />
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#B49A58]">
                  THE DIAMOND COLLECTION
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-[#1D1C16]">
                Our Diamond Jewellery
              </h2>
            </div>

            {/* Right: Sort by & Filter controls matching reference */}
            <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto">
              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 text-xs font-sans text-[#524B42]">
                <span className="hidden sm:inline">Sort by</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-white border border-[#D6CBB8] text-xs text-[#2A1810] py-2 pl-3.5 pr-8 rounded-md focus:outline-none focus:border-[#650B19] font-sans font-medium cursor-pointer shadow-2xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Additions</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A6A53] absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Filter Button with refined burgundy outline */}
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-xs font-sans font-medium transition-all duration-200 cursor-pointer shadow-2xs ${
                  filterDrawerOpen || selectedType !== 'all'
                    ? 'border-[#650B19] bg-[#650B19] text-white'
                    : 'border-[#650B19] bg-transparent text-[#650B19] hover:bg-[#650B19]/10'
                }`}
                aria-label="Filter diamond jewellery"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {selectedType !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-[#D6B36A] ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Interactive Filter Drawer */}
          {filterDrawerOpen && (
            <div className="bg-white rounded-xl p-5 mb-8 border border-[#E6DFD3] shadow-sm animate-fade-in">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EFEAE2]">
                <h3 className="font-serif text-sm font-semibold text-[#2A1810] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B49A58]" />
                  <span>Refine Diamond Creations</span>
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-[#716D64] hover:text-[#2A1810]"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D] mb-2.5">
                  Jewellery Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Diamond Creations' },
                    { id: 'rings', label: 'Solitaire & Cocktail Rings' },
                    { id: 'earrings', label: 'Studs & Drop Earrings' },
                    { id: 'bracelets', label: 'Tennis Bracelets' },
                    { id: 'necklaces', label: 'Haars & Pendants' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedType(tab.id)}
                      className={`px-3 py-1.5 text-xs font-sans rounded-full transition-colors ${
                        selectedType === tab.id
                          ? 'bg-[#650B19] text-white font-medium'
                          : 'bg-[#F8F5EF] text-[#524B42] hover:bg-[#EFE9DF]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedType !== 'all' && (
                <div className="mt-4 pt-3 border-t border-[#EFEAE2] flex justify-end">
                  <button
                    onClick={() => setSelectedType('all')}
                    className="text-xs text-[#8B1E2D] font-medium hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl p-3 border border-[#E6DFD3] animate-pulse aspect-[3/4]"
                />
              ))}
            </div>
          )}

          {/* -------------------------------------------------------------------
              PRODUCT GRID (6 CARDS PER ROW ON DESKTOP, MATCHING REFERENCE)
             ------------------------------------------------------------------- */}
          {!isLoading && displayedProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {displayedProducts.map((product) => {
                const inWishlist = isInWishlist(product._id || product.id);
                const productImage =
                  (product.images && product.images[0]) ||
                  product.image ||
                  '/images/placeholder.jpg';

                return (
                  <div
                    key={product._id || product.id || product.slug}
                    className="group bg-white rounded-xl border border-[#EADBCA] p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#C2AA6A]/60"
                  >
                    {/* Product Image Area on Warm Cream Background */}
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#FAF4EB] mb-2.5">
                      <Link
                        href={`/products/${product.slug || product._id || product.id}`}
                        className="block w-full h-full"
                      >
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </Link>

                      {/* Wishlist Heart Button in Top Right */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
                          inWishlist
                            ? 'text-red-600 bg-red-50'
                            : 'text-[#635B50] hover:text-[#8B1E2D] hover:bg-white'
                        }`}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            inWishlist ? 'fill-current text-red-600' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Meta */}
                    <div className="pt-0.5">
                      <Link
                        href={`/products/${product.slug || product._id || product.id}`}
                        className="block group-hover:text-[#650B19] transition-colors"
                      >
                        <h3 className="font-serif text-xs sm:text-[13px] font-medium text-[#2A1810] leading-snug line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="font-serif text-xs sm:text-[13px] font-bold text-[#650B19] mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayedProducts.length === 0 && (
            <div className="bg-white rounded-xl border border-[#E6DFD3] p-10 text-center max-w-md mx-auto my-10 shadow-xs">
              <p className="font-serif text-base text-[#2A1810] mb-2">
                No diamond creations match your filter criteria.
              </p>
              <p className="font-sans text-xs text-[#716D64] mb-5">
                Reset your filter to view the complete Rishi Lal Diamond Collection.
              </p>
              <button
                onClick={() => setSelectedType('all')}
                className="px-5 py-2 bg-[#650B19] text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-[#8B1E2D] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          DIAMOND GUARANTEE & CERTIFICATION PILLARS
         ========================================================================= */}
      <section className="bg-[#EFEAE2] border-t border-[#E2DBD1] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Gem className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  IGI &amp; GIA Certified
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Every solitaire is graded for cut, color, clarity, and carat with an individual certificate dossier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  VVS Clarity &amp; E-F Colour
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Hand-selected for exceptional fire, scintillation, and flawless optical brilliance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Lifetime Upgrade Guarantee
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  100% credit value on solitaire upgrades across all Rishi Lal Jewellers ateliers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Truck className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Insured Armored Delivery
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Discreet, tamper-proof insured delivery directly to your doorstep in velvet presentation caskets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

