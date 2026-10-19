'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function CollectionsShowcase() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24" aria-labelledby="collections-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C2AA6A]">
            Curated Treasures
          </p>
          <h2
            id="collections-heading"
            className="font-serif text-3xl font-normal tracking-tight text-[#4A0B13] sm:text-4xl lg:text-5xl"
          >
            Collections of Rishi Lal Jewellers
          </h2>
          <div className="mx-auto mt-3.5 h-0.5 w-16 bg-[#C2AA6A]" />
          <p className="mt-3.5 font-sans text-xs leading-relaxed text-[#555555] sm:text-sm">
            Handcrafted devotional heirlooms, certified bullion, and affordable fine jewelry crafted for every milestone.
          </p>
        </header>

        {/* Asymmetrical 2-Column Collection Layout matching Tanishq Reference */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {/* Card 1: Left Column — Tall Vertical Card (Under ₹50K) */}
          <Link
            href="/products?maxPrice=50000"
            className="group relative isolate block h-[420px] w-full overflow-hidden rounded-2xl border border-black/5 bg-[#4A0B13] shadow-sm transition-all duration-500 hover:shadow-xl sm:h-[520px] md:h-full md:min-h-[580px] lg:min-h-[620px]"
          >
            <Image
              src="/images/collections/under-50k.jpg"
              alt="Luxury rose gold and diamond pendant necklace on sage green silk"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            {/* Soft bottom-to-top gradient for maximum contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent opacity-50" />

            {/* Typography overlay at the bottom */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center text-white sm:p-8 lg:p-12">
              <h3 className="font-serif text-3xl font-normal tracking-wide text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 sm:text-4xl lg:text-5xl">
                Under ₹50K
              </h3>
              <div className="mt-2.5 flex items-center gap-1.5 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#E4D4A7]">
                  Explore Collection
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#E4D4A7]" />
              </div>
            </div>
          </Link>

          {/* Right Column — Two Shorter Stacked Cards */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {/* Card 2: Top-Right (Silver Idols) */}
            <Link
              href="/categories/silver-idols"
              className="group relative isolate block h-[260px] w-full overflow-hidden rounded-2xl border border-black/5 bg-[#4A0B13] shadow-sm transition-all duration-500 hover:shadow-xl sm:h-[280px] md:h-[280px] lg:h-[298px]"
            >
              <Image
                src="/images/collections/silver-idols.jpg"
                alt="Intricately engraved 999 solid sterling silver Lord Ganesha idol on ivory podium"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dual gradient for perfect legibility across lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-40" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center text-white sm:p-7">
                <h3 className="font-serif text-2xl font-normal tracking-wide text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 sm:text-3xl lg:text-4xl">
                  Silver Idols
                </h3>
                <div className="mt-2 flex items-center gap-1.5 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#E4D4A7]">
                    Explore Collection
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#E4D4A7]" />
                </div>
              </div>
            </Link>

            {/* Card 3: Bottom-Right (Gold Coins) */}
            <Link
              href="/categories/gold-coins"
              className="group relative isolate block h-[260px] w-full overflow-hidden rounded-2xl border border-black/5 bg-[#4A0B13] shadow-sm transition-all duration-500 hover:shadow-xl sm:h-[280px] md:h-[280px] lg:h-[298px]"
            >
              <Image
                src="/images/collections/gold-coins.jpg"
                alt="24KT pure hallmarked gold Lakshmi and Ganesha coins on emerald velvet"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Deep crimson and black gradient matching the brand */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A0B13]/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-40" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 text-center text-white sm:p-7">
                <h3 className="font-serif text-2xl font-normal tracking-wide text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 sm:text-3xl lg:text-4xl">
                  Gold Coins
                </h3>
                <div className="mt-2 flex items-center gap-1.5 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#E4D4A7]">
                    Explore Collection
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#E4D4A7]" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

