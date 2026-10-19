import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-2 border-gold-300 border-t-emerald-950 rounded-full animate-spin mb-4" />
      <span className="font-serif text-sm tracking-widest text-emerald-950 uppercase font-medium">
        Loading Rishi Lal Jewellers...
      </span>
    </div>
  );
}

