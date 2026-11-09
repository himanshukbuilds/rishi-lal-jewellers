'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND_CONFIG } from '@/config/brandConfig';

/**
 * BrandLogo - Centralized Logo component for Rishi Lal Jewellers
 * Automatically uses BRAND_CONFIG.logo.image and BRAND_CONFIG.name
 * Supports light / dark / gold contrast variants
 * Includes fallback to refined text/monogram if logo asset is loading or missing
 */
export default function BrandLogo({
  variant = 'dark', // 'dark' (on light bg), 'light' (on dark emerald bg), 'gold'
  showTagline = true,
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
}) {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: { imgClass: 'w-7 h-7 sm:w-9 sm:h-9', text: 'text-xs sm:text-sm md:text-base', sub: 'text-[8px] sm:text-[9px]' },
    md: { imgClass: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12', text: 'text-sm sm:text-base md:text-xl lg:text-2xl', sub: 'text-[9px] sm:text-[10px]' },
    lg: { imgClass: 'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16', text: 'text-base sm:text-xl md:text-2xl lg:text-3xl', sub: 'text-[10px] sm:text-xs' },
  };

  const { imgClass, text, sub } = sizeMap[size] || sizeMap.md;

  const textColor =
    variant === 'light'
      ? 'text-ivory-50'
      : variant === 'gold'
      ? 'text-gold-400'
      : 'text-emerald-950';

  const subColor =
    variant === 'light'
      ? 'text-gold-300'
      : variant === 'gold'
      ? 'text-gold-500'
      : 'text-gold-700';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-95 min-w-0 max-w-full ${className}`}
      aria-label={`${BRAND_CONFIG.name} Home`}
    >
      <div className={`relative flex items-center justify-center rounded-full overflow-hidden p-0.5 border border-gold-400/50 bg-ivory-50 shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0 ${imgClass}`}>
        {!imageError && BRAND_CONFIG.logo.image ? (
          <Image
            src={BRAND_CONFIG.logo.image}
            alt={BRAND_CONFIG.logo.alt}
            width={64}
            height={64}
            className="w-full h-full object-contain rounded-full"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-emerald-950 text-gold-300 font-serif font-bold text-xs sm:text-sm rounded-full border border-gold-400/40"
          >
            RL
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`font-serif tracking-[0.10em] sm:tracking-[0.16em] md:tracking-[0.20em] font-semibold uppercase transition-colors leading-tight truncate ${textColor} ${text}`}
        >
          {BRAND_CONFIG.name}
        </span>
        {showTagline && (
          <span
            className={`font-sans uppercase tracking-[0.16em] sm:tracking-[0.24em] font-medium transition-colors hidden sm:block truncate ${subColor} ${sub}`}
          >
            {BRAND_CONFIG.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
