'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

// Indian States
const INDIAN_STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
  'Rajasthan', 'West Bengal', 'Telangana', 'Uttar Pradesh', 'Kerala',
  'Punjab', 'Haryana', 'Madhya Pradesh', 'Goa', 'Chandigarh'
];

// Zod Validation Schema for Checkout Form
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address for order notifications'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  street: z.string().min(5, 'Please provide your full street address and building/apartment number'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please select your state'),
  postalCode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit Indian PIN code'),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, tax, discount, total, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.addresses?.[0]?.street || '',
      apartment: user?.addresses?.[0]?.apartment || '',
      city: user?.addresses?.[0]?.city || '',
      state: user?.addresses?.[0]?.state || 'Maharashtra',
      postalCode: user?.addresses?.[0]?.postalCode || '',
      paymentMethod: 'card',
      notes: '',
    },
  });

  // Autofill user details if available
  useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setValue('street', addr.street);
        setValue('apartment', addr.apartment || '');
        setValue('city', addr.city);
        setValue('state', addr.state);
        setValue('postalCode', addr.postalCode);
      }
    }
  }, [user, setValue]);

  // Form submission handler
  const onSubmit = async (formData) => {
    if (cartItems.length === 0) {
      setSubmissionError('Your shopping bag is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const orderPayload = {
        customerDetails: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        couponCode: coupon?.code || null,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        // Clear shopping bag state
        clearCart();
        // Redirect to order confirmation page
        router.push(`/order-success/${res.order.orderNumber}`);
      } else {
        throw new Error(res.message || 'Unable to place order at this moment');
      }
    } catch (err) {
      console.error('[Checkout] Submission error:', err);
      setSubmissionError(err.message || 'Payment processing failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If bag is empty and not submitting, offer return to store
  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-2xl text-emerald-950 mb-3">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-charcoal-600 mb-6">
          Please add creations to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
        >
          Explore Jewelry Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold mb-1">
            Secure Concierge
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-emerald-950 font-normal">
            Luxury Checkout Experience
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-3" />
        </div>

        {/* Demo Simulation Notice Alert */}
        <div className="mb-8 p-4 rounded-sm bg-gold-50 border border-gold-300 flex items-start gap-3 text-xs text-charcoal-800">
          <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-950">Demonstration Checkout Notice:</span>{' '}
            This is an academic evaluation website. Payments and transactions are 100% simulated.
            No real credit card numbers are collected, stored, or processed. You can safely complete the flow using simulated payment methods.
          </div>
        </div>

        {submissionError && (
          <div className="mb-6 p-4 rounded-sm bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Left 2 Columns: Shipping & Payment Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Contact Information */}
              <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gold-200">
                  <h2 className="font-serif text-lg font-semibold text-emerald-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-950 text-gold-300 text-xs flex items-center justify-center font-sans font-bold">
                      1
                    </span>
                    <span>Patron Contact Details</span>
                  </h2>
                  {!isAuthenticated && (
                    <Link href="/login" className="text-xs text-gold-700 hover:underline font-sans">
                      Already have an account? Sign In
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName')}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. radhika@example.com"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      Mobile Number (For Armored Delivery OTP) *
                    </label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-ivory-100 border border-r-0 border-gold-300 text-xs text-charcoal-600 font-sans rounded-l-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        {...register('phone')}
                        placeholder="9811234567"
                        className="w-full px-3 py-2 text-xs border border-gold-300 rounded-r-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
                <div className="pb-3 border-b border-gold-200">
                  <h2 className="font-serif text-lg font-semibold text-emerald-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-950 text-gold-300 text-xs flex items-center justify-center font-sans font-bold">
                      2
                    </span>
                    <span>Armored Delivery Address</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      Street Address & Building Name *
                    </label>
                    <input
                      type="text"
                      {...register('street')}
                      placeholder="e.g. 42 Heritage Manor, Colaba Causeway"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                    {errors.street && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      Apartment, Floor, Suite (Optional)
                    </label>
                    <input
                      type="text"
                      {...register('apartment')}
                      placeholder="e.g. Flat 602, Wing B"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      State *
                    </label>
                    <select
                      {...register('state')}
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-serif uppercase tracking-wider text-emerald-950 block mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      {...register('postalCode')}
                      placeholder="e.g. 400001"
                      className="w-full px-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Simulated Payment Method */}
              <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
                <div className="pb-3 border-b border-gold-200">
                  <h2 className="font-serif text-lg font-semibold text-emerald-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-950 text-gold-300 text-xs flex items-center justify-center font-sans font-bold">
                      3
                    </span>
                    <span>Simulated Payment Gateway</span>
                  </h2>
                </div>

                {/* Payment Option Radios */}
                <div className="space-y-3">
                  {/* Card Simulation */}
                  <label
                    className={`block p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-gold-500 bg-gold-50/40 shadow-sm'
                        : 'border-gold-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="card"
                          {...register('paymentMethod')}
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-gold-600 focus:ring-gold-500"
                        />
                        <CreditCard className="w-5 h-5 text-emerald-950" />
                        <div>
                          <span className="font-serif text-sm font-semibold text-emerald-950 block">
                            Credit / Debit Card (Simulated Sandbox)
                          </span>
                          <span className="text-[11px] text-charcoal-500 font-sans">
                            Instant demo simulation • No real card details requested
                          </span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-gold-200/60 space-y-2 text-xs text-charcoal-600">
                        <p className="italic">
                          Demo Mode Active: Click &apos;Place Order&apos; below to simulate a secure Visa / Mastercard authorization with 256-bit encryption.
                        </p>
                      </div>
                    )}
                  </label>

                  {/* UPI Simulation */}
                  <label
                    className={`block p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-gold-500 bg-gold-50/40 shadow-sm'
                        : 'border-gold-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="upi"
                        {...register('paymentMethod')}
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-gold-600 focus:ring-gold-500"
                      />
                      <QrCode className="w-5 h-5 text-emerald-950" />
                      <div>
                        <span className="font-serif text-sm font-semibold text-emerald-950 block">
                          Instant UPI / Net Banking (Simulated)
                        </span>
                        <span className="text-[11px] text-charcoal-500 font-sans">
                          Google Pay, PhonePe, Paytm, or BHIM simulated flow
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-4 rounded-sm border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-gold-500 bg-gold-50/40 shadow-sm'
                        : 'border-gold-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="cod"
                        {...register('paymentMethod')}
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-gold-600 focus:ring-gold-500"
                      />
                      <Banknote className="w-5 h-5 text-emerald-950" />
                      <div>
                        <span className="font-serif text-sm font-semibold text-emerald-950 block">
                          Pay on Armored Delivery (Cash / POS Machine)
                        </span>
                        <span className="text-[11px] text-charcoal-500 font-sans">
                          Verify HUID hallmark and seal with courier before payment
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Placement */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-semibold text-emerald-950 pb-3 border-b border-gold-200">
                  Review Shopping Bag ({cartItems.length})
                </h3>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-ivory-200 pr-1 space-y-2">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.selectedSize}`} className="pt-2 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-200">
                        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-medium text-emerald-950 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-charcoal-500 font-sans">
                          Qty: {item.quantity} • Size: {item.selectedSize}
                        </p>
                      </div>
                      <span className="font-serif text-xs font-bold text-emerald-950 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Lines */}
                <div className="pt-3 border-t border-gold-200 space-y-2 text-xs font-sans text-charcoal-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-emerald-950">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (3% Indian Standard)</span>
                    <span className="font-medium text-emerald-950">{formatPrice(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Privilege Discount ({coupon?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Insured Transit</span>
                    <span className="text-emerald-800 font-semibold text-[11px] uppercase">
                      Complimentary
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-200 flex justify-between items-baseline">
                  <span className="font-serif text-base font-semibold text-emerald-950">Grand Total</span>
                  <span className="font-serif text-2xl font-bold text-emerald-950">{formatPrice(total)}</span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2 border border-[#C2AA6A]/40 disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Securing Order...' : 'Confirm & Place Order'}</span>
                  </button>
                </div>

                <div className="pt-3 text-[10px] text-charcoal-500 text-center font-sans space-y-1">
                  <p>🔒 256-Bit SSL Armored Encryption</p>
                  <p>Demonstration transaction — No real charge will occur.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

