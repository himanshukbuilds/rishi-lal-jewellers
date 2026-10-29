'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/config/brandConfig';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplying(true);
    setCouponFeedback(null);

    const res = await applyCoupon(couponInput.trim());
    setApplying(false);

    if (res.success) {
      setCouponFeedback({ success: true, message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ success: false, message: res.message });
    }
  };

  return (
    <div className="bg-ivory-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold mb-1">
            Shopping Bag
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-emerald-950 font-normal">
            Your Selected Treasures
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-3" />
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-gold-300/40 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-ivory-100 flex items-center justify-center text-gold-700 mx-auto mb-4 border border-gold-300/40">
              <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl text-emerald-950 font-medium mb-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs text-charcoal-600 mb-8 max-w-xs mx-auto">
              Explore our handcrafted collections and discover timeless fine jewelry designed for you.
            </p>
            <Link
              href="/products"
              className="px-8 py-3.5 bg-[#8B1E2D] text-white hover:bg-[#4A0B13] text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors inline-block"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Left: Cart Items Table (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-sm border border-gold-300/50 shadow-sm overflow-hidden">
                <div className="p-4 bg-[#4A0B13] text-[#C2AA6A] text-xs font-sans uppercase tracking-wider flex justify-between items-center">
                  <span>Jewelry Item ({itemCount})</span>
                  <button
                    onClick={clearCart}
                    className="text-ivory-300 hover:text-red-400 transition-colors text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gold-200/50">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedSize}`}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-300/40">
                          <SafeImage src={item.image} alt={item.name} fill sizes="100px" className="object-cover" fallbackSrc="/images/placeholder.jpg" />
                        </div>
                        <div>
                          <span className="text-[10px] font-sans text-gold-700 uppercase tracking-widest block">
                            {item.purity || '22KT Hallmarked'} • Size: {item.selectedSize}
                          </span>
                          <h3 className="font-serif text-base font-medium text-emerald-950 hover:text-gold-700 transition-colors">
                            <Link href={`/products/${item.productId}`}>{item.name}</Link>
                          </h3>
                          <p className="text-xs text-charcoal-500 font-sans mt-0.5">
                            SKU: {item.sku}
                          </p>
                          <p className="text-xs font-serif font-bold text-emerald-950 sm:hidden mt-2">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-ivory-200">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gold-300 rounded-sm bg-white">
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity - 1)}
                            className="p-1.5 text-charcoal-600 hover:text-emerald-950 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-emerald-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity + 1)}
                            className="p-1.5 text-charcoal-600 hover:text-emerald-950 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[90px]">
                          <span className="font-serif text-base font-bold text-emerald-950 block">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-charcoal-500 font-sans block">
                              ({formatPrice(item.price)} each)
                            </span>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize)}
                          className="p-1 text-charcoal-400 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="text-xs font-serif text-emerald-950 hover:text-gold-700 uppercase tracking-widest font-semibold inline-flex items-center gap-1.5"
                >
                  <span>← Continue Exploring Fine Jewelry</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Summary & Coupon */}
            <div className="space-y-6">
              {/* Promo Code Box */}
              <div className="bg-white p-5 rounded-sm border border-gold-300/50 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-emerald-950 font-bold">
                  <Tag className="w-3.5 h-3.5 text-gold-700" />
                  <span>Privilege Coupon Code</span>
                </div>

                {coupon ? (
                  <div className="p-3 bg-emerald-900/10 border border-emerald-800/30 rounded-sm flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 font-mono tracking-wider">{coupon.code}</span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Privilege savings applied (-{formatPrice(discount)})
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-700 hover:text-red-900 p-1"
                      aria-label="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try RISHILAL10 or BRIDAL5000"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 text-xs uppercase font-mono tracking-wider border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
                      />
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-gold-300 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors disabled:opacity-50"
                      >
                        {applying ? '...' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick demo click pills */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-charcoal-500 font-sans">Demo:</span>
                      <button
                        type="button"
                        onClick={() => setCouponInput('RISHILAL10')}
                        className="text-[10px] font-mono px-2 py-0.5 bg-ivory-100 hover:bg-gold-100 text-gold-800 rounded border border-gold-300/50"
                      >
                        RISHILAL10
                      </button>
                      <button
                        type="button"
                        onClick={() => setCouponInput('BRIDAL5000')}
                        className="text-[10px] font-mono px-2 py-0.5 bg-ivory-100 hover:bg-gold-100 text-gold-800 rounded border border-gold-300/50"
                      >
                        BRIDAL5000
                      </button>
                    </div>

                    {couponFeedback && (
                      <p
                        className={`text-xs mt-1 ${
                          couponFeedback.success ? 'text-emerald-800' : 'text-red-700'
                        }`}
                      >
                        {couponFeedback.message}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-semibold text-emerald-950 pb-3 border-b border-gold-200">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs font-sans text-charcoal-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-emerald-950">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3% Indian Jewellery Standard)</span>
                    <span className="font-medium text-emerald-950">{formatPrice(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Privilege Discount ({coupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Insured Armored Delivery</span>
                    <span className="text-emerald-800 font-semibold text-[11px] uppercase">
                      Complimentary (₹0)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-200 flex justify-between items-baseline">
                  <span className="font-serif text-base font-semibold text-emerald-950">Grand Total</span>
                  <span className="font-serif text-2xl font-bold text-emerald-950">{formatPrice(total)}</span>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2 border border-[#C2AA6A]/40 group"
                  >
                    <span>Proceed to Luxury Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div className="pt-3 border-t border-ivory-200 space-y-2 text-[11px] text-charcoal-500 font-sans">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>HUID Government Hallmarked Gold Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-700 shrink-0" />
                    <span>Armored Transit & Tamper-Proof Packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

