'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BRAND_CONFIG } from '@/config/brandConfig';

/**
 * RISHI LAL JEWELLERS — CINEMATIC RUBY AND CHAMPAGNE BRAND REVEAL
 * The project's official crest appears above a centered, two-line wordmark. The
 * final 1.3s fade overlaps the approved bridal intro for a seamless transition.
 */
export default function SplashScreen({ onTransitionStart, onComplete }) {
  const [backgroundVisible, setBackgroundVisible] = useState(false);
  const [logoRevealing, setLogoRevealing] = useState(false);
  const [logoGleam, setLogoGleam] = useState(false);
  const [wordmarkRevealing, setWordmarkRevealing] = useState(false);
  const [glassSweepActive, setGlassSweepActive] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const timersRef = useRef([]);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onTransitionStartRef = useRef(onTransitionStart);
  onCompleteRef.current = onComplete;
  onTransitionStartRef.current = onTransitionStart;

  useEffect(() => {
    let active = true;
    const finishSplash = () => {
      if (!active || completedRef.current) return;
      completedRef.current = true;
      setIsFinished(true);
      onCompleteRef.current?.();
    };

    // 2. Accessibility: Respect reduced motion preferences
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setBackgroundVisible(true);
        setLogoRevealing(true);
        setWordmarkRevealing(true);

        const tFade = setTimeout(() => setFadingOut(true), 500);
        const tDone = setTimeout(finishSplash, 900);

        timersRef.current = [tFade, tDone];
        return () => {
          active = false;
          timersRef.current.forEach(clearTimeout);
        };
      }
    }

    // 3. Cinematic staged sequence. Keep the established 4.9s duration so the
    // crossfade into the bridal intro remains immediate and predictable.
    const tAtmosphere = setTimeout(() => setBackgroundVisible(true), 40);
    const tSweep = setTimeout(() => setGlassSweepActive(true), 350);
    const tLogo = setTimeout(() => setLogoRevealing(true), 520);
    const tGleam = setTimeout(() => setLogoGleam(true), 820);
    const tWordmark = setTimeout(() => setWordmarkRevealing(true), 1320);

    // Crossfade into the cinematic intro (3.6s – 4.9s)
    const tFadeout = setTimeout(() => {
      setFadingOut(true);
      onTransitionStartRef.current?.();
    }, 3600);

    // 4.9s: Complete the crossfade and unmount the splash
    const tDone = setTimeout(finishSplash, 4900);

    // 5.6s Fail-Safe: Hard safety fallback guarantee
    const tSafety = setTimeout(finishSplash, 5600);

    timersRef.current = [tAtmosphere, tSweep, tLogo, tGleam, tWordmark, tFadeout, tDone, tSafety];

    return () => {
      active = false;
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
      className={`fixed inset-0 z-[99999] flex items-center justify-center select-none overflow-hidden transition-opacity duration-[1300ms] ease-in-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        backgroundColor: '#2A080E',
      }}
    >
      {/* ==================================================================
          STAGE CONTAINER: APPROVED RUBY-RED & CHAMPAGNE-GOLD ARCHITECTURE
          Immediate visual presence from frame 0 with subtle ambient motion
          ================================================================== */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Layer 1: Ruby silk ribbons, champagne reflections, and reflective floor */}
        <img
          src="/images/splash/cinematic-ruby-ribbons.png"
          alt=""
          fetchPriority="high"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${backgroundVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            willChange: 'transform',
            animation: 'rjRubyGlassAmbient 16s ease-in-out infinite alternate',
          }}
        />

        {/* Layer 2: Warm Ivory & Champagne Soft Diffused Central Illumination */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[380px] pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(255, 235, 190, 0.15) 0%, rgba(245, 215, 145, 0.09) 38%, rgba(180, 20, 40, 0.12) 72%, transparent 100%)',
            filter: 'blur(30px)',
            animation: 'rjVolumetricBreathing 7s ease-in-out infinite',
          }}
        />

        {/* Layer 3: Polished Stage Floor Golden Caustic Reflections (Lower 35%) */}
        <div
          className="absolute inset-x-0 bottom-0 h-[35%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 95%, rgba(255, 235, 190, 0.22) 0%, rgba(212, 175, 55, 0.12) 45%, rgba(139, 10, 25, 0.10) 75%, transparent 88%)',
            mixBlendMode: 'screen',
            animation: 'rjRubyFloorShimmer 4.5s ease-in-out infinite',
          }}
        />

        {/* Layer 4: Translucent Ribbons Champagne-Gold Specular Light Sweep
            Traveling reflection constrained strictly to the lower 42% (ribbon zone).
            Masked so it flows along the ribbon curves and NEVER obscures text. */}
        {glassSweepActive && (
          <div
            className="absolute inset-x-0 bottom-0 h-[42%] w-full pointer-events-none overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 80%, transparent 100%)',
              maskImage: 'linear-gradient(to top, black 0%, black 80%, transparent 100%)',
            }}
          >
            <div
              className="absolute inset-0 w-[200%] h-full pointer-events-none -left-[50%]"
              style={{
                background: 'linear-gradient(115deg, transparent 32%, rgba(255, 240, 200, 0.22) 44%, rgba(255, 255, 255, 0.60) 50%, rgba(212, 175, 55, 0.35) 56%, transparent 68%)',
                animation: 'rjRubyGlassSweep 3.2s cubic-bezier(0.25, 1, 0.35, 1) forwards',
              }}
            />
          </div>
        )}

        {/* Layer 5: Delicate Sparkling Starburst Light Points (Along Ribbon Crests) */}
        {/* Starburst 1: On rising ribbon curve (left) */}
        <div
          className="absolute top-[61%] left-[28%] w-3 h-3 pointer-events-none"
          style={{
            animation: 'rjSparklePulse 3.4s ease-in-out infinite',
          }}
        >
          <div className="w-full h-full bg-radial from-white via-[#FFE8A3] to-transparent rounded-full filter blur-[1px]" />
        </div>

        {/* Starburst 2: On mid-stage ribbon crest (center-right) */}
        <div
          className="absolute top-[77%] left-[63%] w-3 h-3 pointer-events-none"
          style={{
            animation: 'rjSparklePulse 4.0s ease-in-out infinite 0.7s',
          }}
        >
          <div className="w-full h-full bg-radial from-white via-[#FFE8A3] to-transparent rounded-full filter blur-[1px]" />
        </div>

        {/* Starburst 3: On upper ribbon sweep (right edge) */}
        <div
          className="absolute top-[65%] left-[86%] w-3 h-3 pointer-events-none"
          style={{
            animation: 'rjSparklePulse 3.6s ease-in-out infinite 1.3s',
          }}
        >
          <div className="w-full h-full bg-radial from-white via-[#FFE8A3] to-transparent rounded-full filter blur-[1px]" />
        </div>

        {/* Starburst 4: On floor reflection spotlight (bottom-left) */}
        <div
          className="absolute top-[92%] left-[17%] w-3 h-3 pointer-events-none"
          style={{
            animation: 'rjSparklePulse 4.2s ease-in-out infinite 0.4s',
          }}
        >
          <div className="w-full h-full bg-radial from-white via-[#FFE8A3] to-transparent rounded-full filter blur-[1px]" />
        </div>

        {/* ==================================================================
            SYMMETRICAL BRAND LOCKUP: ORIGINAL CREST, THEN TWO-LINE WORDMARK
            ================================================================== */}
        <div className="relative z-20 flex w-full flex-col items-center justify-center gap-4 px-5 sm:gap-5">
          <div
            className={`relative flex h-32 w-32 items-center justify-center transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-44 sm:w-44 lg:h-56 lg:w-56 ${logoRevealing ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.97] opacity-0'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-[-24%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(214,179,106,0.20) 0%, rgba(180,110,48,0.10) 42%, transparent 72%)',
                filter: 'blur(12px)',
                opacity: logoGleam ? 1 : 0.45,
                transition: 'opacity 900ms ease-out',
              }}
            />
            {logoGleam && (
              <div
                aria-hidden="true"
                className="absolute inset-[-10%] z-20 overflow-hidden rounded-full pointer-events-none"
              >
                <div
                  className="absolute inset-y-0 left-[-60%] w-[45%]"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,244,210,0.30), transparent)',
                    filter: 'blur(5px)',
                    animation: 'rjLogoSpecular 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                />
              </div>
            )}
            {!imgError ? (
              <Image
                src="/images/logo-transparent.png"
                alt={`${BRAND_CONFIG.name} crest`}
                width={224}
                height={224}
                priority
                className="relative z-10 h-full w-full object-contain"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(76%) sepia(32%) saturate(680%) hue-rotate(2deg) brightness(91%) contrast(88%) drop-shadow(0 0 12px rgba(214,179,106,0.28))',
                }}
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="relative z-10 font-serif text-6xl text-[#D6B36A]">RL</span>
            )}
          </div>

          <h1
            aria-label="RISHI LAL JEWELLERS"
            className="flex flex-col items-center text-center font-serif font-normal uppercase text-[#D6B36A]"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.42), 0 0 24px rgba(214,179,106,0.14)' }}
          >
            <span className="flex whitespace-nowrap text-[clamp(2.8rem,6.2vw,5.75rem)] leading-[0.94] tracking-[0.20em] sm:tracking-[0.25em]">
              {'RISHI LAL'.split('').map((letter, index) => (
                <span
                  aria-hidden="true"
                  key={`rishi-${index}`}
                  className={`inline-block transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${wordmarkRevealing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                  style={{ transitionDelay: wordmarkRevealing ? `${index * 38}ms` : '0ms' }}
                >
                  {letter === ' ' ? '\u00a0' : letter}
                </span>
              ))}
            </span>
            <span className="mt-3 flex whitespace-nowrap text-[clamp(1.1rem,2.1vw,2rem)] leading-none tracking-[0.38em] sm:mt-4 sm:tracking-[0.48em]">
              {'JEWELLERS'.split('').map((letter, index) => (
                <span
                  aria-hidden="true"
                  key={`jewellers-${index}`}
                  className={`inline-block transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${wordmarkRevealing ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                  style={{ transitionDelay: wordmarkRevealing ? `${(index + 9) * 38}ms` : '0ms' }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <div
            aria-hidden="true"
            className={`relative mt-1 h-px w-56 bg-gradient-to-r from-transparent via-[#D6B36A]/75 to-transparent transition-opacity duration-700 sm:mt-2 sm:w-[26rem] ${wordmarkRevealing ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#E4C27B] bg-[#6A1A22]" />
          </div>
        </div>
      </div>
    </div>
  );
}
