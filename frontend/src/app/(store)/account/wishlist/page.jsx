'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="bg-ivory-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-gold-200 gap-4">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-1 text-xs text-gold-700 hover:text-emerald-950 font-sans mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-emerald-950">
              Curated Wishlist
            </h1>
          </div>
          <p className="text-xs text-charcoal-600 font-sans">
            {wishlistCount} {wishlistCount === 1 ? 'creation' : 'creations'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-gold-300/40 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-ivory-100 flex items-center justify-center text-gold-700 mx-auto mb-4 border border-gold-300/40">
              <Heart className="w-8 h-8 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-emerald-950 mb-1">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-charcoal-600 mb-6">
              Save your favorite bridal chokers, solitaires, and 22KT gold heirlooms to revisit anytime.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

