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
  Circle
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';
import { useWishlist } from '@/context/WishlistContext';

// Carousel slide data for the Bangles editorial hero
const HERO_SLIDES = [
  {
    eyebrow1: 'TRADITION MEETS',
    eyebrow2: 'MODERN ELEGANCE',
    titleLine1: 'TIMELESS',
    titleLine2: 'BANGLES',
    titleLine3: 'FOR EVERY YOU',
    description:
      'Discover our exquisite bangles collection, where heritage craftsmanship meets modern style. From everyday elegance to bridal splendour, find the perfect pair for every moment.',
    tagline: 'PURE — TRADITIONAL — EVERLASTING',
    mainImage: '/images/bangles/bangles-hero-main.jpg',
    mainAlt: 'Indian bride wearing layered traditional 22KT gold bangles on both wrists',
    insetVisible: true,
    insetImage: '/images/bangles/bangles-hero-inset.jpg',
    insetAlt: 'Traditional gold, ruby, and emerald gemstone bangles in dark wood luxury casket',
    rightTagline: ['A', 'LEGACY', 'IN EVERY', 'CIRCLE'],
  },
  {
    eyebrow1: 'ROYAL RAJPUTANA',
    eyebrow2: 'HERITAGE ATELIER',
    titleLine1: 'IMPERIAL',
    titleLine2: 'KADAS',
    titleLine3: '& MEENAKARI',
    description:
      'Substantial die-struck 22KT solid gold kadas adorned with hand-carved royal elephant heads, ruby eyes, and vibrant Jaipur enamel blossoms.',
    tagline: 'ROYAL — HAND-CARVED — HEIRLOOM',
    mainImage: '/images/categories/traditional.jpg',
    mainAlt: 'Royal Indian bride wearing heavy antique gold kadas',
    insetVisible: false,
    insetImage: '/images/bangles/products/bridal-gold-bangle.jpg',
    insetAlt: 'Antique 22KT gold bridal bangles pair',
    rightTagline: ['HERITAGE', 'FORGED IN', 'SOLID', 'GOLD'],
  },
  {
    eyebrow1: 'HIGH JEWELLERY',
    eyebrow2: 'BRILLIANCE',
    titleLine1: 'ETERNAL',
    titleLine2: 'TENNIS',
    titleLine3: 'BRACELETS',
    description:
      'Continuous streams of brilliant natural solitaires set in 18K rose gold and white gold with precision double safety clasp engineering.',
    tagline: 'EFFORTLESS — CONTEMPORARY — LUXURY',
    mainImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    mainAlt: 'Diamond tennis bracelet and rose gold bangles stack',
    insetVisible: false,
    insetImage: '/images/bangles/products/gold-kada.jpg',
    insetAlt: 'Handcrafted gold filigree kada',
    rightTagline: ['SPARKLE', 'THAT LASTS', 'FOR', 'GENERATIONS'],
  },
];

// Fallback products matching the exact reference cards
const FALLBACK_BANGLES_PRODUCTS = [
  {
    _id: 'fb-bg-1',
    name: 'Traditional Gold Bangle',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    price: 125000,
    category: 'Bangles',
    image: '/images/bangles/products/traditional-gold-bangle.jpg',
    metal: '22K Yellow Gold',
  },
  {
    _id: 'fb-bg-2',
    name: 'Bridal Gold Bangle',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    price: 235000,
    category: 'Bangles',
    image: '/images/bangles/products/bridal-gold-bangle.jpg',
    metal: '22K Yellow Gold',
  },
  {
    _id: 'fb-bg-3',
    name: 'Daily Wear Bangles',
    slug: 'aarav-baby-22k-gold-nazariya-bracelet-pair',
    price: 78000,
    category: 'Bangles',
    image: '/images/bangles/products/daily-wear-bangles.jpg',
    metal: '18K Yellow Gold',
  },
  {
    _id: 'fb-bg-4',
    name: 'Gold Kada',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    price: 110000,
    category: 'Bangles',
    image: '/images/bangles/products/gold-kada.jpg',
    metal: '22K Yellow Gold',
  },
  {
    _id: 'fb-bg-5',
    name: 'Temple Bangles',
    slug: 'meenakari-hand-painted-floral-22k-gold-bangle',
    price: 110000,
    category: 'Bangles',
    image: '/images/bangles/products/temple-bangles.jpg',
    metal: '22K Yellow Gold',
  },
  {
    _id: 'fb-bg-6',
    name: 'Designer Bangles',
    slug: 'eternal-rose-diamond-tennis-bracelet-3-00-ct',
    price: 48000,
    category: 'Bangles',
    image: '/images/bangles/products/designer-bangles.jpg',
    metal: '18K Rose Gold',
  },
];

