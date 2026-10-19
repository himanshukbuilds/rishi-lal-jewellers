'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col items-center justify-center p-6 text-center">
      <BrandLogo size="lg" className="mb-6" />
      <span className="text-gold-700 font-sans text-xs uppercase tracking-[0.25em] font-bold">
        Error 404
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl text-emerald-950 font-normal mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="font-sans text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto mb-8 leading-relaxed">
        The jewelry suite or page you are seeking does not exist or may have been retired to our private heritage archives.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-emerald-900 transition-colors"
        >
          Return Home
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 bg-white border border-gold-300 text-emerald-950 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-ivory-100 transition-colors"
        >
          Explore Jewelry
        </Link>
      </div>
    </div>
  );
}

