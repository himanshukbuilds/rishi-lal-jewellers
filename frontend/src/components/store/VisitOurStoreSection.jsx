'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Gem,
  Award,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

/**
 * VisitOurStoreSection
 * A luxury showroom showcase component for the flagship store.
 *
 * All text fields and contact information are customizable via props with
 * sensible defaults drawn from the centralized `BRAND_CONFIG`.
 *
 * @param {Object} props
 * @param {string} [props.heading] - Main section title
 * @param {string} [props.subheading] - Editorial subtitle
 * @param {string} [props.description] - Welcoming brand narrative
 * @param {string} [props.storeName] - Name of the boutique showroom
 * @param {string} [props.address] - Physical showroom address
 * @param {string} [props.openingHours] - Store operating days and hours
 * @param {string} [props.contactNumber] - Display telephone/contact number
 * @param {string} [props.contactNumberRaw] - Raw numeric string for tel: link
 * @param {string} [props.mapsUrl] - External Google Maps directions URL
 * @param {string} [props.storeImage] - Path to showroom interior/exterior image
 * @param {string} [props.storeImageAlt] - Image accessibility description
 * @param {string} [props.buttonText] - Label for the Google Maps button
 */
export default function VisitOurStoreSection({
  heading = 'Visit Our Store',
  subheading = 'Discover the Beauty of Jewelry in Person',
  description = 'Step into our world of timeless elegance. Explore our exclusive jewelry collections, experience exceptional craftsmanship, and find the perfect piece for every special moment.',
  storeName = BRAND_CONFIG?.flagshipStore?.name || BRAND_CONFIG?.name || 'Rishi Lal Jewellers',
  address = BRAND_CONFIG?.flagshipStore?.formattedAddress ||
    'Rajlabandh, Main Road, Baharagora, East Singhbhum, Jharkhand – 832101',
  openingHours = BRAND_CONFIG?.contact?.hours ||
    'Monday – Sunday: 10:00 AM – 8:00 PM IST',
  contactNumber = BRAND_CONFIG?.contact?.phone || '+91 98353 22525',
  contactNumberRaw = BRAND_CONFIG?.contact?.phoneRaw || '9835322525',
  mapsUrl = BRAND_CONFIG?.flagshipStore?.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=Rishi+Lal+Jewellers,+Rajlabandh,+Main+Road,+Baharagora,+East+Singhbhum,+Jharkhand+832101',
  storeImage = '/images/store/rishi_lal_jewellers_showroom.jpg',
  storeImageAlt = 'Rishi Lal Jewellers Luxury Showroom & Fine Jewellery Boutique Interior',
  buttonText = 'Visit Our Store',
}) {
  const showroomPerks = [
    {
      icon: Gem,
      label: 'Curated Bridal Suites',
    },
    {
      icon: Award,
      label: '100% BIS Hallmarked Purity',
    },
    {
      icon: ShieldCheck,
      label: 'Bespoke Custom Orders',
    },
  ];

  return (
    <section
      id="visit-our-store"
      aria-labelledby="visit-our-store-heading"
      className="relative bg-gradient-to-b from-[#FDFBF7] via-white to-[#F8F5EF] py-14 sm:py-20 lg:py-24 border-t border-[#E6DFD3]/80 overflow-hidden"
    >
      {/* Ambient background lighting */}
      <div
        className="absolute top-1/4 -left-24 w-96 h-96 bg-[#C2AA6A]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-80 h-80 bg-[#8B1E2D]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Split Layout (Desktop 2-Col, Mobile Stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Column 1: High-Quality Luxury Storefront Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative group">
              {/* Outer decorative champagne gold border frame */}
              <div
                className="absolute -inset-2 sm:-inset-3 rounded-2xl border border-[#C2AA6A]/35 bg-gradient-to-tr from-[#C2AA6A]/15 via-transparent to-[#8B1E2D]/10 transition-transform duration-700 ease-out group-hover:scale-[1.01] pointer-events-none"
                aria-hidden="true"
              />

              {/* Main Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#F5F0E6] border border-[#C2AA6A]/40 shadow-xl shadow-stone-900/10 transition-all duration-500 group-hover:shadow-2xl">
                <Image
                  src={storeImage}
                  alt={storeImageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority={false}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Subtle vignette gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Showroom Badge on Image Bottom */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-3 shadow-lg">
                  <div className="min-w-0">
                    <p className="font-serif text-sm sm:text-base font-semibold text-[#D8C596] tracking-wide truncate">
                      {storeName}
                    </p>
                    <p className="font-sans text-xs text-stone-200 truncate flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C2AA6A] shrink-0" />
                      <span className="truncate">{address}</span>
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-black bg-[#C2AA6A] px-2.5 py-1 rounded">
                    Flagship
                  </span>
                </div>
              </div>

              {/* Floating boutique badge top right */}
              <div className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 bg-[#8B1E2D] text-[#FAF7EE] border border-[#C2AA6A]/60 shadow-lg px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider flex items-center gap-1.5 z-20">
                <Sparkles className="w-3.5 h-3.5 text-[#D8C596]" />
                <span>Showroom Experience</span>
              </div>
            </div>
          </div>

          {/* Column 2: Store Information & Actions */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 sm:space-y-7">
            {/* Header / Subheading Section */}
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#C2AA6A]/40 text-[#8B1E2D] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
                <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold">
                  Personal Consultation
                </span>
              </div>

              <h2
                id="visit-our-store-heading"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#292923] font-normal tracking-tight leading-tight"
              >
                {heading}
              </h2>

              <p className="font-serif text-base sm:text-lg lg:text-xl text-[#A89052] font-medium mt-2 tracking-wide">
                {subheading}
              </p>

              {/* Gold Divider */}
              <div className="w-16 h-0.5 bg-[#C2AA6A] mt-3.5 mb-4 rounded-full" />

              <p className="font-sans text-sm sm:text-base text-[#454545] leading-relaxed max-w-xl">
                {description}
              </p>
            </div>

            {/* Structured Store Information Cards */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Address Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E6DFD3] hover:border-[#C2AA6A] transition-colors duration-300 shadow-sm flex items-start gap-3.5 group">
                <div className="p-2.5 rounded-lg bg-[#FAF7EE] border border-[#E6DFD3] text-[#8B1E2D] group-hover:bg-[#8B1E2D] group-hover:text-[#FAF7EE] group-hover:border-[#8B1E2D] transition-colors duration-300 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-xs uppercase tracking-wider text-[#A89052] font-semibold">
                    Showroom Address
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-[#292923] mt-0.5 font-medium leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              {/* Opening Hours Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E6DFD3] hover:border-[#C2AA6A] transition-colors duration-300 shadow-sm flex items-start gap-3.5 group">
                <div className="p-2.5 rounded-lg bg-[#FAF7EE] border border-[#E6DFD3] text-[#8B1E2D] group-hover:bg-[#8B1E2D] group-hover:text-[#FAF7EE] group-hover:border-[#8B1E2D] transition-colors duration-300 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-xs uppercase tracking-wider text-[#A89052] font-semibold">
                    Opening Hours
                  </p>
                  <p className="font-sans text-xs sm:text-sm text-[#292923] mt-0.5 font-medium">
                    {openingHours}
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E6DFD3] hover:border-[#C2AA6A] transition-colors duration-300 shadow-sm flex items-start gap-3.5 group">
                <div className="p-2.5 rounded-lg bg-[#FAF7EE] border border-[#E6DFD3] text-[#8B1E2D] group-hover:bg-[#8B1E2D] group-hover:text-[#FAF7EE] group-hover:border-[#8B1E2D] transition-colors duration-300 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-xs uppercase tracking-wider text-[#A89052] font-semibold">
                    Store Assistance & Appointments
                  </p>
                  <a
                    href={`tel:${contactNumberRaw}`}
                    className="font-sans text-xs sm:text-sm text-[#292923] hover:text-[#8B1E2D] mt-0.5 font-medium inline-block transition-colors"
                  >
                    {contactNumber}
                  </a>
                </div>
              </div>
            </div>

            {/* Perks Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {showroomPerks.map((perk, i) => {
                const PerkIcon = perk.icon;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#E6DFD3] text-[#716D64] text-[11px] sm:text-xs font-sans"
                  >
                    <PerkIcon className="w-3 h-3 text-[#C2AA6A]" />
                    <span>{perk.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {/* Primary Button: Visit Our Store / Get Directions */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${buttonText} - Opens Google Maps for ${storeName}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#8B1E2D] to-[#63101C] hover:from-[#63101C] hover:to-[#4A0B13] text-[#FAF7EE] text-xs uppercase tracking-[0.18em] font-semibold rounded-xl border border-[#C2AA6A]/50 shadow-md hover:shadow-xl hover:shadow-[#8B1E2D]/20 transform transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <Navigation className="w-4 h-4 text-[#D8C596] transition-transform duration-300 group-hover:rotate-45" />
                <span>{buttonText}</span>
                <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              {/* Secondary Button: Call Our Store */}
              <a
                href={`tel:${contactNumberRaw}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FAF7EE] text-[#292923] hover:text-[#8B1E2D] text-xs uppercase tracking-[0.18em] font-semibold rounded-xl border border-[#E6DFD3] hover:border-[#C2AA6A] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-4 h-4 text-[#8B1E2D]" />
                <span>Call Store</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
