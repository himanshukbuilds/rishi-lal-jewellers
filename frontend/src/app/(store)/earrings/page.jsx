'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/common/SafeImage';
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
import ProductCard from '@/components/product/ProductCard';
import { formatPrice } from '@/config/brandConfig';
import { useWishlist } from '@/context/WishlistContext';

// Carousel slide data for the three-panel editorial hero
const HERO_SLIDES = [
  {
    badge: 'WINTER NEW ARRIVALS',
    line1: 'NEW SEASON',
    line2: 'NEW',
    line3: 'COLLECTION',
    description:
      'Explore earrings design concepts spanning everyday wear and special occasions. Product details and availability are confirmed only after a business enquiry.',
    leftImage: '/images/earrings/earrings-hero-left.jpg',
    leftAlt: 'Woman wearing diamond stud earrings, ring, and delicate necklace with hand near ear',
    rightImage: '/images/earrings/earrings-hero-right.jpg',
    rightAlt: 'Woman wearing elegant teardrop chandelier statement earring',
    leftCaption: ['ELEGANCE', 'IN EVERY', 'DETAIL'],
    rightTagline: ['BEAUTY', 'THAT', 'STAYS', 'FOREVER'],
  },
  {
    badge: 'ROYAL TEMPLE ATELIER',
    line1: 'MAYUR TEMPLE',
    line2: 'HERITAGE',
    line3: 'JHUMKAS',
    description:
      'Explore temple-inspired earring design concepts. The images are illustrative; metal, purity, specifications, price and availability require business confirmation.',
    leftImage: '/images/categories/traditional.jpg',
    leftAlt: 'Temple-inspired earrings editorial portrait',
    rightImage: '/images/home/royal_bridal_portrait.jpg',
    rightAlt: 'Royal bride wearing opulent chandelier jhumkas',
    leftCaption: ['HERITAGE', 'IN EVERY', 'CREATION'],
    rightTagline: ['TRADITION', 'THAT', 'ENDURES', 'ETERNITY'],
  },
  {
    badge: 'HIGH JEWELLERY SOLITAIRES',
    line1: 'CELESTIAL DEW',
    line2: 'SOLITAIRE',
    line3: 'STUDS',
    description:
      'Explore solitaire-inspired earring concepts. Stone identity, setting metal, specifications and certification are not verified for these illustrative designs.',
    leftImage: '/images/categories/diamond.jpg',
    leftAlt: 'Solitaire-inspired earrings concept in a luxury showcase',
    rightImage: '/images/diamond/diamond-hero-model.jpg',
    rightAlt: 'Editorial portrait with halo drop earrings',
    leftCaption: ['BRILLIANCE', 'IN EVERY', 'FACET'],
    rightTagline: ['SPARKLE', 'THAT', 'DAZZLES', 'FOREVER'],
  },
];

