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
  Check
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';
import { useWishlist } from '@/context/WishlistContext';

// Carousel slide data matching the editorial theme
const HERO_SLIDES = [
  {
    eyebrow: '#1 ON THE MARKET',
    titleLine1: 'UNIQUE',
    titleLine2: 'and AUTHENTIC',
    titleLine3: 'VINTAGE designer',
    titleLine4: 'JEWELLERY',
    italicWords: ['and', 'designer'],
    description:
      'Discover our gold collection, where timeless craftsmanship meets modern elegance. Each piece is designed to be cherished for generations.',
    tagline: 'PURE — PRECIOUS — EVERLASTING',
    mainImage: '/images/gold/editorial-gold-main.jpg',
    mainAlt: 'Editorial model wearing layered delicate gold necklaces and medallion pendants',
    secondaryImage: '/images/gold/editorial-gold-secondary.jpg',
    secondaryAlt: 'Woman in golden sunlight wearing layered delicate gold chains and rings',
  },
  {
    eyebrow: 'ROYAL HERITAGE ATELIER',
    titleLine1: 'ETERNAL',
    titleLine2: 'and OPULENT',
    titleLine3: 'TEMPLE nakshi',
    titleLine4: 'TREASURES',
    italicWords: ['and', 'nakshi'],
    description:
      'Sculpted in pure 22KT gold by hereditary Indian goldsmiths. Sacred temple motifs, divine Lakshmi repoussé, and handcrafted antique haars.',
    tagline: 'SACRED — HANDCRAFTED — HEIRLOOM',
    mainImage: '/images/gold/pure-gold-hero.png',
    mainAlt: 'Royal Indian bride adorned in pure 22KT gold jewelry in grand palace',
    secondaryImage: '/images/categories/traditional.jpg',
    secondaryAlt: 'Traditional 22KT gold wedding jewelry',
  },
  {
    eyebrow: 'THE BRIDAL SUITE',
    titleLine1: 'TIMELESS',
    titleLine2: 'and RADIANT',
    titleLine3: 'IMPERIAL wedding',
    titleLine4: 'ENSEMBLES',
    italicWords: ['and', 'wedding'],
    description:
      'Exquisite 22KT bridal chokers, handcrafted kadas, and chandelier jhumkas created for once-in-a-lifetime celebrations.',
    tagline: 'AUSPICIOUS — VERIFIED — BESPOKE',
    mainImage: '/images/home/royal_bridal_portrait.jpg',
    mainAlt: 'Imperial bridal jewelry portrait in pure 22KT hallmarked gold',
    secondaryImage: '/images/categories/bridal.jpg',
    secondaryAlt: 'Handcrafted bridal choker and emerald drops',
  },
];

// Fallback products matching the exact visual style in case the backend query is loading
const FALLBACK_GOLD_PRODUCTS = [
  {
    _id: 'fb-gold-1',
    name: 'Traditional Gold Necklace',
    slug: 'aadya-22k-gold-temple-choker-lakshmi-motif',
    price: 125000,
    category: 'Necklace',
    image: '/images/gold/products/necklace-trad.jpg',
    metal: '22K Yellow Gold',
    purity: '22KT',
  },
  {
    _id: 'fb-gold-2',
    name: 'Bridal Gold Choker',
    slug: 'padmavati-royal-kundan-polki-choker-set',
    price: 235000,
    category: 'Choker',
    image: '/images/gold/products/choker-bridal.jpg',
    metal: '22K Yellow Gold',
    purity: '22KT',
  },
  {
    _id: 'fb-gold-3',
    name: 'Gold Mangalsutra',
    slug: 'noor-modern-18k-gold-diamond-mangalsutra',
    price: 78000,
    category: 'Mangalsutra',
    image: '/images/gold/products/mangalsutra.jpg',
    metal: '18K Yellow Gold',
    purity: '18KT',
  },
  {
    _id: 'fb-gold-4',
    name: 'Gold Bangles',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    price: 110000,
    category: 'Bangles',
    image: '/images/gold/products/bangles.jpg',
    metal: '22K Yellow Gold',
    purity: '22KT',
  },
  {
    _id: 'fb-gold-5',
    name: 'Gold Jhumka Earrings',
    slug: 'mayur-heritage-22k-gold-temple-jhumkas',
    price: 110000,
    category: 'Earrings',
    image: '/images/gold/products/jhumkas.jpg',
    metal: '22K Yellow Gold',
    purity: '22KT',
  },
  {
    _id: 'fb-gold-6',
    name: 'Gold Ring',
    slug: 'sultan-mens-22k-solid-gold-lion-signet-ring',
    price: 48000,
    category: 'Rings',
    image: '/images/gold/products/ring.jpg',
    metal: '22K Yellow Gold',
    purity: '22KT',
  },
];

