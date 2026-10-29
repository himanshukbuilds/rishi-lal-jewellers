'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/common/SafeImage';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Star,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

const Product3DViewer = dynamic(() => import('@/components/product/Product3DViewer'), {
  ssr: false,
  loading: () => <div className="aspect-square animate-pulse rounded-sm border border-gold-300/60 bg-white" aria-label="Loading 3D viewer" />,
});

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Component state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // TanStack Query for product details
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-details', id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  // Initialize selected size when product loads
  React.useEffect(() => {
    if (product && product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product, selectedSize]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-ivory-200 rounded-sm" />
          <div className="space-y-4">
            <div className="h-8 bg-ivory-200 w-3/4 rounded" />
            <div className="h-4 bg-ivory-200 w-1/4 rounded" />
            <div className="h-12 bg-ivory-200 w-1/2 rounded" />
            <div className="h-32 bg-ivory-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-2xl text-emerald-950 mb-3">Jewelry Piece Not Found</h2>
        <p className="text-xs text-charcoal-600 mb-6">
          The requested creation may have been acquired or is currently being curated in our private atelier.
        </p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : ['/images/placeholder.jpg'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || 'Standard');
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(pincode)) {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code (e.g. 110001, 400001).',
      });
      return;
    }

    setPincodeStatus({
      valid: true,
      message: 'PIN code format looks valid. Please contact us to confirm serviceability and delivery timing.',
    });
  };

  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-gold-200/60 bg-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-sans text-charcoal-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-emerald-950">Home</Link>
          <ChevronRight className="w-3 h-3 text-gold-600" />
          <Link href="/products" className="hover:text-emerald-950">Jewelry</Link>
          <ChevronRight className="w-3 h-3 text-gold-600" />
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-emerald-950">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gold-600" />
          <span className="font-medium text-emerald-950 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Multi-Image Gallery */}
          <div className="space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-sm overflow-hidden bg-white border border-gold-300/60 shadow-sm">
              {product.modelUrl ? (
                <Product3DViewer modelUrl={product.modelUrl} image={images[selectedImageIndex]} name={product.name} />
              ) : (
                <SafeImage
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-all duration-300"
                  fallbackSrc="/images/placeholder.jpg"
                />
              )}

              {(product.purity || product.metalType) && <div className="absolute top-4 left-4 bg-white/95 text-[#8B1E2D] text-[11px] font-sans px-3 py-1 rounded-sm border border-[#E6DFD3]">
                {product.purity || product.metalType}
              </div>}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-gold-500 shadow-sm'
                        : 'border-gold-200/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt={`View ${idx + 1}`} fill sizes="80px" className="object-contain p-1" fallbackSrc="/images/placeholder.jpg" />
                  </button>
                ))}
              </div>
            )}

            {product.purity && <div className="p-3 bg-white border border-[#E6DFD3] rounded-sm flex items-center gap-2 text-xs text-[#716D64]">
              <ShieldCheck className="w-4 h-4 text-[#B49A58]" />
              <span>Purity: {product.purity}</span>
            </div>}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="flex flex-col space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gold-800 font-sans uppercase tracking-widest font-semibold mb-1">
                <span>{product.category}</span>
                <span className="text-charcoal-400">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-emerald-950 leading-tight">
                {product.name}
              </h1>

              {/* Ratings, when provided by product data */}
              {product.rating != null && <div className="mt-2.5 flex items-center gap-2 text-xs text-charcoal-600 font-sans">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <span className="font-semibold text-charcoal-800">{product.rating}</span>
                {product.reviewsCount != null && <span>({product.reviewsCount} reviews)</span>}
              </div>}
            </div>

            {/* Price Presentation */}
            <div className="p-4 bg-white rounded-sm border border-gold-300/50 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-emerald-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-charcoal-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-xs bg-red-100 text-red-800 font-bold uppercase tracking-wider">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-charcoal-500">
                (Inclusive of all taxes & 3% Indian jewellery GST. Zero making charges on select festive designs.)
              </p>
            </div>

            {/* Quick Specs Pill Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
              <div className="p-2.5 bg-ivory-100 rounded-sm border border-gold-200">
                <span className="text-charcoal-500 text-[10px] uppercase block">Metal Purity</span>
                <span className="font-medium text-emerald-950">{product.purity}</span>
              </div>
              <div className="p-2.5 bg-ivory-100 rounded-sm border border-gold-200">
                <span className="text-charcoal-500 text-[10px] uppercase block">Gross Weight</span>
                <span className="font-medium text-emerald-950">{product.grossWeight} grams</span>
              </div>
              <div className="p-2.5 bg-ivory-100 rounded-sm border border-gold-200">
                <span className="text-charcoal-500 text-[10px] uppercase block">Net Gold Weight</span>
                <span className="font-medium text-emerald-950">{product.netGoldWeight || product.grossWeight} grams</span>
              </div>
            </div>

            {/* Size Selector */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 font-semibold">
                    Select Size:
                  </label>
                  <Link href="/faqs" className="text-[11px] text-gold-700 hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs font-sans font-medium rounded-sm border transition-all ${
                        selectedSize === sz
                          ? 'bg-emerald-950 text-gold-300 border-emerald-950 shadow-sm'
                          : 'bg-white text-charcoal-700 border-gold-300 hover:border-gold-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Primary Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-gold-300 rounded-sm bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-charcoal-600 hover:text-emerald-950 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-medium text-emerald-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-charcoal-600 hover:text-emerald-950 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-300 border border-[#C2AA6A]/40 shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-sm border transition-colors ${
                    inWishlist
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-charcoal-700 border-gold-300 hover:text-red-600'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-red-600' : ''}`} />
                </button>
              </div>

              {addedToCartToast && (
                <div className="p-3 bg-emerald-900 text-gold-300 rounded-sm text-xs flex items-center gap-2 animate-fade-in border border-gold-400/30">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Successfully added to your shopping bag!</span>
                </div>
              )}
            </div>

            {/* Delivery Pincode Checker */}
            <div className="p-4 bg-white rounded-sm border border-gold-300/50 space-y-2">
              <label className="font-serif text-xs uppercase tracking-wider text-emerald-950 font-semibold block">
                Check Delivery Availability
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Indian PIN Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-medium text-xs uppercase tracking-wider rounded-sm transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeStatus && (
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    pincodeStatus.valid ? 'text-emerald-800' : 'text-red-700'
                  }`}
                >
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-gold-200 pt-4">
              <div className="flex border-b border-gold-200">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-gold-500 text-emerald-950'
                      : 'border-transparent text-charcoal-500 hover:text-emerald-950'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('craft')}
                  className={`pb-2.5 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                    activeTab === 'craft'
                      ? 'border-gold-500 text-emerald-950'
                      : 'border-transparent text-charcoal-500 hover:text-emerald-950'
                  }`}
                >
                  Karigari Story
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 px-4 text-xs font-serif uppercase tracking-wider font-semibold border-b-2 transition-colors ${
                    activeTab === 'care'
                      ? 'border-gold-500 text-emerald-950'
                      : 'border-transparent text-charcoal-500 hover:text-emerald-950'
                  }`}
                >
                  Care & Returns
                </button>
              </div>

              <div className="py-4 text-xs text-charcoal-700 leading-relaxed font-sans">
                {activeTab === 'specs' && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <table className="w-full text-left border-collapse text-xs mt-3">
                      <tbody>
                        <tr className="border-b border-ivory-200">
                          <td className="py-1.5 font-medium text-emerald-950 w-1/3">Metal</td>
                          <td className="py-1.5">{product.metal}</td>
                        </tr>
                        <tr className="border-b border-ivory-200">
                          <td className="py-1.5 font-medium text-emerald-950">Hallmark</td>
                          <td className="py-1.5">{product.purity} (BIS Certified HUID)</td>
                        </tr>
                        <tr className="border-b border-ivory-200">
                          <td className="py-1.5 font-medium text-emerald-950">Gross Weight</td>
                          <td className="py-1.5">{product.grossWeight} g</td>
                        </tr>
                        {product.gemstones && product.gemstones.length > 0 && (
                          <tr className="border-b border-ivory-200">
                            <td className="py-1.5 font-medium text-emerald-950">Gemstones</td>
                            <td className="py-1.5">
                              {product.gemstones.map((g, i) => (
                                <span key={i}>
                                  {g.count}x {g.type} ({g.carat} ct, {g.clarity}, {g.color})
                                </span>
                              ))}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-1.5 font-medium text-emerald-950">Certification</td>
                          <td className="py-1.5">{product.certification || 'BIS Hallmarked'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'craft' && (
                  <div className="space-y-2">
                    <p className="font-serif italic text-sm text-emerald-950">
                      “Every jewel holds the devotion of traditional Indian karigars.”
                    </p>
                    <p>{product.craftsmanshipStory}</p>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-2">
                    <p>• Store individually in the provided velvet jewelry box to prevent abrasion.</p>
                    <p>• Clean gently with a soft microfiber cloth; avoid harsh chemical detergents.</p>
                    <p>• Enjoy 15-day complimentary exchange and lifetime buyback at any Rishi Lal atelier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gold-200">
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold mb-1">
                Complementary Pieces
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-emerald-950 font-normal">
                You May Also Admire
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

