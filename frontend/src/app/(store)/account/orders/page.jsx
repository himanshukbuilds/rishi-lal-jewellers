'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function MyOrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.getMyOrders(),
    enabled: isAuthenticated,
  });

  const orders = data?.orders || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Delivered & Insured</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-700" />
            <span>In Armored Transit</span>
          </span>
        );
      case 'crafting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-gold-100 text-gold-900 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gold-700" />
            <span>Atelier Crafting & Hallmark</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-ivory-200 text-charcoal-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Order Confirmed</span>
          </span>
        );
    }
  };

  if (authLoading || isLoading) {
    return <div className="p-16 text-center text-xs">Loading order history...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-serif text-2xl text-emerald-950 mb-3">Sign In Required</h2>
        <p className="text-xs text-charcoal-600 mb-6">
          Please sign in to view your order history and consignment tracking.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-gold-200">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-1 text-xs text-gold-700 hover:text-emerald-950 font-sans mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account Overview</span>
            </Link>
            <h1 className="font-serif text-3xl font-normal text-emerald-950">
              Your Orders & Trousseau
            </h1>
          </div>
          <p className="text-xs text-charcoal-600 font-sans">
            Total Orders: <span className="font-bold text-emerald-950">{orders.length}</span>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-sm border border-gold-300/40 p-12 text-center shadow-sm max-w-md mx-auto">
            <Package className="w-12 h-12 text-gold-700 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-emerald-950 mb-1">
              No Orders on Record
            </h3>
            <p className="text-xs text-charcoal-600 mb-6">
              You have not placed any fine jewelry orders yet.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
            >
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-sm border border-gold-300/50 shadow-sm overflow-hidden"
              >
                {/* Order Top Meta Strip */}
                <div className="p-4 sm:p-5 bg-ivory-100/70 border-b border-gold-200 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-charcoal-500 text-[10px] uppercase block">Order Reference</span>
                      <span className="font-mono font-bold text-emerald-950">{ord.orderNumber}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-500 text-[10px] uppercase block">Date Placed</span>
                      <span className="text-charcoal-800">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-charcoal-500 text-[10px] uppercase block">Grand Total</span>
                      <span className="font-serif font-bold text-emerald-950 text-sm">
                        {formatPrice(ord.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(ord.orderStatus)}
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 text-charcoal-500 hover:text-emerald-950 rounded border border-gold-300 bg-white"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 divide-y divide-ivory-200">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-200">
                          <SafeImage src={item.image} alt={item.name} fill sizes="64px" className="object-cover" fallbackSrc="/images/placeholder.jpg" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-medium text-emerald-950">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-charcoal-500 font-sans mt-0.5">
                            SKU: {item.sku} • Qty: {item.quantity} • Size: {item.selectedSize}
                          </p>
                          <span className="text-[10px] text-gold-700 font-sans uppercase tracking-wider block mt-0.5">
                            {item.purity || '22KT Gold'} • {item.grossWeight || '18'}g
                          </span>
                        </div>
                      </div>

                      <span className="font-serif text-sm font-bold text-emerald-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking Footer */}
                <div className="p-4 bg-emerald-950/5 border-t border-gold-200/50 flex flex-wrap items-center justify-between text-xs font-sans text-charcoal-600 gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-800" />
                    <span>
                      Tracking Consignment:{' '}
                      <span className="font-mono font-bold text-emerald-950">
                        {ord.trackingNumber || 'IND-EXP-4891230'}
                      </span>
                    </span>
                  </div>

                  <Link
                    href={`/order-success/${ord.orderNumber}`}
                    className="text-gold-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Full Receipt Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

