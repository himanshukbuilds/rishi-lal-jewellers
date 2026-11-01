'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/config/brandConfig';

const isIndicative = (product) =>
  product.priceStatus === 'indicative' ||
  product.pricingType === 'indicative' ||
  product.availability === 'design-enquiry';

const isApprovedOrderable = (product) =>
  !isIndicative(product) &&
  product.pricingType !== 'price-on-request' &&
  product.isOrderable !== false &&
  Number(product.stock) > 0;

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const productId = product._id || product.id;
  const productUrl = `/products/${product.slug || productId}`;
  const indicative = isIndicative(product);
  const orderable = isApprovedOrderable(product);
  const inWishlist = isInWishlist(productId);

  const image =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    '/images/placeholder-jewelry.jpg';

  const categoryLabel = product.subcategory || product.category || 'Fine Jewellery';
  const metalDisplay = product.metalType || product.metal || null;

  // Specifications
  const specs = [
    product.purity && product.purity !== 'Not verified — AI concept only' ? product.purity : null,
    product.grossWeight && Number(product.grossWeight) > 0 ? `${product.grossWeight} g` : null,
  ].filter(Boolean);

  const availabilityText = indicative
    ? 'Indicative Price · Approval Required'
    : product.availability === 'made-to-order'
      ? 'Made to Order'
      : Number(product.stock) > 0
        ? 'In Stock · Ready to Dispatch'
        : 'Contact for Availability';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product, 1, product.availableSizes?.[0] || 'Standard');
    if (result) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-sm border border-[#E6DFD3] bg-white transition-all duration-500 hover:border-[#C2AA6A] hover:shadow-xl">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#FAF7F2]">
        <Link href={productUrl} aria-label={`View ${product.name}`} className="absolute inset-0 block">
          <SafeImage
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
            fallbackSrc="/images/placeholder-jewelry.jpg"
          />
        </Link>

        {/* Tag / Image Type Pill */}
        {product.imageType && (
          <span className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-3.5rem)] rounded-xs bg-[#FAF7F2]/90 px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-[#766F61] backdrop-blur-xs">
            {product.imageType === 'AI-Generated Concept Image' ? 'Design Concept' : 'Crafted Edition'}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm transition-all duration-300 hover:scale-110 ${
            inWishlist ? 'text-[#7D2934]' : 'text-[#766F61] hover:text-[#7D2934]'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category & Metal Tag */}
        <p className="min-h-4 text-[9px] font-semibold uppercase tracking-[.18em] text-[#9B8050]">
          {categoryLabel}
          {metalDisplay ? ` · ${metalDisplay}` : ''}
        </p>

        {/* Product Title */}
        <Link
          href={productUrl}
          className="mt-1.5 block min-h-[42px] font-serif text-[14px] leading-snug text-[#17382D] transition-colors hover:text-[#7D2934] sm:text-[15px]"
        >
          <span className="line-clamp-2">{product.name}</span>
        </Link>

        {/* Metal Specifications & Weight */}
        <p className="mt-1 min-h-[18px] text-[10px] text-[#766F61]">
          {specs.length > 0 ? specs.join(' · ') : 'Specifications verified on order'}
        </p>

        {/* Price & Status Section */}
        <div className="mt-3 border-t border-[#E6DFD3] pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-serif text-[17px] font-bold tracking-tight text-[#7D2934] sm:text-[19px]">
              {product.pricingType === 'price-on-request' || !(Number(product.price) > 0)
                ? 'Price on Request'
                : formatPrice(product.price)}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-[11px] text-[#A09A8E] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Indicative Notice */}
          {indicative && (
            <p className="mt-1 text-[9px] leading-3.5 text-[#826D43]">
              Indicative catalogue price · Subject to quotation
            </p>
          )}

          {/* Availability Status */}
          <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-[#8A604F]">
            {availabilityText}
          </p>
        </div>

        {/* Standardized ADD TO BAG Action */}
        <div className="mt-4 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className={`flex h-10 w-full items-center justify-center gap-2 rounded-xs px-4 text-[10px] font-semibold uppercase tracking-[.18em] transition-all duration-300 ${
              added
                ? 'border border-[#9B8050] bg-[#17382D] text-[#E7D19A]'
                : 'border border-[#7D2934] bg-[#7D2934] text-white hover:bg-[#5C1D26] hover:shadow-md'
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            <span>{added ? 'Added to Bag' : 'Add to Bag'}</span>
          </button>

          {added && (
            <button
              type="button"
              onClick={openCart}
              className="mt-1.5 w-full text-center text-[9px] uppercase tracking-wider text-[#7D2934] underline underline-offset-2"
            >
              View Shopping Bag
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
