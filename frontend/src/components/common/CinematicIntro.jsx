'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * RISHI LAL JEWELLERS — CINEMATIC INTRO SCREEN (STAGE 2)
 * 
 * Exact Visual Target matching approved reference image:
 * 1. Official RL crest medallion + 'RISHI LAL JEWELLERS' (upper-left)
 * 2. Champagne-gold three-line headline:
 *    TIMELESS
 *    ELEGANCE.
 *    CRAFTED FOR YOU.
 * 3. Supporting copy:
 *    Discover exquisite jewellery that celebrates your most precious moments.
 * 4. Luxurious bridal jewellery portrait blending seamlessly into background (NO card/border/box)
 * 5. Deep ruby-red and burgundy cinematic background with flowing red ribbons and golden particles.
 * 
 * STRICT PROHIBITIONS HONORED:
 * - NO navigation bar or category links
 * - NO search, wishlist, account, or cart icons
 * - NO 'Explore Collections' or 'View Catalogue' buttons
 * - NO trust badges or benefit pillars
 * - NO scroll indicators, hints, or instructions
 * - NO footer, chatbot, or extra UI
 * 
 * INTERACTION & DISMISSAL (STAGE 3 REVEAL):
 * - Dismisses on:
 *   - Click anywhere on the screen
 *   - Downward wheel/trackpad scroll
 *   - Downward touch swipe on mobile
 *   - ArrowDown / PageDown / Space / Enter
 * - Smooth refined upward fade transition
 * - Unmounts completely from DOM with ZERO residual height or layout shift
 * - Scrolling back up never brings it back; full shopping homepage is now active.
 */
