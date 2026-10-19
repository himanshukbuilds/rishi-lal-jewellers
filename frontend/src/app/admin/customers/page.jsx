'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', searchTerm],
    queryFn: () => api.getAdminCustomers({ search: searchTerm.trim() || undefined }),
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans text-gold-700 uppercase tracking-widest font-semibold block">
            Patron Records
          </span>
          <h1 className="font-serif text-3xl font-normal text-emerald-950">
            Registered Customers Directory
          </h1>
        </div>
        <p className="text-xs text-charcoal-600 font-sans">
          Total Patrons: <span className="font-bold text-emerald-950">{customers.length}</span>
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-sm border border-gold-300/50 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
          />
          <Search className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-sm border border-gold-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider text-[10px] border-b border-gold-200">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-500">
                    Loading customer dossier...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-500 italic">
                    No patrons found matching query.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-ivory-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-950 text-sm block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-gold-700 uppercase tracking-widest font-medium">
                        Privilege Member
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-700">{c.email}</td>
                    <td className="py-3 px-4 text-charcoal-700 font-mono">{c.phone}</td>
                    <td className="py-3 px-4 text-charcoal-500">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-ivory-100 text-emerald-950 border border-gold-200">
                        {c.orderCount} orders
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-emerald-950 text-sm">
                      {formatPrice(c.totalSpent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

