import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="bg-[#4A0B13] text-white py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2AA6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B1E2D]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-[#C2AA6A]/40 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85"
              alt="Artisan jeweler meticulously crafting a fine gold necklace by hand at Rishi Lal Jewellers"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A0B13]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Text Column */}
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2AA6A] font-sans font-semibold mb-4">
              Our Heritage & Pedigree
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6 font-normal">
              Crafted with Passion.
              <br />
              <span className="italic font-light text-[#C2AA6A]">Treasured for Generations.</span>
            </h2>

            <div className="w-16 h-0.5 bg-[#C2AA6A] mb-8" />

            <p className="text-[#F8F5EF]/85 font-sans text-sm sm:text-base leading-relaxed mb-5">
              At Rishi Lal Jewellers, every piece tells a story — one of heritage, devotion, and
              uncompromising artistry. Rooted in India&apos;s centuries-old jewelry traditions, our
              master artisans blend time-honoured techniques with contemporary elegance to create
              adornments that transcend fleeting trends.
            </p>

            <p className="text-[#F8F5EF]/85 font-sans text-sm sm:text-base leading-relaxed mb-8">
              Each creation is fashioned from ethically sourced, 100% BIS-hallmarked gold and set with
              IGI-certified natural diamonds and precious gemstones. From the first sketch to the
              final polish, our commitment to perfection ensures that every jewel is worthy of the
              moments it celebrates.
            </p>

            <div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#C2AA6A] font-sans text-xs sm:text-sm font-semibold uppercase tracking-widest group transition-colors hover:text-white"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