export default function GoldLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sort, setSort] = useState('featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPurity, setSelectedPurity] = useState('all');

  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query real gold products from Express backend
  const { data, isLoading } = useQuery({
    queryKey: ['gold-collection', sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: 'gold',
        sort: sort === 'featured' ? undefined : sort,
        limit: 48,
      }),
  });

  const rawProducts = data?.products && data.products.length > 0 ? data.products : FALLBACK_GOLD_PRODUCTS;

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by type
    if (selectedType !== 'all') {
      list = list.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        if (selectedType === 'necklaces') {
          return /necklace|choker|haar|collar|pendant/i.test(name) || /necklace/i.test(cat) || tags.some((t) => ['necklace', 'choker', 'haar'].includes(t));
        }
        if (selectedType === 'bangles') {
          return /bangle|kada|bracelet/i.test(name) || /bangle/i.test(cat) || tags.some((t) => ['bangle', 'kada', 'bracelet'].includes(t));
        }
        if (selectedType === 'earrings') {
          return /earring|jhumka|stud|bali/i.test(name) || /earring/i.test(cat) || tags.some((t) => ['earring', 'jhumka'].includes(t));
        }
        if (selectedType === 'rings') {
          return /ring|band|signet/i.test(name) || /ring/i.test(cat) || tags.includes('rings');
        }
        if (selectedType === 'chains') {
          return /chain|rope|mangalsutra/i.test(name) || tags.some((t) => ['chain', 'mangalsutra'].includes(t));
        }
        return true;
      });
    }

    // Filter by purity
    if (selectedPurity !== 'all') {
      list = list.filter((p) => {
        const purity = (p.purity || p.metal || '').toLowerCase();
        if (selectedPurity === '22k') return /22k|916/i.test(purity);
        if (selectedPurity === '18k') return /18k|750/i.test(purity);
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
  }, [rawProducts, selectedType, selectedPurity, sort]);

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
          HERO SECTION — DARK EMERALD EDITORIAL HERO (MATCHING REFERENCE EXACTLY)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#0B2924] text-white border-b border-[#1A3D36]">
        {/* Subtle decorative curved ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071F1B] via-[#0B2924] to-[#0A241F] pointer-events-none" />

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] items-stretch">
            
            {/* -------------------------------------------------------------------
                LEFT TEXT AREA (~45% on desktop: lg:col-span-6 xl:col-span-5)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-5 relative flex flex-col justify-center px-6 sm:px-10 lg:pl-14 lg:pr-8 py-10 sm:py-14 z-10 overflow-hidden">
              {/* Botanical Leaf Watermark in bottom-left corner */}
              <div
                className="absolute bottom-0 left-0 w-44 h-48 pointer-events-none opacity-20 bg-no-repeat bg-contain bg-bottom-left"
                style={{ backgroundImage: 'url(/images/gold/botanical-leaves.jpg)', mixBlendMode: 'screen' }}
                aria-hidden="true"
              />

              {/* Eyebrow */}
              <div className="relative z-10 mb-3 sm:mb-4">
                <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#D6B36A] font-semibold">
                  {slide.eyebrow}
                </span>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="relative z-10 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] text-[#D6B36A] leading-[1.04] tracking-wide font-normal mb-5 drop-shadow-sm transition-all duration-500">
                <span className="block">{slide.titleLine1}</span>
                <span className="block mt-0.5">
                  <span className="italic font-normal">{slide.titleLine2.split(' ')[0]}</span>{' '}
                  {slide.titleLine2.split(' ').slice(1).join(' ')}
                </span>
                <span className="block mt-0.5">
                  {slide.titleLine3.split(' ')[0]}{' '}
                  <span className="italic font-normal">{slide.titleLine3.split(' ').slice(1).join(' ')}</span>
                </span>
                <span className="block mt-0.5">{slide.titleLine4}</span>
              </h1>

              {/* Supporting Editorial Paragraph */}
              <p className="relative z-10 font-sans text-xs sm:text-sm text-[#E2DACB]/90 font-light leading-relaxed max-w-md mb-7 transition-opacity duration-500">
                {slide.description}
              </p>

              {/* SHOP NOW Button (Outlined Champagne-Gold Pill) */}
              <div className="relative z-10 mb-8">
                <button
                  onClick={scrollToCollection}
                  className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3 rounded-full border border-[#D6B36A] bg-transparent text-[#D6B36A] hover:bg-[#D6B36A] hover:text-[#0B2924] transition-all duration-300 text-xs sm:text-[13px] font-sans font-medium tracking-widest uppercase cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B36A]"
                  aria-label="Shop our gold jewellery collection"
                >
                  <span>SHOP NOW</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </button>
              </div>

              {/* Thin Gold Divider & Tagline */}
              <div className="relative z-10 pt-2 border-t border-[#D6B36A]/25 max-w-xs">
                <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#D6B36A]/80 font-medium">
                  {slide.tagline}
                </p>
              </div>
            </div>

            {/* -------------------------------------------------------------------
                CENTER: MAIN JEWELLERY PHOTOGRAPH (~36% desktop: lg:col-span-4 xl:col-span-5)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-4 xl:col-span-5 relative min-h-[360px] sm:min-h-[440px] lg:min-h-full flex items-center justify-center">
              {/* Main Fashion Editorial Photograph */}
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-[#153A32]">
                <Image
                  src={slide.mainImage}
                  alt={slide.mainAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-all duration-700 ease-out"
                />

                {/* Subtle vignette blend on edges */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#0B2924]/30 via-transparent to-[#0B2924]/20 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* ---------------------------------------------------------------
                  OVERLAPPING SECONDARY PHOTOGRAPH (Lower Right of Main Photo)
                 --------------------------------------------------------------- */}
              <div className="absolute right-3 sm:right-6 lg:-right-8 bottom-4 sm:bottom-6 z-20 w-36 sm:w-44 md:w-48 lg:w-48 aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border border-[#D6B36A]/50 bg-[#153A32] transition-transform duration-500 hover:scale-105">
                <Image
                  src={slide.secondaryImage}
                  alt={slide.secondaryAlt}
                  fill
                  sizes="220px"
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 ring-1 ring-inset ring-white/10"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* -------------------------------------------------------------------
                RIGHT DECORATIVE PANEL (~19% desktop: lg:col-span-2)
               ------------------------------------------------------------------- */}
            <div className="lg:col-span-2 relative hidden lg:flex flex-col justify-between items-center py-10 px-4 bg-[#0B2924] border-l border-[#1A3D36]">
              {/* Circular Gold Ornamental Graphic Badge */}
              <div className="pt-2">
                <svg
                  viewBox="0 0 120 120"
                  className="w-24 h-24 text-[#D6B36A] animate-spin-slow select-none"
                  aria-hidden="true"
                >
                  <defs>
                    <path
                      id="heroCircleTextPath"
                      d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                    />
                  </defs>
                  {/* Outer delicate ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                    opacity="0.4"
                  />
                  {/* Inner ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    opacity="0.3"
                  />
                  {/* Curving text */}
                  <text
                    fill="currentColor"
                    fontSize="7.2"
                    fontFamily="serif"
                    letterSpacing="3.5px"
                  >
                    <textPath href="#heroCircleTextPath" startOffset="0%">
                      GOLD COLLECTION • GOLD COLLECTION •
                    </textPath>
                  </text>
                  {/* Center 4-Point Star Sparkle */}
                  <path
                    d="M 60 48 Q 60 60 72 60 Q 60 60 60 72 Q 60 60 48 60 Q 60 60 60 48 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Vertical Stacked Editorial Text */}
              <div className="my-auto py-6 text-center select-none">
                <div className="flex flex-col items-center gap-1.5 font-serif text-[11px] uppercase tracking-[0.3em] text-[#D6B36A]/90 font-light">
                  <span>A</span>
                  <span className="font-medium">LEGACY</span>
                  <span>IN</span>
                  <span className="font-medium">EVERY</span>
                  <span>DETAIL</span>
                </div>
              </div>

              {/* Slide Counter & Minimal Circular Prev/Next Controls */}
              <div className="flex flex-col items-center gap-3 pb-2">
                {/* 01 / 03 Counter */}
                <div className="font-mono text-xs tracking-wider text-[#D6B36A]">
                  <span className="font-bold text-white">0{currentSlide + 1}</span>
                  <span className="text-[#6D8A83] mx-1">/</span>
                  <span className="text-[#6D8A83]">0{HERO_SLIDES.length}</span>
                </div>

                {/* Minimalist Prev/Next Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="w-8 h-8 rounded-full border border-[#224A42] bg-[#0E332D]/70 hover:bg-[#D6B36A] hover:text-[#0B2924] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-8 h-8 rounded-full border border-[#224A42] bg-[#0E332D]/70 hover:bg-[#D6B36A] hover:text-[#0B2924] text-[#D6B36A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          GOLD COLLECTION SECTION (#collection) — WARM IVORY EDITORIAL ATELIER
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
                  THE GOLD COLLECTION
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-[#1D1C16]">
                Our Gold Jewellery
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
                  filterDrawerOpen || selectedType !== 'all' || selectedPurity !== 'all'
                    ? 'border-[#650B19] bg-[#650B19] text-white'
                    : 'border-[#650B19] bg-transparent text-[#650B19] hover:bg-[#650B19]/10'
                }`}
                aria-label="Filter gold jewellery"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {(selectedType !== 'all' || selectedPurity !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-[#D6B36A] ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Interactive Filter Drawer / Quick Filter Chips */}
          {filterDrawerOpen && (
            <div className="bg-white rounded-xl p-5 mb-8 border border-[#E6DFD3] shadow-sm animate-fade-in">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EFEAE2]">
                <h3 className="font-serif text-sm font-semibold text-[#2A1810] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B49A58]" />
                  <span>Refine Gold Creations</span>
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-[#716D64] hover:text-[#2A1810]"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Type Filter */}
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D] mb-2.5">
                    Jewellery Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Designs' },
                      { id: 'necklaces', label: 'Necklaces & Chokers' },
                      { id: 'bangles', label: 'Bangles & Kadas' },
                      { id: 'earrings', label: 'Jhumkas & Earrings' },
                      { id: 'rings', label: 'Rings' },
                      { id: 'chains', label: 'Chains & Mangalsutra' },
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

                {/* Purity Filter */}
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-wider font-bold text-[#8B1E2D] mb-2.5">
                    Gold Hallmark Purity
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Purities' },
                      { id: '22k', label: '22KT (916 BIS Hallmarked)' },
                      { id: '18k', label: '18KT (750 Hallmarked)' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPurity(p.id)}
                        className={`px-3 py-1.5 text-xs font-sans rounded-full transition-colors ${
                          selectedPurity === p.id
                            ? 'bg-[#650B19] text-white font-medium'
                            : 'bg-[#F8F5EF] text-[#524B42] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedType !== 'all' || selectedPurity !== 'all') && (
                <div className="mt-4 pt-3 border-t border-[#EFEAE2] flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedPurity('all');
                    }}
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
                No gold creations match your filter criteria.
              </p>
              <p className="font-sans text-xs text-[#716D64] mb-5">
                Reset your filters to explore all creations in the Rishi Lal Gold Atelier.
              </p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setSelectedPurity('all');
                }}
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
                  100% BIS Hallmarked 916
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Certified with a 6-digit laser HUID hallmark for verified purity at government assay centres.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Hereditary Craftsmanship
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Sculpted by master goldsmiths across India using ancient Nakshi embossing and fine filigree.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-white border border-[#D6CBB8] text-[#B49A58] shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-[#B49A58]" />
              </div>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-semibold text-[#2A1810]">
                  Lifetime Buyback &amp; Exchange
                </h4>
                <p className="font-sans text-xs text-[#716D64] mt-1 leading-relaxed">
                  Transparent 100% benchmark gold valuation with zero melt deductions across all ateliers.
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
                  Complimentary, fully insured doorstep transit in our signature tamper-evident velvet caskets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
