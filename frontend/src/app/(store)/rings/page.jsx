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
  Gem,
  CircleDot
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';
import { useWishlist } from '@/context/WishlistContext';

// Carousel slide data for the three-panel Rings editorial hero
const HERO_SLIDES = [
  {
    badge: 'TIMELESS RINGS',
    line1: 'NEW SEASON',
    line2: 'NEW',
    line3: 'COLLECTION',
    highlight: 'RINGS',
    description:
      'Discover our exclusive rings collection, where modern designs meet timeless elegance. From everyday wear to special occasions, find the perfect ring for every story.',
    leftImage: '/images/rings/rings-hero-left.jpg',
    leftAlt: 'Woman displaying an elegant diamond ring on her hand',
    rightImage: '/images/rings/rings-hero-right.jpg',
    rightAlt: 'Woman wearing a statement diamond engagement ring with bridal lace dress',
    leftCaption: ['A SYMBOL', 'OF LOVE', 'IN EVERY', 'CIRCLE'],
    rightTagline: ['FOREVER', 'BEGINS', 'WITH A', 'RING'],
  },
  {
    badge: 'ROYAL COCKTAIL ATELIER',
    line1: 'IMPERIAL RUBY',
    line2: '& POLKI',
    line3: 'COCKTAIL',
    highlight: 'CREATIONS',
    description:
      'Natural unheated Burma rubies and Colombian emeralds framed by uncut syndicate polki diamonds in 22KT antique gold floral filigree.',
    leftImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    leftAlt: 'Royal Mughal ruby cocktail ring in luxury showcase',
    rightImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    rightAlt: 'Close-up of diamond pavé and gemstone engagement ring',
    leftCaption: ['CRAFTED', 'WITH SOUL', 'AND FIRE'],
    rightTagline: ['COLOURS', 'OF ROYAL', 'MAJESTY'],
  },
  {
    badge: 'ETERNAL BANDS & SIGNETS',
    line1: 'SOVEREIGN SIGNETS',
    line2: '& DIAMOND',
    line3: 'WEDDING',
    highlight: 'BANDS',
    description:
      'Substantial 22KT solid gold signet rings with Ashoka lion fluting and continuous round-brilliant diamond pavé eternity bands.',
    leftImage: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
    leftAlt: 'Men solid gold lion signet ring',
    rightImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    rightAlt: 'Royal wedding gold and diamond rings collection',
    leftCaption: ['BOUND FOR', 'A LIFETIME', 'OF GRACE'],
    rightTagline: ['TIMELESS', 'HERITAGE', 'SIGNATURE'],
  },
];

// Fallback products matching the exact reference cards in case of initial load or empty DB records
const FALLBACK_RINGS_PRODUCTS = [
  {
    _id: 'fb-rg-1',
    name: 'Solitaire Diamond Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    price: 185000,
    category: 'Rings',
    image: '/images/rings/products/solitaire-diamond-ring.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-rg-2',
    name: 'Wedding Band Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    price: 110000,
    category: 'Rings',
    image: '/images/rings/products/wedding-band-ring.jpg',
    metal: '18K Yellow Gold',
  },
  {
    _id: 'fb-rg-3',
    name: 'Ruby Gold Ring',
    slug: 'royal-mughal-ruby-uncut-diamond-cocktail-ring',
    price: 98000,
    category: 'Rings',
    image: '/images/rings/products/ruby-gold-ring.jpg',
    metal: '22K Yellow Gold',
  },
  {
    _id: 'fb-rg-4',
    name: 'Emerald Ring',
    slug: 'navratna-royal-nine-gem-heritage-ring',
    price: 145000,
    category: 'Rings',
    image: '/images/rings/products/emerald-ring.jpg',
    metal: '18K Yellow Gold',
  },
  {
    _id: 'fb-rg-5',
    name: 'Floral Diamond Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    price: 125000,
    category: 'Rings',
    image: '/images/rings/products/floral-diamond-ring.jpg',
    metal: '18K White Gold',
  },
  {
    _id: 'fb-rg-6',
    name: 'Gold Ring (Mens)',
    slug: 'sultan-mens-22k-solid-gold-lion-signet-ring',
    price: 92000,
    category: 'Rings',
    image: '/images/rings/products/gold-ring-mens.jpg',
    metal: '22K Yellow Gold',
  },
];

