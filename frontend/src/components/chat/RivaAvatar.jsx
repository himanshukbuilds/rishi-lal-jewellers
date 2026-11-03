'use client';

import React from 'react';

/**
 * RivaAvatar - Elegant, minimal jewellery-inspired assistant icon for RIVA
 *
 * Designed in the official Rishi Lal Jewellers palette:
 * - Rich velvety burgundy (#4A0B13)
 * - Champagne gold (#C2AA6A, #E4D4A7)
 * - Warm ivory highlights
 *
 * Represents an exquisite faceted jewel with celestial sparkle facets.
 */
export default function RivaAvatar({
  size = 'md', // 'xs' (20px), 'sm' (28px), 'md' (36px), 'lg' (56px)
  className = '',
  showStatus = false,
  statusColor = 'bg-emerald-400',
}) {
  const sizeClasses = {
    xs: 'h-5 w-5',
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-14 w-14',
  }[size] || 'h-9 w-9';

  const statusDotSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3.5 w-3.5',
  }[size] || 'h-2.5 w-2.5';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${sizeClasses} ${className}`}
      aria-label="RIVA - Personal Jewellery Assistant"
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="riva-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF4D8" />
            <stop offset="35%" stopColor="#D6B36A" />
            <stop offset="70%" stopColor="#C2AA6A" />
            <stop offset="100%" stopColor="#8E773E" />
          </linearGradient>

          <linearGradient id="riva-facet-grad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="50%" stopColor="#D6B36A" />
            <stop offset="100%" stopColor="#AA8C42" />
          </linearGradient>

          <radialGradient id="riva-burgundy-depth" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#6E1020" />
            <stop offset="55%" stopColor="#4A0B13" />
            <stop offset="100%" stopColor="#250409" />
          </radialGradient>

          <filter id="riva-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Burgundy Medallion */}
        <circle cx="22" cy="22" r="21" fill="url(#riva-burgundy-depth)" />

        {/* Fine Double Gold Rim */}
        <circle cx="22" cy="22" r="21" stroke="url(#riva-gold-rim)" strokeWidth="1.2" />
        <circle
          cx="22"
          cy="22"
          r="19"
          stroke="url(#riva-gold-rim)"
          strokeWidth="0.5"
          strokeOpacity="0.45"
          strokeDasharray="2 2"
        />

        {/* Sparkling Star Glow in Centre */}
        <circle cx="22" cy="22" r="4" fill="#FBF4D8" opacity="0.25" filter="url(#riva-glow)" />

        {/* Faceted Brilliant Solitaire Diamond Silhouette */}
        {/* Crown Table */}
        <polygon
          points="17,17 27,17 31,22 13,22"
          fill="none"
          stroke="url(#riva-facet-grad)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        {/* Pavilion Point */}
        <polygon
          points="13,22 31,22 22,33"
          fill="none"
          stroke="url(#riva-facet-grad)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        {/* Interior Facet Refractions */}
        <line x1="22" y1="17" x2="22" y2="33" stroke="url(#riva-facet-grad)" strokeWidth="0.8" />
        <line x1="17" y1="17" x2="22" y2="33" stroke="url(#riva-facet-grad)" strokeWidth="0.6" strokeOpacity="0.8" />
        <line x1="27" y1="17" x2="22" y2="33" stroke="url(#riva-facet-grad)" strokeWidth="0.6" strokeOpacity="0.8" />
        <line x1="19.5" y1="17" x2="17.5" y2="22" stroke="url(#riva-facet-grad)" strokeWidth="0.6" strokeOpacity="0.75" />
        <line x1="24.5" y1="17" x2="26.5" y2="22" stroke="url(#riva-facet-grad)" strokeWidth="0.6" strokeOpacity="0.75" />

        {/* Top-Right 4-Point Starlight Sparkle */}
        <path
          d="M32 9 Q32 12 34.5 12 Q32 12 32 15 Q32 12 29.5 12 Q32 12 32 9 Z"
          fill="url(#riva-facet-grad)"
        />

        {/* Bottom-Left Subtle Sparkle */}
        <path
          d="M10 27 Q10 29 11.5 29 Q10 29 10 31 Q10 29 8.5 29 Q10 29 10 27 Z"
          fill="url(#riva-facet-grad)"
          opacity="0.85"
        />
      </svg>

      {/* Online Status Dot */}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-[#4A0B13] ${statusColor} ${statusDotSizes}`}
        />
      )}
    </div>
  );
}

