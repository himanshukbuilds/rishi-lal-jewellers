'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, ChevronDown, ArrowLeft, ShieldCheck, Gem } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';

const categoryBanners = {
  traditional: { title: 'Traditional Wear', tagline: 'Classic gold jewelry with a heritage soul', desc: 'Discover heritage inspired necklaces, jhumkas, bangles and timeless gold creations.', bannerImg: '/images/categories/traditional.jpg' },
  'daily-wear': { title: 'Casual & Daily Wear', tagline: 'Quiet elegance for every day', desc: 'Explore delicate gold pieces, modern designs and lightweight favorites for everyday styling.', bannerImg: '/images/categories/daily-wear.jpg' },
  ethnic: { title: 'Ethnic & Festive', tagline: 'Made for moments worth celebrating', desc: 'Statement ethnic jewelry, gemstones and antique gold for every celebration.', bannerImg: '/images/categories/traditional.jpg' },
  bridal: {
    title: 'Grand Bridal Heritage',
    tagline: 'Imperial wedding sets, jadau chokers & haathphools',
    desc: 'Crafted for the Indian bride’s royal moment. Every creation is forged in 22KT gold with syndicate polki diamonds and verified BIS HUID hallmarks.',
    bannerImg: '/images/categories/bridal.jpg',
  },
  diamond: {
    title: 'Natural Solitaire Diamonds',
    tagline: 'IGI & GIA certified solitaires of exceptional fire',
    desc: 'Conflict-free natural diamonds graded for VVS clarity and E-F colorless perfection. Solitaire engagement rings, tennis bracelets, and diamond studs.',
    bannerImg: '/images/categories/diamond.jpg',
  },
  gold: {
    title: '22K Temple & Heritage Gold',
    tagline: '100% BIS Hallmarked auspicious 916 gold jewelry',
    desc: 'Sacred nakshi embossing, antique finish haars, and divine Lakshmi chokers forged by hereditary goldsmiths of South and Western India.',
    bannerImg: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85',
  },
  earrings: {
    title: 'Royal Earrings & Jhumkas',
    tagline: 'From celestial studs to majestic chandbalis',
    desc: 'Earrings sculpted with filigree scrollwork, hanging golden bells, and brilliant solitaires that frame the face with timeless poise.',
    bannerImg: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
  },
  rings: {
    title: 'Statement & Solitaire Rings',
    tagline: 'Eternal diamond bands & gemstone cocktail rings',
    desc: 'Six-prong solitaire platinum crowns, royal navratna bands, and Burma ruby cocktail rings forged in solid gold.',
    bannerImg: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=85',
  },
  necklaces: {
    title: 'Haars, Collars & Mangalsutras',
    tagline: 'Layered royal haars & modern daily necklaces',
    desc: 'From contemporary diamond mangalsutras to multi-strand emerald haars and choker collars.',
    bannerImg: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=1600&q=85',
  },
  bangles: {
    title: 'Kadas, Bangles & Bracelets',
    tagline: 'Die-struck royal elephant kadas & diamond tennis bracelets',
    desc: 'Heavy solid gold bangles, Jaipur meenakari blossoms, and fluid diamond bracelets with double security clasps.',
    bannerImg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
  },
  gifts: {
    title: 'Precious Keepsakes & Gifts',
    tagline: 'Treasured jewelry for milestones and anniversaries',
    desc: 'Fine pendants, gold chains, and solitaire keepsakes packaged in Rishi Lal signature emerald velvet jewellery caskets.',
    bannerImg: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1600&q=85',
  },
  'silver-idols': {
    title: 'Divine Silver Idols',
    tagline: '999 pure solid silver sacred murtis & devotional keepsakes',
    desc: 'Handcrafted solid sterling silver Lord Ganesha and Lakshmi idols with divine blessings, mirror polish reflections, and intricate traditional nakshi details.',
    bannerImg: '/images/collections/silver-idols.jpg',
  },
  'gold-coins': {
    title: '24K Auspicious Gold Coins',
    tagline: '999 purity certified bullion coins with BIS HUID hallmark',
    desc: 'Auspicious pure 24KT Lakshmi and Ganesha gold coins and investment grade bullion with tamper-proof certification and reeded edges.',
    bannerImg: '/images/collections/gold-coins.jpg',
  },
  'under-50k': {
    title: 'Curated Jewels Under ₹50,000',
    tagline: 'Timeless luxury within reach',
    desc: 'Explore handcrafted gold pendants, diamond studs, and delicate chains priced under ₹50,000 from Rishi Lal Jewellers.',
    bannerImg: '/images/collections/under-50k.jpg',
  },
  women: {
    title: 'Women Jewellery',
    tagline: 'Exquisite creations celebrating grace, tradition & modern brilliance',
    desc: 'Discover handcrafted bridal suites, solitaire diamond earrings, 22KT gold bangles, and precious gemstone rings created for every milestone of womanhood.',
    bannerImg: '/images/gender/women.jpg',
  },
  men: {
    title: 'Men Jewellery',
    tagline: 'Distinctive elegance & commanding heritage craftsmanship',
    desc: 'Explore 22KT solid gold signet rings, handcrafted royal kadas, and precision-engineered chains designed for the modern gentleman.',
    bannerImg: '/images/gender/men.jpg',
  },
  kids: {
    title: 'Kids Jewellery',
    tagline: 'Auspicious first treasures & keepsake family heirlooms',
    desc: 'Delicate, skin-safe 22KT gold nazariya bracelets, lightweight blossom balis, and protective fine jewelry crafted with smooth safety clasps.',
    bannerImg: '/images/gender/kids.jpg',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug || '').toLowerCase();
  const [sort, setSort] = useState('newest');

  const banner = categoryBanners[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection`,
    tagline: 'Handcrafted haute jewelry by Rishi Lal Jewellers',
    desc: 'Explore our certified luxury jewelry handcrafted in hallmarked gold and certified diamonds.',
    bannerImg: '/images/categories/traditional.jpg',
  };

  const isGenderCategory = ['women', 'men', 'kids'].includes(slug);

  const { data, isLoading } = useQuery({
    queryKey: ['category-products', slug, sort],
    queryFn: () =>
      api.getProducts({
        categorySlug: isGenderCategory
          ? undefined
          : ({
              traditional: 'gold,bangles,necklaces,earrings',
              'daily-wear': 'gold,earrings,rings',
              ethnic: 'rings,earrings,bangles',
              bridal: 'bridal',
              'silver-idols': 'gifts,gold',
              'gold-coins': 'gold',
              'under-50k': 'gold,earrings,rings',
            }[slug] || slug),
        gender: isGenderCategory ? slug : undefined,
        maxPrice: slug === 'under-50k' ? 50000 : undefined,
        sort,
        limit: 24,
      }),
  });

  const products = data?.products || [];

  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* Category Hero Banner */}
      <div className="relative bg-[#F1ECE3] text-[#292923] py-9 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#8B1E2D] hover:text-[#4A0B13] uppercase tracking-widest font-sans mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Jewelry Collections</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#292923]">
            {banner.title}
          </h1>
          <p className="font-serif italic text-[#B49A58] text-base sm:text-lg mt-2">
            {banner.tagline}
          </p>
          <div className="w-12 h-px bg-[#C2AA6A] mx-auto mt-3" />
          <p className="font-sans text-xs sm:text-sm text-[#716D64] mt-3 max-w-xl mx-auto leading-relaxed">
            {banner.desc}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold-200">
          <p className="font-sans text-xs text-charcoal-600">
            Showing <span className="font-bold text-emerald-950">{products.length}</span> creations in {banner.title}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 font-sans hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-gold-300 text-xs text-emerald-950 py-1.5 pl-3 pr-8 rounded-sm focus:outline-none focus:border-gold-600 font-sans cursor-pointer shadow-sm"
              >
                <option value="newest">Newest Additions</option>
                <option value="bestseller">Bestselling First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gold-700 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-sm aspect-[3/4] border border-gold-200/50" />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty Category */}
        {!isLoading && products.length === 0 && (
          <div className="bg-white rounded-sm border border-gold-300/40 p-12 text-center max-w-md mx-auto my-8">
            <p className="font-serif text-lg text-emerald-950 mb-2">
              No creations currently available in this category.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm"
            >
              Browse All Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

