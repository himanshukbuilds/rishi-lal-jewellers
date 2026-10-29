'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const KNOWN_CONFIGURED_HOSTNAMES = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'i.pinimg.com',
  'pinimg.com',
  'pinterest.com',
  'res.cloudinary.com',
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'lh3.googleusercontent.com',
];

/**
 * Checks whether a URL is supported by Next.js Image remotePatterns.
 */
function isConfiguredRemoteHost(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  // Local or relative paths and data URLs are always handled by Next.js
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) return true;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return KNOWN_CONFIGURED_HOSTNAMES.some(
      (known) =>
        host === known ||
        host.endsWith('.' + known) ||
        host.endsWith('pinimg.com') ||
        host.endsWith('pinterest.com')
    );
  } catch {
    return false;
  }
}

/**
 * SafeImage - Resilient image component for Rishi Lal Jewellers
 *
 * Prevents Next.js "unconfigured host" runtime errors:
 * 1. If the host is in remotePatterns -> Uses Next.js <Image /> for optimization.
 * 2. If the host is an unconfigured external domain -> Renders standard <img> cleanly without crashing React.
 * 3. If image fails to load or URL is invalid -> Gracefully renders the luxury jewelry placeholder.
 */
export default function SafeImage({
  src,
  alt = 'Rishi Lal Fine Jewelry',
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
  style,
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const isRemoteAllowed = isConfiguredRemoteHost(currentSrc);

  // If URL is not in remotePatterns or has errored out, use standard <img> to prevent runtime throws
  if (!isRemoteAllowed || hasError) {
    const imgStyle = fill
      ? {
          position: 'absolute',
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: className?.includes('object-contain') ? 'contain' : 'cover',
          ...style,
        }
      : style;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={className}
        style={imgStyle}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        {...rest}
      />
    );
  }

  // Configured remote host or local path -> use Next.js Image
  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={handleError}
      style={style}
      {...rest}
    />
  );
}

