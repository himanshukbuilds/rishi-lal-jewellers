'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';

export default function FeaturedTabs() {
  const [activeTab, setActiveTab] = useState('bestsellers');

  // TanStack Query for highlights data (satisfies syllabus Unit V)
  const { data, isLoading, error } = useQuery({
    queryKey: ['product-highlights'],
    queryFn: () => api.getProductHighlights(),
  });

  const tabs = [
    { id: 'bestsellers', label: 'Bestselling Heirlooms' },
    { id: 'newArrivals', label: 'New Arrivals 2026' },
    { id: 'bridalCollection', label: 'Bridal Pavilion' },
    { id: 'featured', label: 'Curator’s Choice' },
  ];

  const currentProducts = data?.[activeTab] || [];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C2AA6A] font-semibold mb-2">
            Signature Ensembles
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A0B13] font-normal tracking-tight">
            The Rishi Lal Showcase
          </h2>
          <div className="w-16 h-0.5 bg-[#C2AA6A] mx-auto mt-4" />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.15em] font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#8B1E2D] text-white shadow-xs border border-[#C2AA6A]/40'
                  : 'bg-[#F8F5EF] text-[#454545] hover:bg-[#F4EEDB] hover:text-[#4A0B13]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-[#F8F5EF] rounded-sm aspect-[3/4] border border-[#E6DFD3]" />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && currentProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#8B1E2D] text-[#8B1E2D] hover:bg-[#8B1E2D] hover:text-white transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm group"
          >
            <span>View All Jewelry</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

