'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Gem,
  Award,
  Truck,
  RotateCcw,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';

/**
 * RISHI LAL JEWELLERS - Luxury Promotional Hero Carousel
 * Inspired by the high-jewelry cinematic banner carousel UI/UX of Tanishq.
 *
 * Features:
 * - 30-second automatic progression (30,000ms) with smooth transitions
 * - Desktop peek effect: Active card centered (~88% width) with adjacent cards partially visible
 * - 6 distinct editorial campaign banners with bespoke luxury styling & photography
 * - Diamond-shaped pagination indicators & slide counter
 * - Hover pause/resume & accessible pause toggle
 * - Mobile touch swipe support
 * - Zero layout shift with responsive aspect ratios
 */

const AUTOPLAY_INTERVAL = 30000; // 30 seconds as specified
const BridalRibbons = dynamic(() => import('./BridalRibbons'), { ssr: false });

const CAMPAIGN_SLIDES = [
  {
    id: 1,
    tag: 'GRAND HERITAGE COLLECTION',
    badge: 'A RISHI LAL SIGNATURE',
    headline: 'Elegance That Lasts Forever',
    subtext: 'Masterfully hand-forged in 22KT hallmarked gold. Heirloom designs sculpted to celebrate life’s grandest milestones.',
    cta: 'Explore Collection',
    ctaLink: '/products',
    theme: 'gold', // Champagne Gold (#C2AA6A) + Warm Beige (#F8F5EF) + Royal Ruby (#8B1E2D)
    bgGradient: 'from-[#4A0B13] via-[#731422] to-[#8B1E2D]',
    cardBorder: 'border-[#C2AA6A]/35',
    tagColor: 'text-[#C2AA6A]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#F8F5EF]/90',
    ctaClass: 'bg-[#C2AA6A] hover:bg-[#D8C596] text-[#4A0B13] font-semibold shadow-gold-glow',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Model adorned in 22KT gold temple jhumkas and artisanal jewelry',
    features: [
      { icon: ShieldCheck, text: '100% BIS Hallmarked (HUID)' },
      { icon: Award, text: 'Zero Hidden Charges' },
    ],
  },
  {
    id: 2,
    tag: 'SOLITAIRE & DIAMOND GALA',
    badge: 'IGI & GIA CERTIFIED',
    headline: 'Let Every Moment Sparkle',
    subtext: 'Rare, ethically sourced natural diamonds of pristine VVS clarity and E-F colorless fire, set in 18KT white & rose gold.',
    cta: 'Shop Diamonds',
    ctaLink: '/categories/diamond',
    theme: 'diamond', // White (#FFFFFF) + Black (#000000) + Subtle Gold (#C2AA6A)
    bgGradient: 'from-[#000000] via-[#111111] to-[#0A0A0A]',
    cardBorder: 'border-[#C2AA6A]/25',
    tagColor: 'text-[#C2AA6A]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#F8F5EF]/85',
    ctaClass: 'bg-[#FFFFFF] hover:bg-[#F8F5EF] text-[#000000] font-semibold border border-[#C2AA6A]/40 shadow-lg',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Breathtaking 1.50 carat solitaire diamond ring in 18KT white gold',
    features: [
      { icon: Gem, text: 'Natural Conflict-Free Solitaires' },
      { icon: ShieldCheck, text: 'Lifetime Buyback Guarantee' },
    ],
  },
  {
    id: 3,
    tag: 'THE ROYAL WEDDING PAVILION',
    badge: 'HAUTE BRIDAL EDITIONS',
    headline: 'Made for Your Forever',
    subtext: 'Imperial jadau chokers, syndicate polki collars, and Tanjore temple sets crafted for the Indian bride’s eternal promise.',
    cta: 'Discover Bridal',
    ctaLink: '/categories/bridal',
    theme: 'bridal', // Dusty Rose (#DEB1A8) + Deep Velvet Crimson (#4A0B13) + Gold (#C2AA6A)
    bgGradient: 'from-[#2D050B] via-[#731422] to-[#4A0B13]',
    cardBorder: 'border-[#DEB1A8]/30',
    tagColor: 'text-[#DEB1A8]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#FAF2F0]/90',
    ctaClass: 'bg-[#C2AA6A] hover:bg-[#D8C596] text-[#4A0B13] font-semibold shadow-gold-glow',
    image: '/images/categories/bridal.jpg',
    imageAlt: 'Indian bridal trousseau featuring uncut polki diamonds and Zambian emerald choker',
    features: [
      { icon: Award, text: 'Bespoke Trousseau Consultation' },
      { icon: Truck, text: 'Armored Insured Delivery' },
    ],
  },
  {
    id: 4,
    tag: 'CONTEMPORARY FINE JEWELRY',
    badge: 'EFFORTLESS MODERN LUXURY',
    headline: 'Little Luxuries, Every Day',
    subtext: 'Delicate 18KT gold huggies, diamond tennis bracelets, and feather-light pendants designed for your everyday elegance.',
    cta: 'Shop Daily Wear',
    ctaLink: '/products?category=Gold',
    theme: 'daily', // White (#FFFFFF) + Muted Crimson (#A83244) + Soft Blush (#E8C0B8)
    bgGradient: 'from-[#8B1E2D] via-[#A83244] to-[#4A0B13]',
    cardBorder: 'border-[#E8C0B8]/30',
    tagColor: 'text-[#E8C0B8]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#F8F5EF]/90',
    ctaClass: 'bg-[#FFFFFF] hover:bg-[#F8F5EF] text-[#8B1E2D] font-semibold border border-[#A83244]/30 shadow-md',
    image: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Fluid diamond tennis bracelet and minimalist gold creations',
    features: [
      { icon: Sparkles, text: 'Tarnish-Resistant Solid Gold' },
      { icon: RotateCcw, text: '15-Day Exchange Privileges' },
    ],
  },
  {
    id: 5,
    tag: 'THE ART OF GIFTING',
    badge: 'UNFORGETTABLE CELEBRATIONS',
    headline: 'Make Every Celebration Special',
    subtext: 'Curated tokens of love and milestone keepsakes, impeccably presented in our signature velvet jewellery casket.',
    cta: 'Find the Perfect Gift',
    ctaLink: '/categories/gifts',
    theme: 'gifting', // Champagne Gold (#C2AA6A) + Blush Pink (#E8C0B8) + White (#FFFFFF)
    bgGradient: 'from-[#28151B] via-[#4A0B13] to-[#8B1E2D]',
    cardBorder: 'border-[#E8C0B8]/35',
    tagColor: 'text-[#E8C0B8]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#FAF2F0]/90',
    ctaClass: 'bg-[#C2AA6A] hover:bg-[#D8C596] text-[#4A0B13] font-semibold shadow-gold-glow',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Artisanal Colombian emerald pendant and luxury jewelry presentation casket',
    features: [
      { icon: Sparkles, text: 'Complimentary Velvet Packaging' },
      { icon: Truck, text: 'Personalized Gift Messaging' },
    ],
  },
  {
    id: 6,
    tag: 'UTSAV FESTIVE HERITAGE',
    badge: 'TIMELESS INDIAN ARTISTRY',
    headline: 'Tradition, Beautifully Reimagined',
    subtext: 'Auspicious nakshi kadas, dancing peacock earrings, and Lakshmi chokers hand-engraved by generational karigars.',
    cta: 'Explore Festive Edit',
    ctaLink: '/categories/earrings',
    theme: 'festive', // Rich Dark Crimson (#4A0B13) + Antique Gold (#C2AA6A) + Black (#000000)
    bgGradient: 'from-[#4A0B13] via-[#2D050B] to-[#000000]',
    cardBorder: 'border-[#C2AA6A]/40',
    tagColor: 'text-[#C2AA6A]',
    titleColor: 'text-[#FFFFFF]',
    subtextColor: 'text-[#F8F5EF]/90',
    ctaClass: 'bg-[#C2AA6A] hover:bg-[#D8C596] text-[#4A0B13] font-semibold shadow-gold-glow',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Royal temple kadas and heritage gold bangles in festive lighting',
    features: [
      { icon: ShieldCheck, text: 'Bureau of Indian Standards Certified' },
      { icon: Award, text: 'Generational Craftsmanship' },
    ],
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalSlides = CAMPAIGN_SLIDES.length;

  // Jump to specific slide
  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      const targetIndex = ((index % totalSlides) + totalSlides) % totalSlides;
      setCurrentSlide(targetIndex);
      setProgressKey((prev) => prev + 1);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
      return () => clearTimeout(timer);
    },
    [isTransitioning, totalSlides]
  );

  const goNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // 30-Second Autoplay Engine
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 45;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <section
      className="relative w-full bg-[#F8F5EF] pt-3 pb-6 sm:pt-4 sm:pb-8 overflow-hidden select-none"
      aria-label="Promotional Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CAROUSEL TRACK WITH TANISHQ-INSPIRED PEEK EFFECT
          Desktop: Active banner is centered at ~88% width, 
                   with ~6% preview of previous and next cards.
          Mobile: Single 100% card view with zero horizontal overflow.
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{
            // Desktop: 88% card width + 16px gap, shifted by 6% to center the card.
            // Mobile: 100% card width.
            transform: `translateX(calc(var(--carousel-offset) - ${currentSlide} * var(--carousel-step)))`,
          }}
        >
          {CAMPAIGN_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.id}
                className="carousel-slide flex-shrink-0 px-1 sm:px-2 md:px-3 lg:px-3.5 transition-all duration-700"
                aria-hidden={!isActive}
              >
                {/* ═════════════════════════════════════════════════════════
                    HERO PROMOTIONAL BANNER CARD
                ═════════════════════════════════════════════════════════ */}
                <div
                  className={`
                    relative w-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl
                    bg-gradient-to-r ${slide.bgGradient}
                    border ${slide.cardBorder}
                    transition-all duration-700
                    ${
                      isActive
                        ? 'opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-gold-400/20'
                        : 'opacity-50 scale-[0.97] hover:opacity-75 blur-[0.3px]'
                    }
                  `}
                  style={{
                    // Cinematic aspect ratio matching luxury retail banners (approx 2.4:1 on desktop)
                    minHeight: '340px',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-stretch min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px]">
                    {/* ──────────────────────────────────────────────────
                        LEFT / CONTENT COLUMN (Editorial Copy & CTAs)
                    ────────────────────────────────────────────────── */}
                    <div className="relative z-10 flex flex-col justify-between w-full md:w-[48%] lg:w-[45%] p-6 sm:p-8 md:p-10 lg:p-12 text-ivory-50">
                      <div>
                        {/* Top Badge (Tanishq 'A Tata Product' inspired luxury mark) */}
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <span className="w-1.5 h-1.5 rotate-45 bg-gold-400 inline-block" />
                          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-gold-300">
                            {slide.badge}
                          </span>
                        </div>

                        {/* Campaign Subtitle Tag */}
                        <p className={`font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 ${slide.tagColor}`}>
                          {slide.tag}
                        </p>

                        {/* Grand Editorial Headline */}
                        <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.08] tracking-tight ${slide.titleColor}`}>
                          {slide.headline}
                        </h2>

                        {/* Thin Gold Dividing Accent */}
                        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-gold-400 to-transparent my-3 sm:my-4" />

                        {/* Subtext description */}
                        <p className={`font-sans text-xs sm:text-sm font-light leading-relaxed max-w-md ${slide.subtextColor}`}>
                          {slide.subtext}
                        </p>

                        {/* Call to Action Button */}
                        <div className="mt-5 sm:mt-6 lg:mt-8 flex items-center gap-4">
                          <Link
                            href={slide.ctaLink}
                            className={`
                              inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5
                              text-xs uppercase tracking-[0.2em] font-bold rounded-full
                              transition-all duration-300 group
                              ${slide.ctaClass}
                            `}
                          >
                            <span>{slide.cta}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Integrated Trust Feature Badges (Tanishq bottom pill-strip inspired) */}
                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 hidden sm:flex items-center gap-4 text-[11px] font-sans text-ivory-200/80">
                        {slide.features.map((feat, fIdx) => {
                          const IconComp = feat.icon;
                          return (
                            <div key={fIdx} className="flex items-center gap-1.5">
                              <IconComp className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                              <span className="truncate">{feat.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ──────────────────────────────────────────────────
                        RIGHT / PHOTOGRAPHY COLUMN
                        High-fashion jewelry model visual with seamless blend
                    ────────────────────────────────────────────────── */}
                    <div className="relative w-full md:w-[52%] lg:w-[55%] min-h-[220px] md:min-h-full overflow-hidden">
                      {/* Gradient Vignette to merge image smoothly with the left dark background */}
                      <div
                        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
                        style={{
                          background: `linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 25%, transparent 60%)`,
                        }}
                      />
                      {/* Mobile bottom-to-top gradient for legibility */}
                      <div
                        className="absolute inset-0 z-10 pointer-events-none md:hidden"
                        style={{
                          background: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, transparent 100%)`,
                        }}
                      />

                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                        unoptimized
                      />

                      {slide.theme === 'bridal' && isActive && <BridalRibbons />}

                      {/* Subtle Rishi Lal Watermark Crest */}
                      <div className="absolute top-4 right-4 z-10 hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-ivory-200 text-[10px] uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-gold-400" />
                        <span>RISHI LAL ATELIER</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            PREVIOUS & NEXT ARROWS (Frosted Glass Floating Circles)
        ═══════════════════════════════════════════════════════════════════ */}
        <button
          onClick={goPrev}
          className="
            absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 sm:w-12 sm:h-12
            flex items-center justify-center
            bg-white/90 hover:bg-white text-[#4A0B13] hover:text-[#C2AA6A]
            backdrop-blur-md rounded-full shadow-lg hover:shadow-xl
            border border-[#C2AA6A]/40
            transition-all duration-300 hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-[#C2AA6A]
          "
          aria-label="Previous promotional campaign"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={goNext}
          className="
            absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 sm:w-12 sm:h-12
            flex items-center justify-center
            bg-white/90 hover:bg-white text-[#4A0B13] hover:text-[#C2AA6A]
            backdrop-blur-md rounded-full shadow-lg hover:shadow-xl
            border border-[#C2AA6A]/40
            transition-all duration-300 hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-[#C2AA6A]
          "
          aria-label="Next promotional campaign"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CONTROLS BAR: TANISHQ-INSPIRED DIAMOND PAGINATION + COUNTER
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 mt-5 sm:mt-6 flex items-center justify-between">
        {/* Slide Counter (e.g., 01 / 06) */}
        <div className="font-serif text-xs sm:text-sm tracking-widest text-[#4A0B13] font-semibold flex items-center gap-1.5">
          <span className="text-[#C2AA6A] font-bold">0{currentSlide + 1}</span>
          <span className="text-charcoal-400">/</span>
          <span className="text-charcoal-500">0{totalSlides}</span>
        </div>

        {/* Diamond Pagination Indicators */}
        <div className="flex items-center gap-3 sm:gap-3.5" role="tablist" aria-label="Campaign slides">
          {CAMPAIGN_SLIDES.map((slide, idx) => {
            const isSelected = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Go to slide ${idx + 1}: ${slide.headline}`}
                className="group p-1.5 focus:outline-none"
              >
                <span
                  className={`
                    block transition-all duration-500 ease-out rotate-45
                    ${
                      isSelected
                        ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#C2AA6A] shadow-[0_0_10px_rgba(194,170,106,0.6)] ring-2 ring-[#C2AA6A]/40'
                        : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-charcoal-300/60 hover:bg-[#C2AA6A]/70'
                    }
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* 30-Second Autoplay Status & Pause/Resume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#C2AA6A]/40 text-[10px] uppercase font-sans tracking-wider text-charcoal-600 hover:text-[#4A0B13] hover:border-[#C2AA6A] transition-all shadow-xs"
            aria-label={isPaused ? 'Resume 30-second autoplay' : 'Pause autoplay'}
            title={isPaused ? 'Resume 30-second autoplay' : 'Pause autoplay'}
          >
            {isPaused ? (
              <>
                <Play className="w-2.5 h-2.5 text-[#C2AA6A] fill-[#C2AA6A]" />
                <span className="hidden sm:inline">Play</span>
              </>
            ) : (
              <>
                <Pause className="w-2.5 h-2.5 text-[#C2AA6A] fill-[#C2AA6A]" />
                <span className="hidden sm:inline">30s Auto</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 30-Second Animated Progress Bar */}
      <div className="max-w-xs mx-auto mt-2 h-0.5 bg-[#C2AA6A]/25 rounded-full overflow-hidden">
        <div
          key={progressKey}
          className={`h-full bg-gradient-to-r from-[#C2AA6A] to-[#D8C596] ${isPaused ? 'opacity-40' : 'animate-carousel-progress'}`}
          style={{
            animationDuration: `${AUTOPLAY_INTERVAL}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>

      {/* Responsive Carousel CSS Variables */}
      <style jsx>{`
        :global(:root) {
          --carousel-offset: 0%;
          --carousel-step: 100%;
        }

        .carousel-slide {
          width: 100%;
        }

        @media (min-width: 768px) {
          :global(:root) {
            /* 88% width + peek on desktop */
            --carousel-offset: 6%;
            --carousel-step: 88%;
          }

          .carousel-slide {
            width: 88%;
          }
        }

        @media (min-width: 1280px) {
          :global(:root) {
            --carousel-offset: 6%;
            --carousel-step: 88%;
          }

          .carousel-slide {
            width: 88%;
          }
        }

        @keyframes carouselProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-carousel-progress {
          animation-name: carouselProgress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}
