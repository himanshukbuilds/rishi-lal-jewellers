'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Gem,
  Users,
  Eye,
  ShoppingBag,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

/**
 * VisitOurStoreSection
 * Premium luxury showcase for Rishi Lal Jewellers' physical showroom in Baharagora.
 * 
 * @param {Object} props
 * @param {string} [props.storeImage] - Path to the showroom image (defaults to official photo)
 * @param {string} [props.storeImageAlt] - Accessible alt text for the photo
 */
export default function VisitOurStoreSection({
  storeImage = '/images/store/rishi_lal_jewellers_showroom.jpg',
  storeImageAlt = 'Rishi Lal Jewellers Showroom - Rajlabandh, Main Road, Baharagora',
}) {
  const primaryPhone = BRAND_CONFIG?.contact?.phoneRaw || '9835322525';
  const primaryPhoneDisplay = BRAND_CONFIG?.contact?.phone || '+91 98353 22525';
  const secondaryPhone = BRAND_CONFIG?.contact?.phoneSecondaryRaw || '9431543122';
  const secondaryPhoneDisplay = BRAND_CONFIG?.contact?.phoneSecondary || '+91 94315 43122';

  const mapsUrl =
    BRAND_CONFIG?.flagshipStore?.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Rishi+Lal+Jewellers,+Rajlabandh,+Main+Road,+Baharagora,+East+Singhbhum,+Jharkhand+832101';

  const highlights = [
    {
      icon: Gem,
      title: 'Explore Our Collections',
      description: 'Discover beautiful designs across gold, diamond and silver jewellery.',
    },
    {
      icon: Users,
      title: 'Personal Assistance',
      description: 'Get help choosing jewellery for weddings, celebrations and everyday occasions.',
    },
    {
      icon: Eye,
      title: 'See the Details Up Close',
      description: 'Experience the beauty, finish and craftsmanship of our jewellery in person.',
    },
    {
      icon: ShoppingBag,
      title: 'A Personal Shopping Experience',
      description: 'Take your time exploring designs and finding something special.',
    },
  ];

  return (
    <section
      aria-labelledby="visit-our-store-heading"
      className="relative bg-gradient-to-b from-[#FDFBF7] via-white to-[#F9F6F0] py-10 sm:py-16 md:py-20 border-b border-[#E6DFD3]/80 overflow-hidden"
    >
      {/* Subtle luxury ambient background glows */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-gold-200/25 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-900/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Store Showroom Image Column (5 of 12 cols on desktop) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="group relative">
              {/* Outer decorative gold frame */}
              <div
                className="absolute inset-0 sm:-inset-3 rounded-sm border border-[#C2AA6A]/40 bg-gradient-to-tr from-[#C2AA6A]/10 via-transparent to-[#8B1E2D]/5 rotate-0 sm:-rotate-1 group-hover:rotate-0 transition-transform duration-500 pointer-events-none"
                aria-hidden="true"
              />

              {/* Main Image Container */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-sm overflow-hidden bg-ivory-100 border border-[#C2AA6A]/60 shadow-xl shadow-stone-900/10 transition-all duration-500 group-hover:shadow-2xl">
                <Image
                  src={storeImage}
                  alt={storeImageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                  priority
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Subtle vignette gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Bottom Showroom Tag on Image */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-sm bg-emerald-950/90 backdrop-blur-md border border-gold-400/30 text-ivory-50 flex items-center justify-between gap-2 shadow-lg">
                  <div className="min-w-0">
                    <p className="font-serif text-xs sm:text-sm font-medium text-gold-300 tracking-wide truncate">
                      Rishi Lal Jewellers Showroom
                    </p>
                    <p className="font-sans text-[11px] text-ivory-200/90 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                      <span>Main Road, Baharagora, Jharkhand</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-sans font-semibold uppercase tracking-wider text-emerald-950 bg-gold-400 px-2 py-0.5 rounded-[2px]">
                    BIS 916
                  </span>
                </div>
              </div>

              {/* Verified badge top corner */}
              <div className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 bg-[#8B1E2D] text-gold-200 border border-gold-400/50 shadow-md px-3 py-1 rounded-sm text-[11px] font-serif tracking-wider flex items-center gap-1.5 z-20">
                <Sparkles className="w-3 h-3 text-gold-300" />
                <span>Boutique Showroom</span>
              </div>
            </div>
          </div>

          {/* Content & Highlights Column (7 of 12 cols on desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            {/* Header Area */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-[1.5px] bg-[#8B1E2D]" />
                <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#8B1E2D] font-bold">
                  Boutique Experience
                </span>
              </div>

              <h2
                id="visit-our-store-heading"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl text-emerald-950 font-normal tracking-tight leading-tight"
              >
                Experience the Elegance – Visit Our Store
              </h2>

              <div className="w-16 h-0.5 bg-[#C2AA6A] mt-3 mb-4" />

              <p className="font-sans text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl">
                More than just jewellery, discover a tradition of beauty, craftsmanship and trust. We welcome you to visit Rishi Lal Jewellers and explore our collections in person.
              </p>
            </div>

            {/* Highlights Grid (2x2 on sm screens, clean card style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-sm bg-white border border-[#E6DFD3] hover:border-[#C2AA6A] transition-all duration-300 shadow-sm hover:shadow-md group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-sm bg-[#F8F5EF] border border-[#E6DFD3] text-[#8B1E2D] group-hover:bg-[#8B1E2D] group-hover:text-gold-200 group-hover:border-[#8B1E2D] transition-colors shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-semibold text-emerald-950 text-xs sm:text-sm tracking-wide">
                        {item.title}
                      </h3>
                      <p className="font-sans text-[11px] sm:text-xs text-charcoal-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call-to-Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Button 1: Get Directions */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.18em] font-semibold rounded-sm transition-all duration-200 border border-[#C2AA6A]/40 shadow-sm hover:shadow-md group"
              >
                <MapPin className="w-4 h-4 text-gold-300 transition-transform group-hover:-translate-y-0.5" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Button 2: Call Our Store */}
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-emerald-950 text-emerald-950 hover:text-gold-200 text-xs uppercase tracking-[0.18em] font-semibold rounded-sm transition-all duration-200 border border-emerald-950/70 shadow-sm hover:shadow-md group"
              >
                <Phone className="w-4 h-4 text-[#8B1E2D] group-hover:text-gold-300 transition-colors" />
                <span>Call Our Store</span>
                <span className="font-mono text-[11px] font-normal opacity-75 group-hover:opacity-90">
                  ({primaryPhoneDisplay})
                </span>
              </a>
            </div>

            {/* Secondary Phone Quick Helper */}
            <p className="font-sans text-[11px] text-charcoal-500 pt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span>
                Alternate store desk:{' '}
                <a
                  href={`tel:${secondaryPhone}`}
                  className="font-medium text-emerald-950 hover:text-[#8B1E2D] underline underline-offset-2 transition-colors"
                >
                  {secondaryPhoneDisplay}
                </a>{' '}
                • Mon–Sun: 10:00 AM – 8:00 PM
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

