'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, ExternalLink, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ChatProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.imageUrl || (product.images && product.images[0]) || '/images/categories/wedding.jpg'
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product, 1, 'Standard');
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch (err) {
      console.warn('Could not add to cart:', err);
    }
  };

  const formattedPrice = `₹${Number(product.price || 0).toLocaleString('en-IN')}`;
  const formattedOriginalPrice = product.originalPrice
    ? `₹${Number(product.originalPrice).toLocaleString('en-IN')}`
    : null;

  return (
    <div className="group relative flex w-[230px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-[#C2AA6A]/30 bg-white shadow-sm transition-all duration-300 hover:border-[#C2AA6A] hover:shadow-md">
      {/* Product Image */}
      <Link
        href={product.productUrl || `/products/${product.slug}`}
        className="relative block h-32 w-full overflow-hidden bg-ivory-100"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="230px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc('/images/categories/wedding.jpg')}
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded bg-[#4A0B13] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#C2AA6A]">
            {product.discountPercentage}% Off
          </span>
        )}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#4A0B13] shadow-sm backdrop-blur-xs">
          <Sparkles className="h-2.5 w-2.5 text-[#C2AA6A]" />
          <span>{product.rating || '4.9'}</span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C2AA6A]">
          {product.purity || product.category || 'BIS Hallmarked'}
        </p>

        <Link
          href={product.productUrl || `/products/${product.slug}`}
          className="mt-1 line-clamp-1 font-serif text-xs font-semibold text-[#4A0B13] transition-colors hover:text-[#C2AA6A]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-serif text-sm font-bold text-[#4A0B13]">
            {formattedPrice}
          </span>
          {formattedOriginalPrice && formattedOriginalPrice !== formattedPrice && (
            <span className="text-[10px] text-charcoal-400 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-1.5 pt-1">
          <Link
            href={product.productUrl || `/products/${product.slug}`}
            className="flex-1 rounded-md border border-[#4A0B13]/20 bg-ivory-50 px-2 py-1.5 text-center text-[10px] font-medium text-[#4A0B13] transition-colors hover:bg-[#4A0B13] hover:text-white"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            type="button"
            className={`flex items-center justify-center rounded-md px-2.5 py-1.5 text-[10px] font-medium transition-all ${
              added
                ? 'bg-[#8B1E2D] text-white'
                : 'bg-[#4A0B13] text-[#C2AA6A] hover:bg-[#8B1E2D]'
            }`}
            title="Add to Bag"
          >
            {added ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

