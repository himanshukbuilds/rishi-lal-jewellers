'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Package,
  Gem,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.getAdminStats(),
  });

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const lowStockAlerts = data?.lowStockAlerts || [];
  const monthlySales = data?.monthlySales || [];
  const categoryDistribution = data?.categoryDistribution || [];

  if (isLoading) {
    return <div className="p-12 text-center text-xs">Loading administration analytics...</div>;
  }

  const maxMonthly = Math.max(...monthlySales.map((m) => m.sales), 100000);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans text-gold-700 uppercase tracking-widest font-semibold block">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl font-normal text-emerald-950">
            Atelier Analytics & Operations
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-emerald-950 text-gold-300 hover:bg-emerald-900 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-gold-500 text-emerald-950 hover:bg-gold-400 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-sm border border-gold-300/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-500 font-sans uppercase tracking-wider block">
              Demo Gross Revenue
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-950 mt-1 block">
              {formatPrice(stats.totalRevenue)}
            </span>
            <span className="text-[10px] text-emerald-700 font-sans mt-0.5 block">
              ↑ 18.4% from last festival quarter
            </span>
          </div>
          <div className="p-3 rounded-full bg-gold-100 text-gold-800">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-sm border border-gold-300/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-500 font-sans uppercase tracking-wider block">
              Orders Placed
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-950 mt-1 block">
              {stats.totalOrders}
            </span>
            <span className="text-[10px] text-gold-700 font-sans mt-0.5 block">
              {stats.pendingOrders} awaiting fulfillment
            </span>
          </div>
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-900">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Products in Catalog */}
        <div className="bg-white p-5 rounded-sm border border-gold-300/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-500 font-sans uppercase tracking-wider block">
              Active Creations
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-950 mt-1 block">
              {stats.totalProducts}
            </span>
            <span className="text-[10px] text-red-700 font-sans mt-0.5 block">
              {stats.lowStockCount} items near depletion
            </span>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-900">
            <Gem className="w-5 h-5" />
          </div>
        </div>

        {/* Registered Patrons */}
        <div className="bg-white p-5 rounded-sm border border-gold-300/50 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-500 font-sans uppercase tracking-wider block">
              Registered Patrons
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-950 mt-1 block">
              {stats.totalCustomers}
            </span>
            <span className="text-[10px] text-charcoal-500 font-sans mt-0.5 block">
              Verified customer accounts
            </span>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-900">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <h3 className="font-serif text-base font-semibold text-emerald-950">
              Monthly Sales Velocity (₹)
            </h3>
            <span className="text-xs text-charcoal-500 font-sans">FY 2026 Quarter</span>
          </div>

          <div className="h-64 flex items-end gap-4 pt-8 px-2">
            {monthlySales.map((item) => {
              const heightPercent = Math.min(100, Math.round((item.sales / maxMonthly) * 100));
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-emerald-950 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.sales / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-emerald-950 to-gold-500 rounded-t-xs transition-all duration-500 group-hover:brightness-110"
                  />
                  <span className="text-xs font-sans text-charcoal-600 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
          <div className="pb-3 border-b border-ivory-200">
            <h3 className="font-serif text-base font-semibold text-emerald-950">
              Category Distribution
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {categoryDistribution.map((cat) => (
              <div key={cat._id} className="space-y-1 text-xs font-sans">
                <div className="flex justify-between text-charcoal-700">
                  <span className="font-medium text-emerald-950">{cat._id}</span>
                  <span className="text-charcoal-500">{cat.count} pieces</span>
                </div>
                <div className="w-full h-2 bg-ivory-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (cat.count / stats.totalProducts) * 100)}%` }}
                    className="h-full bg-emerald-900 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column: Recent Orders + Inventory Depletion Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <h3 className="font-serif text-base font-semibold text-emerald-950">
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-700 hover:text-emerald-950 font-sans font-medium flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Patron</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-ivory-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-950">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-charcoal-800">
                      {ord.customerDetails?.name}
                    </td>
                    <td className="py-2.5 px-3 font-serif font-semibold text-emerald-950">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-ivory-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif text-base font-semibold text-emerald-950">
              Low Stock Depletion Alerts
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockAlerts.length === 0 ? (
              <p className="text-xs text-charcoal-500 italic py-2">
                All jewelry inventory healthy above minimum thresholds.
              </p>
            ) : (
              lowStockAlerts.map((prod) => (
                <div
                  key={prod._id}
                  className="p-3 rounded-sm bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs font-sans"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-medium text-emerald-950 truncate block">
                      {prod.name}
                    </span>
                    <span className="text-[10px] text-charcoal-500 font-mono">
                      {prod.sku} • {prod.category}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-xs text-[10px] shrink-0">
                    {prod.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

