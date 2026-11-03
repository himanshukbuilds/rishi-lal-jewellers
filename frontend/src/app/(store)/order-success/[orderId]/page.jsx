'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  Printer,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId;

  const { data, isLoading } = useQuery({
    queryKey: ['order-success', orderId],
    queryFn: () => api.getOrder(orderId),
    enabled: !!orderId,
  });

  const order = data?.order;

  return (
    <div className="bg-ivory-50 min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Banner */}
        <div className="bg-white p-8 sm:p-12 rounded-sm border border-gold-300 shadow-luxury text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-950 text-gold-400 mx-auto flex items-center justify-center border border-gold-400/40 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-700 font-bold">
            Order Confirmed & Secured
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl text-emerald-950 font-normal">
            Thank You for Choosing Rishi Lal Jewellers
          </h1>

          <p className="font-sans text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
            Your high jewelry order has been received at our master atelier.
            A confirmation dossier and invoice copy have been generated for your records.
          </p>

          {/* Key Reference Box */}
          <div className="my-6 p-4 bg-ivory-100/80 rounded-sm border border-gold-200/80 inline-block text-left text-xs font-sans space-y-1">
            <div>
              <span className="text-charcoal-500">Order Reference:</span>{' '}
              <span className="font-mono font-bold text-emerald-950 text-sm">
                {order?.orderNumber || orderId}
              </span>
            </div>
            <div>
              <span className="text-charcoal-500">Tracking Consignment:</span>{' '}
              <span className="font-mono text-emerald-800 font-medium">
                {order?.trackingNumber || 'IND-EXP-4892104'}
              </span>
            </div>
            <div>
              <span className="text-charcoal-500">Estimated Delivery:</span>{' '}
              <span className="font-medium text-emerald-950">
                {order?.estimatedDelivery || '3 to 5 Business Days'} (Armored Express)
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-white border border-gold-300 text-emerald-950 text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-ivory-100 flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-gold-700" />
              <span>Print Invoice Receipt</span>
            </button>

            <Link
              href="/account/orders"
              className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-gold-300 text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-2"
            >
              <span>View Order Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-sm border border-gold-300/50 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-semibold text-emerald-950 pb-3 border-b border-gold-200">
              Purchased Creations Snapshot
            </h2>

            <div className="divide-y divide-ivory-200">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-200">
                      <SafeImage src={item.image} alt={item.name} fill sizes="56px" className="object-cover" fallbackSrc="/images/placeholder.jpg" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-medium text-emerald-950">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-charcoal-500 font-sans">
                        Qty: {item.quantity} • Size: {item.selectedSize} • {item.purity || '22KT Gold'}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-sm font-bold text-emerald-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Address & Summary Grid */}
            <div className="pt-4 border-t border-gold-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <h4 className="font-serif uppercase tracking-wider font-bold text-emerald-950 mb-1.5">
                  Armored Shipping Destination
                </h4>
                <p className="font-medium text-charcoal-800">{order.customerDetails?.name}</p>
                <p className="text-charcoal-600">{order.shippingAddress?.street}</p>
                {order.shippingAddress?.apartment && (
                  <p className="text-charcoal-600">{order.shippingAddress.apartment}</p>
                )}
                <p className="text-charcoal-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                  {order.shippingAddress?.postalCode}
                </p>
                <p className="text-charcoal-500 mt-1">Contact: {order.customerDetails?.phone}</p>
              </div>

              <div className="space-y-1.5 text-charcoal-600">
                <h4 className="font-serif uppercase tracking-wider font-bold text-emerald-950 mb-1.5">
                  Payment Summary
                </h4>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-emerald-950">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%):</span>
                  <span className="font-medium text-emerald-950">{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Privilege Savings:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-ivory-200 font-serif text-base font-bold text-emerald-950">
                  <span>Grand Total:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <p className="text-[10px] text-charcoal-400 uppercase pt-1">
                  Payment Method: {order.paymentMethod?.toUpperCase()} (Status: {order.paymentStatus})
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="text-xs font-serif uppercase tracking-widest font-semibold text-emerald-950 hover:text-gold-700"
          >
            ← Continue Exploring Fine Jewelry Collections
          </Link>
        </div>
      </div>
    </div>
  );
}