export default function RingsLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('all');

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query genuine rings products from backend API
  const { data, isLoading } = useQuery({
    queryKey: ['rings-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'rings',
        sort: sort === 'featured' ? undefined : sort,
        limit: 48,
      }),
  });

  const rawProducts = data?.products && data.products.length > 0 ? data.products : FALLBACK_RINGS_PRODUCTS;

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by style
    if (selectedStyle !== 'all') {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        if (selectedStyle === 'solitaire') {
          return /solitaire|diamond|crown|floral/i.test(name) || tags.some((t) => ['solitaire', 'diamond'].includes(t));
        }
        if (selectedStyle === 'band') {
          return /band|wedding|eternity/i.test(name) || /band/i.test(desc) || tags.includes('band');
        }
        if (selectedStyle === 'gemstone') {
          return /ruby|emerald|navratna|gem/i.test(name) || /gemstone/i.test(desc) || tags.some((t) => ['ruby', 'navratna', 'gemstone'].includes(t));
        }
        if (selectedStyle === 'mens') {
          return /men|signet|lion|sultan/i.test(name) || p.gender === 'men' || tags.includes('men');
        }
        if (selectedStyle === 'gold') {
          return /gold|22k|yellow gold/i.test(name) || /22k/i.test(p.metal || '') || tags.includes('gold');
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

    // Ensure we always have our 6 showcase reference items available for display
    if (list.length < 6 && selectedStyle === 'all') {
      const existingSlugs = new Set(list.map((p) => p.slug));
      const extras = FALLBACK_RINGS_PRODUCTS.filter((fb) => !existingSlugs.has(fb.slug));
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
          HERO SECTION: 3-PANEL LUXURY EDITORIAL COMPOSITION (#08243A)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#08243A] overflow-hidden border-b border-[#D6B36A]/20">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] xl:min-h-[560px]">
            
            {/* ─────────────────────────────────────────────────────────────
                LEFT PANEL: Woman displaying diamond ring on hand
            ───────────────────────────────────────────────────────────── */}
            <div className="relative lg:col-span-4 h-[380px] lg:h-auto overflow-hidden group">
              <Image
                src={slide.leftImage}
                alt={slide.leftAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Lower-left decorative caption */}
              <div className="absolute bottom-6 left-6 z-10 flex items-start gap-2.5">
                <span className="w-0.5 h-11 bg-[#D6B36A] mt-0.5 shrink-0 opacity-90 shadow-[0_0_8px_rgba(214,179,106,0.6)]" />
                <div className="text-[#F8F1E7] font-sans tracking-[0.25em] text-[10px] sm:text-[11px] leading-relaxed uppercase font-medium drop-shadow-md">
                  {slide.leftCaption.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                CENTRE PANEL: Midnight-Blue Editorial Content
            ───────────────────────────────────────────────────────────── */}
            <div className="relative lg:col-span-5 bg-gradient-to-b from-[#08243A] via-[#061C2D] to-[#08243A] px-6 sm:px-10 lg:px-8 xl:px-12 py-12 sm:py-16 flex flex-col items-center justify-center text-center border-y lg:border-y-0 lg:border-x border-[#D6B36A]/15 overflow-hidden">
              
              {/* Subtle Botanical Line Illustrations Watermark */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.07] flex items-center justify-center">
                <svg
                  className="w-full h-full max-w-[550px] text-[#D6B36A]"
                  viewBox="0 0 400 400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                >
                  <path d="M200 30 C160 90, 80 130, 40 200 C80 270, 160 310, 200 370 C240 310, 320 270, 360 200 C320 130, 240 90, 200 30 Z" />
                  <path d="M200 70 C175 115, 115 145, 85 200 C115 255, 175 285, 200 330 C225 285, 285 255, 315 200 C285 145, 225 115, 200 70 Z" />
                  <circle cx="200" cy="200" r="45" strokeDasharray="3 3" />
                  <circle cx="200" cy="200" r="15" />
                </svg>
              </div>

              {/* Top rectangular muted-blue label */}
              <div className="relative z-10 mb-4 inline-flex items-center px-4 py-1.5 rounded-sm bg-[#0C324E]/70 border border-[#D6B36A]/30 backdrop-blur-xs">
                <span className="text-[#D6B36A] font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-semibold">
                  {slide.badge}
                </span>
              </div>

              {/* Minimal gold ornamental divider */}
              <div className="relative z-10 flex items-center justify-center gap-3 mb-6 w-full max-w-[200px]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D6B36A]/60" />
                <span className="text-[#D6B36A] text-xs">✦</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D6B36A]/60" />
              </div>

              {/* Headline */}
              <h1 className="relative z-10 font-serif text-white tracking-[0.08em] uppercase text-2xl sm:text-3xl xl:text-4xl leading-tight text-center mb-1">
                <span>{slide.line1}</span>
                <br />
                <span>{slide.line2}</span>
                <br />
                <span>{slide.line3}</span>
              </h1>
              
              {/* Champagne Gold Highlight: "RINGS" */}
              <div className="relative z-10 font-serif text-[#D6B36A] tracking-[0.15em] uppercase text-2xl sm:text-3xl xl:text-4xl font-normal mb-5 drop-shadow-[0_2px_12px_rgba(214,179,106,0.3)]">
                {slide.highlight}
              </div>

              {/* Supporting paragraph */}
              <p className="relative z-10 text-[#F8F1E7]/80 font-sans text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-8 font-light tracking-wide">
                {slide.description}
              </p>

              {/* Outlined CTA button */}
              <a
                href="#collection"
                onClick={scrollToCollection}
                className="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-xs border border-[#F8F1E7]/80 hover:border-[#D6B36A] bg-transparent text-[#F8F1E7] hover:text-[#08243A] hover:bg-[#D6B36A] transition-all duration-300 font-sans uppercase tracking-[0.2em] text-xs font-medium shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#D6B36A]/50"
              >
                <span>Explore Rings</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT PANEL: Statement Diamond Ring Editorial Portrait
            ───────────────────────────────────────────────────────────── */}
            <div className="relative lg:col-span-2 xl:col-span-2 h-[340px] lg:h-auto overflow-hidden group">
              <Image
                src={slide.rightImage}
                alt={slide.rightAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            </div>

            {/* ─────────────────────────────────────────────────────────────
                FAR-RIGHT DECORATIVE STRIP (Vertical strip)
            ───────────────────────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:col-span-1 xl:col-span-1 bg-[#061826] border-l border-[#D6B36A]/15 py-8 px-3 flex-col items-center justify-between text-center select-none">
              
              {/* Top vertical accent line */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#D6B36A]/80" />
                <div className="text-[#F8F1E7]/85 font-sans uppercase tracking-[0.22em] text-[10px] leading-tight font-medium writing-mode-vertical">
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
                THE RINGS COLLECTION
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] tracking-tight">
                Our Rings Collection
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

          {/* Quick Style Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none text-xs font-sans">
            {[
              { id: 'all', label: 'All Rings' },
              { id: 'solitaire', label: 'Solitaire & Diamonds' },
              { id: 'band', label: 'Wedding & Eternity Bands' },
              { id: 'gemstone', label: 'Ruby & Gemstone Rings' },
              { id: 'mens', label: "Men's Signet Rings" },
              { id: 'gold', label: '22K Solid Gold' },
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
              <CircleDot className="w-10 h-10 text-[#C2AA6A] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg text-emerald-950 mb-1">No rings found for this filter</h3>
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
                  '/images/rings/products/solitaire-diamond-ring.jpg';

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
                            {product.metal.replace('Yellow Gold', 'Gold').replace('White Gold', 'Platinum')}
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
                Government certified purity with HUID authenticity on every ring.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">IGI &amp; GIA Diamonds</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Natural, conflict-free certified solitaires of exceptional fire.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">Lifetime Exchange</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Guaranteed buyback and exchange value across all RL boutiques.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#EFE7DA] text-[#650B19] flex items-center justify-center mb-2.5">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-sm text-[#1A1A1A] font-medium mb-0.5">Insured Delivery</h4>
              <p className="font-sans text-[11px] text-charcoal-500 max-w-[180px]">
                Secure armored courier delivery with tamper-proof packaging.
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
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Filter Rings</h3>
                  <p className="text-[11px] font-sans text-charcoal-500">Curate your ideal creation</p>
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
                    Ring Category
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'All Rings' },
                      { id: 'solitaire', label: 'Solitaire & Diamond Rings' },
                      { id: 'band', label: 'Wedding Bands & Eternity' },
                      { id: 'gemstone', label: 'Burma Ruby & Gemstones' },
                      { id: 'mens', label: "Men's Solid Gold Signets" },
                      { id: 'gold', label: '22KT Pure Gold Rings' },
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