export default function CinematicIntro({ onDismissComplete, dismissEnabled = true }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const introRef = useRef(null);
  const dismissStartedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const dismissEnabledRef = useRef(dismissEnabled);
  const dismissRef = useRef(null);
  const dismissTimerRef = useRef(null);
  const onDismissCompleteRef = useRef(onDismissComplete);
  const touchStartYRef = useRef(0);
  onDismissCompleteRef.current = onDismissComplete;
  dismissEnabledRef.current = dismissEnabled;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    introRef.current?.focus({ preventScroll: true });
    const revealFrame = window.requestAnimationFrame(() => {
      isVisibleRef.current = true;
      setIsVisible(true);
    });

    const dismiss = () => {
      if (!isVisibleRef.current || !dismissEnabledRef.current || dismissStartedRef.current) return;
      dismissStartedRef.current = true;
      setIsDismissing(true);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      dismissTimerRef.current = window.setTimeout(
        () => onDismissCompleteRef.current?.(),
        reduceMotion ? 0 : 480
      );
    };
    dismissRef.current = dismiss;
    const onWheel = (event) => {
      if (event.deltaY > 0) dismiss();
    };
    const onTouchStart = (event) => {
      touchStartYRef.current = event.touches?.[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event) => {
      const endY = event.changedTouches?.[0]?.clientY;
      // An upward finger movement is the native gesture for scrolling down.
      if (endY != null && touchStartYRef.current - endY > 24) dismiss();
    };
    const onKeyDown = (event) => {
      if (dismissEnabledRef.current && ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'Enter'].includes(event.key)) {
        event.preventDefault();
        dismiss();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
      window.cancelAnimationFrame(revealFrame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rishi Lal Jewellers Cinematic Introduction"
      tabIndex={0}
      ref={introRef}
      onClick={() => dismissRef.current?.()}
      className={`fixed inset-0 z-[99990] flex items-center justify-center select-none overflow-hidden cursor-pointer transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        isDismissing ? 'duration-[480ms] opacity-0 -translate-y-2' : isVisible ? 'duration-[1300ms] opacity-100 translate-y-0 pointer-events-auto' : 'duration-[1300ms] opacity-0 translate-y-1'
      }`}
      style={{
        backgroundColor: '#1E0408',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          CINEMATIC BACKGROUND LAYERS
          Deep ruby-red, burgundy ribbons, champagne caustics & golden particles
          ═══════════════════════════════════════════════════════════════════════ */}
      {/* Layer 1: Approved Ruby Luxury Backdrop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image
          src="/images/splash/bridal-intro-ruby-background.png"
          alt=""
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-center transform scale-105"
        />
      </div>

      {/* Layer 2: Deep Burgundy Vignette for Editorial Typography Contrast */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(90deg, rgba(25, 2, 6, 0.34) 0%, rgba(25, 2, 6, 0.12) 45%, rgba(25, 2, 6, 0.05) 100%)',
        }}
      />

      {/* Layer 3: Delicate glowing particles carried through the ribbon artwork */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        <span
          className="absolute top-[22%] left-[44%] w-2 h-2 rounded-full bg-[#FFE8A3] opacity-80 animate-ping"
          style={{ animationDuration: '3.4s' }}
        />
        <span
          className="absolute top-[36%] right-[16%] w-2.5 h-2.5 rounded-full bg-[#FFD700] opacity-75 animate-pulse"
          style={{ animationDuration: '2.6s' }}
        />
        <span
          className="absolute top-[66%] left-[26%] w-1.5 h-1.5 rounded-full bg-white opacity-60 animate-ping"
          style={{ animationDuration: '4.2s' }}
        />
        <span
          className="absolute top-[54%] right-[44%] w-2 h-2 rounded-full bg-[#FFE8A3] opacity-70 animate-pulse"
          style={{ animationDuration: '3.1s' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CINEMATIC INTRO CONTENT CONTAINER
          Contains ONLY the 4 required visual elements. Zero extra UI.
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-between py-8 sm:py-12 lg:py-14">
        {/* ─────────────────────────────────────────────────────────────────
            1. UPPER-LEFT BRANDING: OFFICIAL RL CREST + RISHI LAL JEWELLERS
            ───────────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Official existing RL crest, tinted champagne for contrast on ruby. */}
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0">
            <Image
              src="/images/logo-transparent.png"
              alt="Rishi Lal Jewellers Crest"
              width={80}
              height={80}
              priority
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(76%) sepia(18%) saturate(500%) hue-rotate(6deg) brightness(92%) contrast(88%)' }}
            />
          </div>

          {/* Thin Vertical Champagne Divider */}
          <div className="h-12 sm:h-16 w-px bg-gradient-to-b from-transparent via-[#C2AA6A] to-transparent shrink-0" />

          {/* Stacked Brand Wordmark */}
          <div className="flex flex-col justify-center text-left">
            <span className="font-serif text-lg sm:text-2xl lg:text-[28px] tracking-[0.16em] sm:tracking-[0.19em] text-[#E8D7AD] uppercase leading-none font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              RISHI LAL
            </span>
            <span className="font-serif text-xs sm:text-sm tracking-[0.30em] text-[#E8D7AD] uppercase leading-tight mt-1">
              JEWELLERS
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            2 & 3 & 4. MAIN HERO: HEADLINE, SUPPORTING COPY & BLENDED BRIDE
            Desktop: Side-by-side. Mobile: Stacked with natural flow.
            ───────────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex items-center w-full my-auto py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center w-full">
            {/* LEFT COLUMN: HEADLINE & SUPPORTING COPY (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left max-w-2xl">
              {/* Three deliberate lines in Champagne Gold Serif */}
              <h1 className="font-serif text-[clamp(2rem,8.2vw,3rem)] sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[76px] font-normal tracking-[0.02em] sm:tracking-[0.05em] text-[#E8D7AD] leading-[1.06] sm:leading-[1.04] mb-4 sm:mb-6">
                <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  TIMELESS
                </span>
                <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  ELEGANCE.
                </span>
                <span className="block drop-shadow-[0_4px_22px_rgba(212,175,55,0.45)]">
                  CRAFTED FOR YOU.
                </span>
              </h1>

              {/* Supporting Copy (Two deliberate lines) */}
              <p className="font-sans sm:font-serif text-sm sm:text-base md:text-lg lg:text-[19px] text-[#F5E6CC]/90 leading-relaxed font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] max-w-xl">
                Discover exquisite jewellery that celebrates<br className="hidden sm:inline" /> your most precious moments.
              </p>
            </div>

            {/* RIGHT COLUMN: LUXURIOUS BRIDAL PORTRAIT (lg:col-span-5)
                Naturally blended into the scene with ZERO card, border, or box */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-full max-w-[190px] sm:max-w-[420px] lg:max-w-[590px] aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center pointer-events-none">
                {/* Seamless Radial Feather Mask — Melts edges directly into ruby backdrop */}
                <div
                  className="relative w-full h-full pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      'radial-gradient(ellipse 88% 85% at 52% 45%, black 45%, rgba(0,0,0,0.65) 65%, transparent 95%)',
                    maskImage:
                      'radial-gradient(ellipse 88% 85% at 52% 45%, black 45%, rgba(0,0,0,0.65) 65%, transparent 95%)',
                  }}
                >
                  <Image
                    src="/images/splash/bridal-intro-portrait.png"
                    alt="Rishi Lal Jewellers Bridal Portrait"
                    fill
                    priority
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 490px"
                    className="object-contain object-bottom filter contrast-[1.04] brightness-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            EMPTY BOTTOM STRIP
            No buttons, no navigation, no scroll indicators, no badges.
            Translucent ribbons flow freely at the base.
            ───────────────────────────────────────────────────────────────── */}
        <div className="w-full h-6 pointer-events-none" />
      </div>
    </div>
  );
}
