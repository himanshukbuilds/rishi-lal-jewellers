'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/config/brandConfig';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    discount,
    total,
    itemCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-50 shadow-2xl flex flex-col border-l border-gold-300/40">
          {/* Header */}
          <div className="p-6 bg-emerald-950 text-ivory-50 flex items-center justify-between border-b border-gold-400/30">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="font-serif text-xl tracking-wide font-medium">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 font-sans">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-ivory-200 hover:text-gold-400 hover:bg-emerald-900/60 transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Insured Shipping Progress Bar */}
          <div className="bg-emerald-900/40 px-6 py-2.5 flex items-center gap-2 text-xs text-gold-300 border-b border-gold-400/20">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span>100% Insured Armored Transit included with your order</span>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-ivory-200/80 flex items-center justify-center text-gold-700 mb-4 border border-gold-300/40">
                  <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
                </div>
                <h3 className="font-serif text-xl text-emerald-950 font-medium mb-1">Your bag is empty</h3>
                <p className="text-xs text-charcoal-600 max-w-xs mb-6">
                  Explore our handcrafted fine jewelry and discover timeless elegance designed for you.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-sm bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-medium hover:bg-emerald-900 transition-colors border border-gold-400/40"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="flex gap-4 p-3.5 rounded-sm bg-white border border-gold-200/60 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-300/30">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm text-emerald-950 font-medium line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize)}
                          className="text-charcoal-500 hover:text-red-700 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">
                        {item.purity || '22KT Gold'} • Size: <span className="font-medium text-emerald-950">{item.selectedSize}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-ivory-200">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gold-300/50 rounded-sm bg-ivory-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity - 1)}
                          className="p-1 text-charcoal-600 hover:text-emerald-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-emerald-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity + 1)}
                          className="p-1 text-charcoal-600 hover:text-emerald-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-semibold text-emerald-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-gold-300/40 space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-emerald-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Indian Jewellery Standard)</span>
                  <span className="font-medium text-emerald-950">{formatPrice(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-700 font-medium uppercase text-[11px]">Complimentary</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gold-200 flex justify-between items-baseline">
                <span className="font-serif text-base text-emerald-950 font-medium">Estimated Total</span>
                <span className="font-serif text-xl font-bold text-emerald-950">{formatPrice(total)}</span>
              </div>

              <div className="pt-2 flex gap-3">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex-1 py-3 text-center border border-emerald-950 text-emerald-950 text-xs uppercase tracking-widest font-medium hover:bg-ivory-100 transition-colors rounded-sm"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex-[1.5] py-3 text-center bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-medium hover:bg-emerald-900 transition-colors rounded-sm flex items-center justify-center gap-2 border border-gold-400/40 shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