export default function EarringsLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [metalFilter, setMetalFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query genuine earrings products from backend API
  const { data, isLoading } = useQuery({
    queryKey: ['earrings-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'earrings',
        sort: sort === 'featured' ? undefined : sort,
        limit: 48,
      }),
  });

  const rawProducts = data?.products || [];

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    if (metalFilter !== 'all') {
      list = list.filter((product) => {
        if (metalFilter === 'Rose Gold') return /rose\s*gold/i.test(product.metal || '') || (product.tags || []).includes('rose-gold');
        return product.metalType === metalFilter;
      });
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter((product) => [product.name, product.description, product.metal, product.metalType, product.subcategory, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(term));
    }
    const priceBands = { under10000: [0, 10000], '10000-25000': [10000, 25000], '25000-50000': [25000, 50000], above50000: [50000, Infinity] };
    if (priceFilter !== 'all') {
      const [minimum, maximum] = priceBands[priceFilter];
      list = list.filter((product) => Number.isFinite(Number(product.price)) && Number(product.price) >= minimum && Number(product.price) < maximum);
    }

    // Filter by style
    if (selectedStyle !== 'all') {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        if (selectedStyle === 'jhumka') {
          return /jhumka|temple|traditional|antique/i.test(name) || /jhumka/i.test(desc) || tags.some((t) => ['jhumka', 'temple'].includes(t));
        }
        if (selectedStyle === 'studs') {
          return /stud|solitaire|bali/i.test(name) || tags.some((t) => ['stud', 'studs', 'solitaire'].includes(t));
        }
        if (selectedStyle === 'drops') {
          return /drop|chandelier|emerald|sapphire/i.test(name) || /chandelier/i.test(desc);
        }
        if (selectedStyle === 'gold') {
          return /gold|22k|yellow gold/i.test(name) || /22k/i.test(p.metal || '') || tags.includes('gold');
        }
        return true;
      });
    }

    // Sort products
    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [rawProducts, selectedStyle, sort, metalFilter, priceFilter, searchTerm]);

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
          HERO SECTION — THREE-PANEL EDITORIAL HERO (MATCHING REFERENCE EXACTLY)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#08243A] text-white border-b border-[#0C2D46]">
        
        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] sm:min-h-[510px] lg:min-h-[530px] items-stretch">
            
            {/* -------------------------------------------------------------------
                LEFT PANEL: JEWELLERY LIFESTYLE PHOTOGRAPH (~33% desktop)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 relative min-h-[380px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-[#EAE2D7] order-2 lg:order-1">
              <Image
                src={slide.leftImage}
                alt={slide.leftAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center transition-all duration-700 ease-out"
              />

              {/* Decorative Champagne Gold Sparkle in Top-Right of Left Panel */}
              <span className="absolute top-10 right-8 text-[#D6B36A] text-lg select-none pointer-events-none drop-shadow-sm animate-pulse z-10">
                ✦
              </span>

              {/* Lower-left restrained decorative caption matching reference */}
              <div className="absolute bottom-8 left-8 z-10 select-none">
                <div className="flex flex-col font-serif text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#3A281E] font-medium leading-tight drop-shadow-xs">
                  <span>{slide.leftCaption[0]}</span>
                  <span>{slide.leftCaption[1]}</span>
                  <span>{slide.leftCaption[2]}</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                CENTRE PANEL: MIDNIGHT-BLUE EDITORIAL DESIGN (~34% desktop)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 relative flex flex-col justify-center items-center text-center px-6 sm:px-10 py-10 sm:py-14 bg-[#08243A] border-x border-[#0C2D46] z-10 order-1 lg:order-2 overflow-hidden">
              {/* Subtle botanical line illustration background watermark */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-no-repeat bg-contain bg-bottom-left"
                style={{ backgroundImage: 'url(/images/gold/botanical-leaves.jpg)', mixBlendMode: 'screen' }}
                aria-hidden="true"
              />

              {/* Top Muted-Blue Label: WINTER NEW ARRIVALS */}
              <div className="relative z-10 mb-3">
                <span className="inline-block bg-[#1B3C53]/90 text-[#CFE2ED] px-4 py-1.5 rounded-sm uppercase text-[10px] sm:text-[11px] font-sans tracking-[0.2em] font-medium shadow-xs border border-[#2B5470]/40">
                  {slide.badge}
                </span>
              </div>

              {/* Delicate Ornamental Gold Divider with Central Star */}
              <div className="relative z-10 flex items-center justify-center gap-3 w-40 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D6B36A] to-[#D6B36A]" />
                <span className="text-[#D6B36A] text-xs">✦</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D6B36A] to-[#D6B36A]" />
              </div>

              {/* Large Centred Uppercase Serif Headline over Three Lines */}
              <div className="relative z-10 space-y-1 mb-6">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] leading-[1.08] tracking-widest text-white uppercase font-normal drop-shadow-sm">
                  {slide.line1}
                </h1>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] leading-[1.08] tracking-widest text-white uppercase font-normal drop-shadow-sm">
                  {slide.line2}
                </h2>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] leading-[1.08] tracking-widest text-white uppercase font-normal drop-shadow-sm">
                  {slide.line3}
                </h3>
              </div>

              {/* Supporting Paragraph */}
              <p className="relative z-10 font-sans text-xs sm:text-sm text-[#B2C9D6] font-light leading-relaxed max-w-sm mx-auto mb-8 px-2">
                {slide.description}
              </p>

              {/* Refined Outlined CTA Button */}
              <div className="relative z-10">
                <button
                  onClick={scrollToCollection}
                  className="group inline-flex items-center gap-3 px-8 sm:px-9 py-3 rounded-full border border-white/85 text-white hover:border-[#D6B36A] hover:bg-[#D6B36A] hover:text-[#08243A] bg-transparent text-xs sm:text-[13px] font-sans font-medium tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B36A]"
                  aria-label="Explore our earrings collection"
                >
                  <span>Explore Earrings</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT PANEL: STATEMENT EARRING PHOTOGRAPH & STRIP (~33% desktop)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 relative flex items-stretch order-3">
              {/* Main Statement Earring Model Photograph */}
              <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] lg:min-h-full overflow-hidden bg-[#1E1410]">
                <Image
                  src={slide.rightImage}
                  alt={slide.rightAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover object-center transition-all duration-700 ease-out"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#08243A]/40 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Narrow Far-Right Dark Decorative Strip */}
              <div className="hidden sm:flex flex-col justify-between items-center py-8 px-3 sm:px-4 bg-[#051827] border-l border-[#0C2D46] z-10 select-none">
                {/* Thin vertical accent */}
                <div className="w-px h-8 bg-[#D6B36A]/50 pt-2" />

                {/* Vertical Stacked Text: BEAUTY THAT STAYS FOREVER */}
                <div className="my-auto py-6 text-center">
                  <div className="flex flex-col items-center gap-1 font-serif text-[10px] uppercase tracking-[0.28em] text-[#D6B36A]/90 font-light leading-tight">
                    <span className="font-semibold text-white">{slide.rightTagline[0]}</span>
                    <span>{slide.rightTagline[1]}</span>
                    <span>{slide.rightTagline[2]}</span>
                    <span className="text-[#D6B36A]">{slide.rightTagline[3]}</span>
                  </div>
                </div>

                {/* Ornamental Gold Sparkle */}
                <span className="text-[#D6B36A] text-xs my-2">✦</span>

                {/* Slide Counter & Minimal Prev/Next Controls */}
                <div className="flex flex-col items-center gap-2.5 pb-2">
                  <div className="font-mono text-xs tracking-wider text-[#D6B36A]">
                    <span className="font-bold text-white">0{currentSlide + 1}</span>
                    <span className="text-[#5B7885] mx-1">/</span>
                    <span className="text-[#5B7885]">0{HERO_SLIDES.length}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrevSlide}
                      className="w-7 h-7 rounded-full border border-[#143B57] bg-[#09253B]/70 hover:bg-[#D6B36A] hover:text-[#08243A] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="w-7 h-7 rounded-full border border-[#143B57] bg-[#09253B]/70 hover:bg-[#D6B36A] hover:text-[#08243A] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
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
          EARRINGS COLLECTION SECTION (#collection) — WARM IVORY ATELIER
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
                  THE EARRINGS COLLECTION
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-[#1D1C16]">
                Our Earrings Collection
              </h2>
              <p className="mt-2 text-xs text-[#716D64]">Showing {displayedProducts.length} earrings</p>
            </div>

            {/* Right: Sort by & Filter controls matching reference */}
            <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto">
              <input aria-label="Search earrings" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search earrings" className="w-32 sm:w-44 rounded-md border border-[#D6CBB8] bg-white px-3 py-2 text-xs" />
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
                  filterDrawerOpen || selectedStyle !== 'all' || metalFilter !== 'all' || priceFilter !== 'all'
                    ? 'border-[#650B19] bg-[#650B19] text-white'
                    : 'border-[#650B19] bg-transparent text-[#650B19] hover:bg-[#650B19]/10'
                }`}
                aria-label="Filter earrings jewellery"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {(selectedStyle !== 'all' || metalFilter !== 'all' || priceFilter !== 'all') && (
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
                  <span>Refine Earrings Silhouette</span>
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-[#716D64] hover:text-[#2A1810]"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D]">Metal
                  <select value={metalFilter} onChange={(event) => setMetalFilter(event.target.value)} className="mt-1 block w-full rounded border border-[#D6CBB8] bg-white p-2 text-xs normal-case tracking-normal"><option value="all">All metals</option><option value="Gold">Gold</option><option value="Diamond">Diamond</option><option value="Silver">Silver</option><option value="Rose Gold">Rose Gold</option></select>
                </label>
                <label className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D]">Price range
                  <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="mt-1 block w-full rounded border border-[#D6CBB8] bg-white p-2 text-xs normal-case tracking-normal"><option value="all">All prices</option><option value="under10000">Under ₹10,000</option><option value="10000-25000">₹10,000 – ₹25,000</option><option value="25000-50000">₹25,000 – ₹50,000</option><option value="above50000">Above ₹50,000</option></select>
                </label>
              </div>
              <div>
                <p className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D] mb-2.5">
                  Earring Style &amp; Silhouette
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Pairs' },
                    { id: 'jhumka', label: 'Temple Jhumkas & Chandbalis' },
                    { id: 'studs', label: 'Solitaire Studs & Balis' },
                    { id: 'drops', label: 'Drops & Chandelier Earrings' },
                    { id: 'gold', label: '22KT Heritage Gold' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedStyle(tab.id)}
                      className={`px-3 py-1.5 text-xs font-sans rounded-full transition-colors ${
                        selectedStyle === tab.id
                          ? 'bg-[#650B19] text-white font-medium'
                          : 'bg-[#F8F5EF] text-[#524B42] hover:bg-[#EFE9DF]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedStyle !== 'all' || metalFilter !== 'all' || priceFilter !== 'all' || Boolean(searchTerm)) && (
                <div className="mt-4 pt-3 border-t border-[#EFEAE2] flex justify-end">
                  <button
                    onClick={() => { setSelectedStyle('all'); setMetalFilter('all'); setPriceFilter('all'); setSearchTerm(''); }}
                    className="text-xs text-[#8B1E2D] font-medium hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          <p className="mb-4 border border-[#E6DFD3] bg-white/80 px-4 py-3 text-[11px] leading-5 text-[#716D64]">Indicative Catalogue Price — Final price subject to confirmed product specifications and quotation.</p>
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl p-3 border border-[#E6DFD3] animate-pulse aspect-[3/4]"
                />
              ))}
            </div>
          )}

          {/* -------------------------------------------------------------------
              PRODUCT GRID (FOUR COLUMNS ON LARGE DESKTOP)
             ------------------------------------------------------------------- */}
          {!isLoading && displayedProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayedProducts.map((product) => <ProductCard key={product._id || product.id || product.slug} product={product} />)}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayedProducts.length === 0 && (
            <div className="bg-white rounded-xl border border-[#E6DFD3] p-10 text-center max-w-md mx-auto my-10 shadow-xs">
              <p className="font-serif text-base text-[#2A1810] mb-2">
                No earrings match your filter criteria.
              </p>
              <p className="font-sans text-xs text-[#716D64] mb-5">
                Reset your filter to view the entire Rishi Lal Earrings Collection.
              </p>
              <button
                onClick={() => { setSelectedStyle('all'); setMetalFilter('all'); setPriceFilter('all'); setSearchTerm(''); }}
                className="px-5 py-2 bg-[#650B19] text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-[#8B1E2D] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          HERITAGE TRUST & PILLARS BAR
         ========================================================================= */}
      <section className="bg-[#EFEAE2] border-t border-[#E2DBD1] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  AI-Generated Concepts
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  These images are illustrative designs, not verified product photographs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Gem className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Specifications on Enquiry
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Metal, purity, stone details and certification require business confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Indicative Catalogue Prices
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Estimates are not supplier quotations, market valuations or final prices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Truck className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Design Enquiry
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Concepts cannot be purchased until price and availability are approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

