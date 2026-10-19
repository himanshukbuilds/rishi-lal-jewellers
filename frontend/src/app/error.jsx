'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('[Application Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col items-center justify-center p-6 text-center">
      <span className="text-red-700 font-sans text-xs uppercase tracking-[0.25em] font-bold">
        Application Error
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl text-emerald-950 font-normal mt-2 mb-3">
        An Unexpected Error Occurred
      </h1>
      <p className="font-sans text-xs text-charcoal-600 max-w-md mx-auto mb-6">
        Our atelier engineering system encountered an issue while rendering this view.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-emerald-900 transition-colors"
        >
          Attempt Recovery
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-white border border-gold-300 text-emerald-950 text-xs uppercase tracking-widest font-semibold rounded-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

