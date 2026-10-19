'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const GENDER_COLLECTIONS = [
  {
    id: 'women',
    title: 'Women Jewellery',
    subtitle: 'Bridal suites, diamond solitaires & temple gold',
    href: '/categories/women',
    image: '/images/gender/women.jpg',
    alt: 'Elegant Indian women wearing handcrafted fine jewellery in pastel traditional attire',
    itemCount: '14+ Creations',
  },
  {
    id: 'men',
    title: 'Men Jewellery',
    subtitle: 'Solid gold chains, signet rings & royal kadas',
    href: '/categories/men',
    image: '/images/gender/men.jpg',
    alt: 'Sophisticated Indian men wearing luxury gold chains, bracelets and signet rings',
    itemCount: '6+ Creations',
  },
  {
    id: 'kids',
    title: 'Kids Jewellery',
    subtitle: 'Skin-safe balis, nazariya bracelets & keepsakes',
    href: '/categories/kids',
    image: '/images/gender/kids.jpg',
    alt: 'Joyful Indian mother and young daughter wearing delicate heirloom children jewellery',
    itemCount: '4+ Creations',
  },
];

export default function ShopByGender() {
  return (
    <section
      className="bg-white py-14 sm:py-20 lg:py-24 border-b border-[#E6DFD3]/60"
      aria-labelledby="curated-for-you-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Reference Image 1 */}
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <h2
            id="curated-for-you-heading"
            className="font-serif text-3xl font-normal tracking-tight text-[#4A0B13] sm:text-4xl lg:text-5xl"
          >
            Curated For You
          </h2>
          <p className="mt-2 font-serif italic text-base sm:text-lg text-[#716D64]">
            Shop By Gender
          </p>
          <div className="mx-auto mt-3.5 h-0.5 w-16 bg-[#C2AA6A]" />
        </header>

        {/* 3-Card Grid in single row on desktop matching Reference Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {GENDER_COLLECTIONS.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1E2D] focus-visible:ring-offset-4 rounded-3xl"
            >
              {/* Photographic Card with smooth hover zoom & subtle rounded corners */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 bg-[#F8F5EF] shadow-sm transition-all duration-500 group-hover:shadow-xl">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={index === 0}
                />

                {/* Subtle bottom gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Corner quick link pill visible on hover */}
                <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#4A0B13] shadow-md backdrop-blur-xs transition-transform group-hover:scale-105">
                    <ArrowUpRight className="h-4 w-4 text-[#C2AA6A]" />
                  </span>
                </div>
              </div>

              {/* Card Title neatly centered below the image matching Reference Image 1 */}
              <div className="mt-4 sm:mt-5 text-center">
                <h3 className="font-serif text-xl sm:text-2xl text-[#292923] font-normal transition-colors duration-300 group-hover:text-[#8B1E2D]">
                  {item.title}
                </h3>
                <p className="mt-1 font-sans text-xs text-[#716D64] hidden sm:block">
                  {item.subtitle}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C2AA6A] opacity-0 transition-all duration-300 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

