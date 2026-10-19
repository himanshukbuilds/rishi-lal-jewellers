'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/config/brandConfig';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.availableSizes ? product.availableSizes[0] : 'Standard');
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const [imgSrc, setImgSrc] = useState(
    product.images && product.images[0]
      ? product.images[0]
      : '/images/placeholder.jpg'
  );

  return (
    <div className="group relative flex flex-col bg-white rounded-sm border border-[#E6DFD3] hover:border-[#C2AA6A]/60 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-500">
      {/* Image Container */}
      <Link href={`/products/${product.slug || productId}`} className="relative block aspect-square overflow-hidden bg-[#F8F5EF]">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          onError={() => setImgSrc('/images/placeholder.jpg')}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#4A0B13] text-[#C2AA6A] border border-[#C2AA6A]/30">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#C2AA6A] text-[#4A0B13] font-bold">
              New Arrival
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#8B1E2D] text-white">
              {product.discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-300 z-10 ${
            inWishlist
              ? 'bg-[#FAF2F0] text-[#DEB1A8] shadow-md'
              : 'bg-white/85 backdrop-blur-sm text-charcoal-700 hover:text-[#DEB1A8] hover:bg-white shadow-sm'
          }`}
          aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-[#DEB1A8]' : ''}`} />
        </button>

        {/* Quick Add Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 text-xs uppercase tracking-widest font-medium rounded-sm flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 ${
              added
                ? 'bg-[#4A0B13] text-[#C2AA6A] border border-[#C2AA6A]'
                : 'bg-[#8B1E2D] text-white hover:bg-[#4A0B13] border border-[#C2AA6A]/40'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metal & Purity Tag */}
          <div className="flex items-center justify-between text-[11px] text-[#B49A58] font-sans uppercase tracking-wider mb-1 font-medium">
            <span>{product.purity || product.metalType || ''}</span>
            {product.grossWeight && <span className="text-charcoal-400">{product.grossWeight}g</span>}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-sm font-medium text-[#4A0B13] line-clamp-2 leading-snug group-hover:text-[#C2AA6A] transition-colors">
            <Link href={`/products/${product.slug || productId}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-3 pt-3 border-t border-[#E6DFD3] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold text-[#4A0B13]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-charcoal-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {product.rating != null && <div className="flex items-center gap-1 text-[11px] text-charcoal-600 font-sans">
            <Star className="w-3 h-3 fill-[#C2AA6A] text-[#C2AA6A]" />
            <span className="font-medium text-charcoal-800">{product.rating}</span>
            {product.reviewsCount != null && <span className="text-charcoal-400">({product.reviewsCount})</span>}
          </div>}
        </div>

        {/* Mobile Add to Bag Button */}
        <div className="mt-3 sm:hidden">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-widest font-medium rounded-sm flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}

