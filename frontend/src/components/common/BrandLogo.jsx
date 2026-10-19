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
    sm: { img: 38, text: 'text-base sm:text-lg', sub: 'text-[9px]' },
    md: { img: 48, text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    lg: { img: 64, text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
  };

  const { img, text, sub } = sizeMap[size] || sizeMap.md;

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
      className={`inline-flex items-center gap-2.5 sm:gap-3 group transition-opacity hover:opacity-95 ${className}`}
      aria-label={`${BRAND_CONFIG.name} Home`}
    >
      <div className="relative flex items-center justify-center rounded-full overflow-hidden p-0.5 border border-gold-400/50 bg-ivory-50 shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0">
        {!imageError && BRAND_CONFIG.logo.image ? (
          <Image
            src={BRAND_CONFIG.logo.image}
            alt={BRAND_CONFIG.logo.alt}
            width={img}
            height={img}
            className="object-contain rounded-full"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{ width: img, height: img }}
            className="flex items-center justify-center bg-emerald-950 text-gold-300 font-serif font-bold text-sm rounded-full border border-gold-400/40"
          >
            RL
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={`font-serif tracking-[0.16em] sm:tracking-[0.20em] font-semibold uppercase transition-colors leading-tight ${textColor} ${text}`}
        >
          {BRAND_CONFIG.name}
        </span>
        {showTagline && (
          <span
            className={`font-sans uppercase tracking-[0.24em] font-medium transition-colors ${subColor} ${sub}`}
          >
            {BRAND_CONFIG.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
