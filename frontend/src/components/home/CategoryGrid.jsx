'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const leftColumnCategories = [
  {
    name: 'Wedding & Bridal',
    slug: 'bridal',
    image: '/images/categories/bridal.jpg',
    alt: 'Bridal jewellery collection',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[420px]',
    objectPosition: 'object-[center_20%]',
    priority: true,
  },
  {
    name: 'Traditional Wear',
    slug: 'traditional',
    image: '/images/categories/traditional.jpg',
    alt: 'Traditional Indian jewellery collection',
    heightClass: 'h-[400px] sm:h-[460px] lg:h-[540px]',
    objectPosition: 'object-[center_20%]',
    priority: false,
  },
];

const rightColumnCategories = [
  {
    name: 'Casual & Daily Wear',
    slug: 'daily-wear',
    image: '/images/categories/daily-wear.jpg',
    alt: 'Casual and daily wear jewellery collection',
    heightClass: 'h-[400px] sm:h-[460px] lg:h-[540px]',
    objectPosition: 'object-[center_20%]',
    priority: true,
  },
  {
    name: 'Ethnic & Festive',
    slug: 'ethnic',
    image: '/images/categories/ethnic.png',
    alt: 'Ethnic and festive jewellery collection',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[420px]',
    objectPosition: 'object-[center_25%]',
    priority: false,
  },
];

function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      aria-label={category.name}
      className={`group relative isolate block w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#26050B] shadow-sm transition-shadow duration-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2AA6A] ${category.heightClass}`}
    >
      <Image
        src={category.image}
        alt={category.alt}
        fill
        priority={category.priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${category.objectPosition}`}
      />

      {/* Elegant bottom vignette gradient matching Tanishq: preserves upper 65% crystal clear */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#26050B]/90 via-[#3B0710]/40 via-20% to-transparent to-40%"
        aria-hidden="true"
      />

      {/* Subtle frame border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 sm:rounded-2xl"
        aria-hidden="true"
      />

      {/* Centered serif category title positioned cleanly in the bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end px-4 pb-5 pt-0 text-center sm:pb-6 lg:pb-7">
        <h3 className="font-serif text-2xl font-normal tracking-wide text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 sm:text-3xl lg:text-4xl">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20" aria-labelledby="discover-categories-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B49A58]">
            Find your style
          </p>
          <h2
            id="discover-categories-title"
            className="font-serif text-3xl font-medium text-[#292923] sm:text-4xl"
          >
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-[#716D64] sm:text-base">
            Discover pieces for celebrations, traditions and every day.
          </p>
        </header>

        {/* Asymmetric 2-column masonry grid matching Tanishq layout */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Left Column: Shorter top card, taller bottom card */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {leftColumnCategories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>

          {/* Right Column: Taller top card, shorter bottom card */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {rightColumnCategories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
