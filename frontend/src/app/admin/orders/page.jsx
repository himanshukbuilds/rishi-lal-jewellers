'use client';

import React, { useState } from 'react';
import SafeImage from '@/components/common/SafeImage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  Check,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // TanStack Query for orders
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, searchTerm],
    queryFn: () =>
      api.getAllOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm.trim() || undefined,
      }),
  });

  const orders = data?.orders || [];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, orderStatus, trackingNumber }) =>
      api.updateOrderStatus(orderId, orderStatus, trackingNumber),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      if (selectedOrder && selectedOrder._id === res.order._id) {
        setSelectedOrder(res.order);
      }
      showToast(res.message || 'Order status updated successfully in database!');
    },
    onError: (err) => {
      alert(`Error updating order status: ${err.message}`);
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, orderStatus: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-950 text-gold-300 border border-gold-400 rounded-sm shadow-xl text-xs flex items-center gap-2 animate-fade-in font-sans">
          <Check className="w-4 h-4 text-gold-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans text-gold-700 uppercase tracking-widest font-semibold block">
            Fulfillment & Consignments
          </span>
          <h1 className="font-serif text-3xl font-normal text-emerald-950">
            Order Fulfillment Operations
          </h1>
        </div>
        <p className="text-xs text-charcoal-600 font-sans">
          Total Orders on File: <span className="font-bold text-emerald-950">{orders.length}</span>
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-sm border border-gold-300/50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
          />
          <Search className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-charcoal-500 font-sans">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gold-300 rounded-sm bg-white text-emerald-950 focus:outline-none focus:border-gold-600 font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="crafting">Crafting & Hallmark</option>
            <option value="shipped">In Armored Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-gold-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider text-[10px] border-b border-gold-200">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Patron & Destination</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total (₹)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500 italic">
                    No orders match your query.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-ivory-50/60 transition-colors">
                    {/* Order Ref */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-950 block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-charcoal-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-emerald-950 block">
                        {ord.customerDetails?.name}
                      </span>
                      <span className="text-[10px] text-charcoal-500">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </span>
                    </td>

                    {/* Items count */}
                    <td className="py-3 px-4 text-charcoal-700">
                      <span>{ord.items?.length || 1} pieces</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-serif font-bold text-emerald-950 text-sm">
                      {formatPrice(ord.totalAmount)}
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold text-charcoal-600">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    {/* Live Status Selector */}
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`text-[11px] font-semibold uppercase tracking-wider rounded-xs px-2 py-1 border cursor-pointer font-sans ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : ord.orderStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : ord.orderStatus === 'crafting'
                            ? 'bg-gold-100 text-gold-900 border-gold-400'
                            : 'bg-ivory-200 text-charcoal-800 border-gold-200'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="crafting">Crafting & Hallmark</option>
                        <option value="shipped">In Armored Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Inspect Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1 bg-ivory-100 hover:bg-gold-100 text-emerald-950 rounded border border-gold-300 text-[11px] font-medium flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-700" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-sm p-6 sm:p-8 max-w-2xl w-full border border-gold-300 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <div>
                <span className="text-[10px] text-gold-700 font-sans uppercase tracking-widest font-bold">
                  Order Inspection Dossier
                </span>
                <h3 className="font-serif text-xl font-semibold text-emerald-950">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-charcoal-500 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 bg-ivory-100 rounded-sm border border-gold-200 flex items-center justify-between text-xs font-sans">
              <div>
                <span className="text-charcoal-500 block">Current Status</span>
                <span className="font-bold text-emerald-950 uppercase">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div>
                <span className="text-charcoal-500 block">Consignment Tracking</span>
                <span className="font-mono text-emerald-800 font-bold">
                  {selectedOrder.trackingNumber || 'IND-EXP-4891230'}
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white border border-gold-300 text-emerald-950 text-xs rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-gold-700" />
                <span>Print Dossier</span>
              </button>
            </div>

            {/* Purchased Items List */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-emerald-950 mb-3">
                Historical Items Snapshot
              </h4>
              <div className="divide-y divide-ivory-200 border border-gold-200 rounded-sm p-3">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs font-sans">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-200">
                        <SafeImage src={it.image} alt={it.name} fill sizes="48px" className="object-cover" fallbackSrc="/images/placeholder.jpg" />
                      </div>
                      <div>
                        <span className="font-medium text-emerald-950 block">{it.name}</span>
                        <span className="text-[10px] text-charcoal-500 font-mono">
                          SKU: {it.sku} • Qty: {it.quantity} • Size: {it.selectedSize}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-emerald-950">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-white border border-gold-200 rounded-sm space-y-1">
                <h5 className="font-serif font-bold uppercase tracking-wider text-emerald-950 mb-2">
                  Patron Information
                </h5>
                <p className="font-medium text-charcoal-800">{selectedOrder.customerDetails?.name}</p>
                <p className="text-charcoal-600">{selectedOrder.customerDetails?.email}</p>
                <p className="text-charcoal-600">Mobile: {selectedOrder.customerDetails?.phone}</p>
              </div>

              <div className="p-4 bg-white border border-gold-200 rounded-sm space-y-1">
                <h5 className="font-serif font-bold uppercase tracking-wider text-emerald-950 mb-2">
                  Delivery Destination
                </h5>
                <p className="text-charcoal-700">{selectedOrder.shippingAddress?.street}</p>
                {selectedOrder.shippingAddress?.apartment && (
                  <p className="text-charcoal-700">{selectedOrder.shippingAddress.apartment}</p>
                )}
                <p className="text-charcoal-700">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                  {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2 border-t border-gold-200 flex justify-between items-baseline font-serif">
              <span className="text-sm font-semibold text-emerald-950">Total Order Value:</span>
              <span className="text-2xl font-bold text-emerald-950">
                {formatPrice(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

