'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BRAND_CONFIG } from '@/config/brandConfig';

/**
 * RISHI LAL JEWELLERS — CINEMATIC LUXURY BRAND REVEAL INTRO
 * (ENHANCED: GLOSSY SATIN WAVES, ROSE-GOLD REFLECTIONS & CINEMATIC LIGHT SWEEP)
 * 
 * Objectives:
 * 1. Rich Burgundy Depth: Deep wine-red palette (#3B0710 / #590F1B / #741827) with 3D tonal richness.
 * 2. Glossy Satin-Wave Highlights: Metallic champagne (#C2AA6A) and rose-gold (#D6A39B) reflections along wave crests.
 * 3. Cinematic Light Sweep: Gentle traveling specular light that flows along the satin curves without touching the text.
 * 4. Refined Champagne Illumination: Soft, controlled diffused halo behind the brand composition.
 * 5. Netflix-Style Brand Reveal:
 *    - 0.0s – 0.4s: Immediate visual presence & subtle wave lighting.
 *    - 0.4s – 1.2s: Staged logo reveal with specular gleam sweep & vertical divider growth.
 *    - 0.9s – 2.4s: "RISHI LAL JEWELLERS" horizontal wipe with traveling glint beam.
 *    - 2.1s – 2.8s: "TIMELESS ELEGANCE. CRAFTED FOR YOU." subtle upward fade.
 *    - 2.8s – 3.5s: Hold complete brand lockup in serene stillness.
 *    - 3.5s – 4.8s: Smooth 1.3s crossfade into the live homepage.
 *    - 4.8s+      : Clean DOM unmount, body scroll restored.
 */