export default function BanglesLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('all');

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query genuine bangles products from backend API
  const { data, isLoading } = useQuery({
    queryKey: ['bangles-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'bangles',
        sort: sort === 'featured' ? undefined : sort,
        limit: 48,
      }),
  });

  const rawProducts = data?.products && data.products.length > 0 ? data.products : FALLBACK_BANGLES_PRODUCTS;

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by style
    if (selectedStyle !== 'all') {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        if (selectedStyle === 'traditional') {
          return /traditional|temple|antique|elephant|jadau/i.test(name) || tags.some((t) => ['traditional', 'temple', 'antique'].includes(t));
        }
        if (selectedStyle === 'bridal') {
          return /bridal|kada|kadas|heavy|wedding/i.test(name) || p.isBridal || tags.includes('bridal');
        }
        if (selectedStyle === 'daily') {
          return /daily|sleek|rope|chain|bracelet|nazariya/i.test(name) || /daily/i.test(desc) || tags.includes('daily');
        }
        if (selectedStyle === 'kada') {
          return /kada|kadas|elephant|signet/i.test(name) || tags.includes('kadas');
        }
        if (selectedStyle === 'gemstone') {
          return /ruby|emerald|meenakari|diamond|tennis/i.test(name) || /enamel|gemstone/i.test(desc) || tags.some((t) => ['meenakari', 'diamond'].includes(t));
        }
        return true;
      });
    }

    // Sort products
    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    // Complement with showcase reference items to ensure 6 complete cards
    if (list.length < 6 && selectedStyle === 'all') {
      const existingSlugs = new Set(list.map((p) => p.slug));
      const extras = FALLBACK_BANGLES_PRODUCTS.filter((fb) => !existingSlugs.has(fb.slug));
      list = [...list, ...extras].slice(0, 6);
    }

    return list;
  }, [rawProducts, sort, selectedStyle]);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const scrollToCollection = (e) => {
    e.preventDefault();
    const elem = document.getElementById('collection');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-[#2B2B2B]">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION: 3-PART LUXURY EDITORIAL COMPOSITION (#4A100D)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#4A100D] overflow-hidden border-b border-[#D6B36A]/20">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] xl:min-h-[550px]">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT TEXT PANEL: Rich Burgundy Editorial Content
            ───────────────────────────────────────────────────────────── */}
            <div className="relative lg:col-span-5 bg-gradient-to-br from-[#4A100D] via-[#350B09] to-[#2A0605] px-6 sm:px-10 lg:px-12 py-12 sm:py-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#D6B36A]/15 overflow-hidden">
              
              {/* Subtle Botanical/Lotus Line Watermark */}
              <div className="absolute -left-12 -top-12 pointer-events-none opacity-[0.09] w-80 h-80">
                <svg
                  className="w-full h-full text-[#D6B36A]"
                  viewBox="0 0 200 200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                >
                  <path d="M100 20 C85 60, 45 80, 20 100 C60 115, 80 155, 100 180 C120 155, 140 115, 180 100 C155 80, 115 60, 100 20 Z" />
                  <path d="M100 50 C90 75, 65 90, 50 100 C75 110, 90 135, 100 150 C110 135, 125 110, 150 100 C125 90, 110 75, 100 50 Z" />
                  <circle cx="100" cy="100" r="20" strokeDasharray="2 2" />
                </svg>
              </div>

              {/* Eyebrow */}
              <div className="relative z-10 mb-3">
                <span className="text-[#D6B36A] font-sans uppercase tracking-[0.22em] text-[10px] sm:text-[11px] font-semibold block leading-tight">
                  {slide.eyebrow1}
                  <br />
                  {slide.eyebrow2}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="relative z-10 font-serif text-white tracking-[0.06em] uppercase text-3xl sm:text-4xl xl:text-[2.75rem] leading-[1.08] mb-4">
                <span>{slide.line1 || slide.titleLine1}</span>
                <br />
                <span className="text-[#D6B36A] font-normal drop-shadow-[0_2px_12px_rgba(214,179,106,0.35)]">
                  {slide.titleLine2}
                </span>
                <br />
                <span>{slide.titleLine3}</span>
              </h1>

              {/* Fine Gold Divider with diamond motif */}
              <div className="relative z-10 flex items-center gap-3 my-2 w-full max-w-[240px]">
                <div className="h-px flex-1 bg-gradient-to-r from-[#D6B36A]/70 to-transparent" />
                <span className="text-[#D6B36A] text-xs">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#D6B36A]/70 to-transparent" />
              </div>

              {/* Supporting Copy */}
              <p className="relative z-10 text-[#F8F1E7]/80 font-sans text-xs sm:text-sm leading-relaxed max-w-md my-4 font-light tracking-wide">
                {slide.description}
              </p>

              {/* Outlined Pill CTA Button */}
              <div className="relative z-10 mt-3 mb-6">
                <a
                  href="#collection"
                  onClick={scrollToCollection}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full border border-[#D6B36A] bg-transparent text-[#F8F1E7] hover:bg-[#D6B36A] hover:text-[#350B09] transition-all duration-300 font-sans uppercase tracking-[0.2em] text-xs font-semibold shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#D6B36A]/50"
                >
                  <span>EXPLORE BANGLES</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/* Tagline below CTA button */}
              <div className="relative z-10 flex items-center gap-3 pt-2">
                <span className="w-8 h-px bg-[#D6B36A]/60" />
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#D6B36A]/90 font-medium">
                  {slide.tagline}
                </span>
              </div>

            </div>

            {/* ─────────────────────────────────────────────────────────────
                CENTRE PANEL: Main Lifestyle Photograph + Inset Overlay
            ───────────────────────────────────────────────────────────── */}
            <div className="relative lg:col-span-6 h-[400px] sm:h-[460px] lg:h-auto overflow-hidden group">
              <Image
                src={slide.mainImage}
                alt={slide.mainAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Overlapping Secondary Photograph (Lower-right area) */}
              {slide.insetVisible && (
                <div className="absolute bottom-5 right-5 z-20 w-[140px] sm:w-[170px] lg:w-[190px] aspect-4/5 rounded-xs overflow-hidden border-2 border-[#D6B36A] shadow-2xl transition-transform duration-500 hover:scale-105">
                  <Image
                    src={slide.insetImage}
                    alt={slide.insetAlt}
                    fill
                    sizes="(max-width: 640px) 140px, 190px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 ring-1 ring-black/20 pointer-events-none" />
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT DECORATIVE PANEL: Far-Right Strip
            ───────────────────────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:col-span-1 bg-[#2C0806] border-l border-[#D6B36A]/15 py-8 px-3 flex-col items-center justify-between text-center select-none">
              
              {/* Circular lotus ornament */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#D6B36A]/60 flex items-center justify-center p-1.5 shadow-[0_0_10px_rgba(214,179,106,0.2)]">
                  <svg
                    className="w-full h-full text-[#D6B36A]"
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M20 6 C17 14, 12 18, 6 20 C12 22, 17 26, 20 34 C23 26, 28 22, 34 20 C28 18, 23 14, 20 6 Z" />
                    <circle cx="20" cy="20" r="3" fill="currentColor" />
                  </svg>
                </div>

                {/* Vertical uppercase text: A LEGACY IN EVERY CIRCLE */}
                <div className="text-[#F8F1E7]/85 font-sans uppercase tracking-[0.22em] text-[10px] leading-tight font-medium my-2">
                  {slide.rightTagline.map((word, idx) => (
                    <div key={idx} className="my-0.5">{word}</div>
                  ))}
                </div>

                <div className="w-px h-8 bg-[#D6B36A]/60" />
                <span className="text-[#D6B36A] text-xs">✦</span>
              </div>

              {/* Slide Counter & Carousel Arrows */}
              <div className="flex flex-col items-center gap-3 mt-auto">
                <span className="font-sans text-[11px] tracking-widest text-[#F8F1E7]/70 font-medium">
                  {`0${currentSlide + 1} / 0${HERO_SLIDES.length}`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Previous Slide"
                    className="w-7 h-7 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#D6B36A] hover:bg-[#D6B36A]/10 flex items-center justify-center transition-colors text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    aria-label="Next Slide"
                    className="w-7 h-7 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#D6B36A] hover:bg-[#D6B36A]/10 flex items-center justify-center transition-colors text-xs"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COLLECTION SECTION: Warm Ivory Background (#F8F1E7)
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="collection" className="w-full bg-[#F8F1E7] py-10 sm:py-14 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E6DFD3] mb-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#8B1E2D] font-semibold mb-1.5 flex items-center gap-2">
                <span className="w-6 h-px bg-[#8B1E2D]" />
                THE BANGLES COLLECTION
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] tracking-tight">
                Our Bangles Collection
              </h2>
            </div>

            {/* Controls: Sort Dropdown & Filter Drawer Button */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white border border-[#D5CDC0] text-[#2B2B2B] text-xs font-sans pl-3 pr-8 py-2 rounded-xs focus:outline-none focus:border-[#650B19] cursor-pointer hover:border-[#8B1E2D] transition-colors shadow-2xs"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans uppercase tracking-wider font-semibold rounded-xs border border-[#650B19] text-[#650B19] bg-white hover:bg-[#650B19] hover:text-white transition-all duration-200 shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Quick Style Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none text-xs font-sans">
            {[
              { id: 'all', label: 'All Bangles' },
              { id: 'traditional', label: 'Traditional Gold Bangles' },
              { id: 'bridal', label: 'Bridal Sets & Kadas' },
              { id: 'daily', label: 'Daily Wear & Sleek' },
              { id: 'kada', label: 'Royal Elephant Kadas' },
              { id: 'gemstone', label: 'Meenakari & Gemstones' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedStyle(item.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedStyle === item.id
                    ? 'bg-[#650B19] text-white font-medium shadow-xs'
                    : 'bg-white border border-[#D5CDC0] text-[#4A4A4A] hover:border-[#650B19] hover:text-[#650B19]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              PRODUCT GRID: 6-COLUMN RESPONSIVE LAYOUT MATCHING REFERENCE
          ═════════════════════════════════════════════════════════════════ */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xs p-3 animate-pulse border border-[#E6DFD3]">
                  <div className="w-full h-32 bg-[#EBE4D8] rounded-xs mb-3" />
                  <div className="h-3 bg-[#EBE4D8] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#EBE4D8] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xs border border-[#E6DFD3] p-8">
              <Circle className="w-10 h-10 text-[#C2AA6A] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg text-emerald-950 mb-1">No bangles found for this filter</h3>
              <p className="text-xs font-sans text-charcoal-500 mb-4">
                Try selecting a different style or reset to view all creations.
              </p>
              <button
                onClick={() => setSelectedStyle('all')}
                className="px-4 py-2 bg-[#650B19] text-white text-xs uppercase font-sans tracking-wider rounded-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {displayedProducts.map((product) => {
                const isFavorited = isInWishlist(product._id);
                const displayImage =
                  product.image ||
                  (product.images && product.images[0]) ||
                  '/images/bangles/products/traditional-gold-bangle.jpg';

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xs border border-[#E6DFD3] hover:border-[#D6B36A] transition-all duration-300 hover:shadow-md flex flex-col overflow-hidden"
                  >
                    {/* Product Card Image Container */}
                    <div className="relative w-full aspect-4/3 bg-[#F4EFE6] overflow-hidden">
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <Image
                          src={displayImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                      </Link>

                      {/* Wishlist toggle heart button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#650B19] flex items-center justify-center transition-colors shadow-xs z-10"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFavorited ? 'fill-[#650B19] text-[#650B19]' : 'text-[#4A4A4A]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Card Details */}
                    <div className="p-3 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-sans text-xs text-[#2B2B2B] group-hover:text-[#650B19] transition-colors line-clamp-1 font-normal mb-1">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-1 flex items-baseline justify-between">
                        <span className="font-sans text-xs font-semibold text-[#1A1A1A]">
                          {formatPrice(product.price)}
                        </span>
                        {product.metal && (
                          <span className="text-[10px] text-charcoal-500 font-sans truncate max-w-[70px]">
                            {product.metal.replace('Yellow Gold', 'Gold').replace('Rose Gold', 'Rose')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              LUXURY TRUST PILLARS
          ═════════════════════════════════════════════════════════════════ */}
          <div className="mt-14 pt-10 border-t border-[#E6DFD3] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">100% BIS Hallmarked</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Official 916 purity stamp with unique HUID laser engraving.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">Heritage Karigari</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Hand-carved die-struck masterworks by traditional craftsmen.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">Lifetime Buyback</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Guaranteed exchange and upgrade value at all official boutiques.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">Armored Transit</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                100% insured doorstep shipping in tamper-evident security vaulting.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          INTERACTIVE FILTER DRAWER (Slide-over)
      ═══════════════════════════════════════════════════════════════════ */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E6DFD3] flex items-center justify-between bg-[#F8F5EF]">
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Filter Bangles</h3>
                  <p className="text-[11px] font-sans text-charcoal-500">Curate your perfect pair</p>
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 font-sans text-xs">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#8B1E2D] mb-3">
                    Bangle Style
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'All Bangles & Kadas' },
                      { id: 'traditional', label: 'Traditional Gold Bangles' },
                      { id: 'bridal', label: 'Bridal Sets & Heavy Bangles' },
                      { id: 'daily', label: 'Daily Wear & Lightweight' },
                      { id: 'kada', label: 'Royal Elephant Kadas' },
                      { id: 'gemstone', label: 'Meenakari & Gemstones' },
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-[#333]">
                        <input
                          type="radio"
                          name="styleOption"
                          checked={selectedStyle === opt.id}
                          onChange={() => setSelectedStyle(opt.id)}
                          className="accent-[#650B19]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6DFD3]">
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#8B1E2D] mb-3">
                    Sort Preference
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'featured', label: 'Featured Curations' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                      { id: 'newest', label: 'Newest Arrivals' },
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-[#333]">
                        <input
                          type="radio"
                          name="sortOption"
                          checked={sort === opt.id}
                          onChange={() => setSort(opt.id)}
                          className="accent-[#650B19]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#F8F5EF] border-t border-[#E6DFD3] flex gap-3">
                <button
                  onClick={() => {
                    setSelectedStyle('all');
                    setSort('featured');
                  }}
                  className="flex-1 py-2.5 border border-[#D5CDC0] text-xs font-sans uppercase font-medium rounded-xs text-charcoal-700 hover:bg-white"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 bg-[#650B19] text-white text-xs font-sans uppercase font-semibold rounded-xs shadow-xs hover:bg-[#7e1022]"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