export default function SplashScreen() {
  const [logoRevealing, setLogoRevealing] = useState(false);
  const [logoGleam, setLogoGleam] = useState(false);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [wordmarkRevealing, setWordmarkRevealing] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [waveSweepActive, setWaveSweepActive] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const timersRef = useRef([]);

  useEffect(() => {
    // 1. Lock page scrolling while intro is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Accessibility: Respect reduced motion preferences
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setLogoRevealing(true);
        setDividerVisible(true);
        setWordmarkRevealing(true);
        setTaglineVisible(true);

        const tFade = setTimeout(() => setFadingOut(true), 500);
        const tDone = setTimeout(() => {
          document.body.style.overflow = originalOverflow;
          setIsFinished(true);
        }, 900);

        timersRef.current = [tFade, tDone];
        return () => {
          document.body.style.overflow = originalOverflow;
          timersRef.current.forEach(clearTimeout);
        };
      }
    }

    // 3. Cinematic Staged Timeline Sequencing (~4.8s Total)
    // Logo entrance begins early (0.4s – 1.2s)
    const tLogo = setTimeout(() => setLogoRevealing(true), 400);

    // Cinematic light sweep across satin waves begins (0.5s – 3.5s)
    const tSweep = setTimeout(() => setWaveSweepActive(true), 500);

    // Specular light sweep across logo medallion (0.6s)
    const tGleam = setTimeout(() => setLogoGleam(true), 600);

    // Vertical divider grows from center (0.7s – 1.2s)
    const tDivider = setTimeout(() => setDividerVisible(true), 700);

    // Brand-name horizontal reveal with traveling glint (0.9s – 2.4s)
    const tWordmark = setTimeout(() => setWordmarkRevealing(true), 900);

    // Tagline smooth upward fade (2.1s – 2.8s)
    const tTagline = setTimeout(() => setTaglineVisible(true), 2100);

    // Smooth homepage crossfade (3.5s – 4.8s)
    const tFadeout = setTimeout(() => setFadingOut(true), 3500);

    // 4.8s: Complete unmount & restore body scroll
    const tDone = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      setIsFinished(true);
    }, 4800);

    // 5.5s Fail-Safe: Hard safety fallback guarantee
    const tSafety = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      setIsFinished(true);
    }, 5500);

    timersRef.current = [tLogo, tSweep, tGleam, tDivider, tWordmark, tTagline, tFadeout, tDone, tSafety];

    return () => {
      document.body.style.overflow = originalOverflow;
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  if (isFinished) {
    return null;
  }

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex items-center justify-center select-none overflow-hidden transition-opacity duration-1300 ease-in-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        backgroundColor: '#3B0710',
      }}
    >
      {/* ==================================================================
          STAGE CONTAINER: SATIN WAVES ATMOSPHERE
          Immediate visual presence from frame 0 with subtle ambient motion
          ================================================================== */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Layer 1: Enhanced Glossy Satin Waves Background Asset (Instantly Visible) */}
        <img
          src="/images/splash/satin_background_clean.png"
          alt=""
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
          style={{
            willChange: 'transform',
            animation: 'rjSatinBreathing 14s ease-in-out infinite alternate',
          }}
        />

        {/* Layer 2A: Upper Wave Glossy Satin Luster & Rose-Gold Sheen */}
        <div
          className="absolute inset-x-0 top-0 h-[38%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 65% at 50% 10%, rgba(232, 215, 173, 0.22) 0%, rgba(214, 163, 155, 0.16) 42%, rgba(116, 24, 39, 0.12) 68%, transparent 85%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Layer 2B: Lower Wave Glossy Satin Luster & Champagne Reflections */}
        <div
          className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 85% 70% at 50% 92%, rgba(232, 215, 173, 0.24) 0%, rgba(214, 163, 155, 0.18) 46%, rgba(116, 24, 39, 0.14) 72%, transparent 88%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Layer 3: Cinematic Light Sweep Traveling Across Satin Waves
            Masked so that it passes strictly along the upper & lower waves
            and NEVER obscures or flashes over the central branding text! */}
        {waveSweepActive && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 42%, transparent 58%, black 70%, black 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 42%, transparent 58%, black 70%, black 100%)',
            }}
          >
            <div
              className="absolute inset-0 w-[200%] h-full pointer-events-none -left-[50%]"
              style={{
                background: 'linear-gradient(118deg, transparent 38%, rgba(232, 215, 173, 0.18) 47%, rgba(255, 255, 255, 0.32) 50%, rgba(214, 163, 155, 0.20) 53%, transparent 62%)',
                animation: 'rjWaveLightSweep 3.2s cubic-bezier(0.25, 1, 0.35, 1) forwards',
              }}
            />
          </div>
        )}

        {/* Layer 4: Refined Central Champagne & Wine-Red Illumination (Behind Branding) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[360px] pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(194, 170, 106, 0.16) 0%, rgba(214, 163, 155, 0.10) 30%, rgba(116, 24, 39, 0.24) 55%, transparent 80%)',
            filter: 'blur(35px)',
          }}
        />

        {/* ==================================================================
            CENTRAL HORIZONTAL BRAND COMPOSITION
            Real official logo + vertical divider + warm ivory wordmark & tagline.
            Centered in the dark negative space between the flowing satin waves.
            ================================================================== */}
        <div className="relative z-20 flex items-center justify-center px-4 max-w-[94vw] sm:max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3.5 sm:gap-5 md:gap-7">
            {/* --------------------------------------------------------------
                1. REAL OFFICIAL EMBLEM (Stage B: 0.4s – 1.2s)
                Emerges with volumetric scale & opacity, followed by specular sweep
                -------------------------------------------------------------- */}
            <div
              className={`relative shrink-0 flex items-center justify-center transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                logoRevealing
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 translate-y-1.5'
              }`}
              style={{ willChange: 'opacity, transform' }}
            >
              {/* Warm Ivory & Champagne Medallion Disc */}
              <div
                className="relative flex items-center justify-center rounded-full p-1.5 sm:p-2 border border-[#C2AA6A]/70 shadow-[0_6px_28px_rgba(0,0,0,0.7),0_0_24px_rgba(194,170,106,0.35)] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F8F5EF 0%, #F1ECE3 55%, #E8D7AD 100%)',
                }}
              >
                {/* Specular Light Sweep Gleam across logo disc */}
                {logoGleam && (
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.85) 50%, rgba(232, 215, 173, 0.9) 55%, transparent 80%)',
                      animation: 'rjLogoSpecular 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                  />
                )}

                <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                  {!imgError ? (
                    <Image
                      src="/images/logo-transparent.png"
                      alt={BRAND_CONFIG.name}
                      width={64}
                      height={64}
                      priority
                      className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="font-serif font-bold text-lg sm:text-xl text-black">RL</span>
                  )}
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------
                2. VERTICAL CHAMPAGNE DIVIDER (0.7s – 1.2s)
                Grows vertically from center outward
                -------------------------------------------------------------- */}
            <div
              className={`h-11 sm:h-14 md:h-16 w-[1.5px] bg-gradient-to-b from-transparent via-[#C2AA6A]/90 to-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 origin-center ${
                dividerVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
              }`}
              style={{ willChange: 'transform, opacity' }}
            />

            {/* --------------------------------------------------------------
                3. BRAND NAME & TRAVELING GLINT (Stage C: 0.9s – 2.4s)
                Wordmark unrolls from left to right with radiant glint traveling along
                -------------------------------------------------------------- */}
            <div className="flex flex-col justify-center text-left select-none relative">
              {/* Wordmark Container */}
              <div
                className="overflow-hidden whitespace-nowrap relative"
                style={{
                  clipPath: wordmarkRevealing
                    ? 'inset(0 0% 0 0)'
                    : 'inset(0 100% 0 0)',
                  transition: 'clip-path 1500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'clip-path',
                }}
              >
                <h1
                  className={`font-serif text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-normal tracking-[0.20em] sm:tracking-[0.24em] md:tracking-[0.26em] text-[#F8F5EF] uppercase leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    wordmarkRevealing ? 'translate-x-0' : 'translate-x-2'
                  }`}
                >
                  RISHI LAL JEWELLERS
                </h1>
              </div>

              {/* Horizontal Champagne Horizon Shimmer Line with Traveling Glint */}
              <div className="relative w-full my-1 sm:my-1.5 overflow-visible">
                {/* Base Shimmer Line */}
                <div
                  className={`w-full h-[1px] bg-gradient-to-r from-[#C2AA6A]/90 via-[#E8D7AD]/70 to-transparent transition-opacity duration-800 ease-out ${
                    wordmarkRevealing ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ willChange: 'opacity' }}
                />

                {/* Traveling Glint Light Head that guides the reveal across the text */}
                {wordmarkRevealing && (
                  <div
                    className="absolute -top-1.5 w-8 h-4 rounded-full pointer-events-none -translate-x-1/2"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(232, 215, 173, 0.8) 40%, transparent 75%)',
                      filter: 'blur(2px)',
                      animation: 'rjTravelingGlint 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                  />
                )}
              </div>

              {/* --------------------------------------------------------------
                  4. TAGLINE (Stage D: 2.1s – 2.8s)
                  Smooth upward glide & fade into position
                  -------------------------------------------------------------- */}
              <div
                className={`transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  taglineVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-1.5'
                }`}
                style={{ willChange: 'opacity, transform' }}
              >
                <p className="font-sans text-[8px] sm:text-[9.5px] md:text-[11px] tracking-[0.30em] sm:tracking-[0.36em] md:tracking-[0.40em] text-[#C2AA6A] uppercase font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                  TIMELESS ELEGANCE. CRAFTED FOR YOU.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
