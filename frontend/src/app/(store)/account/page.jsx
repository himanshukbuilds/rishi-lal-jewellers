'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout, addAddress, deleteAddress, updateProfile } = useAuth();
  const { wishlistCount } = useWishlist();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  if (loading) {
    return <div className="p-16 text-center text-xs">Loading patron account...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-serif text-2xl text-emerald-950 mb-3">Patron Authentication Required</h2>
        <p className="text-xs text-charcoal-600 mb-6">
          Please sign in to view your profile, manage your addresses, and review past orders.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#8B1E2D] text-white hover:bg-[#4A0B13] text-xs uppercase tracking-widest font-semibold rounded-sm inline-block"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (addressForm.fullName && addressForm.phone && addressForm.street && addressForm.postalCode) {
      await addAddress(addressForm);
      setShowAddressModal(false);
      setAddressForm({
        fullName: '',
        phone: '',
        street: '',
        apartment: '',
        city: '',
        state: 'Maharashtra',
        postalCode: '',
        country: 'India',
      });
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
    setEditingProfile(false);
  };

  return (
    <div className="bg-ivory-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-gold-200">
          <div>
            <span className="text-[11px] font-sans text-gold-700 uppercase tracking-widest font-semibold block">
              Patron Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-emerald-950 font-normal">
              Namaste, {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-sans font-medium rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/account/orders"
            className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm hover:shadow-luxury transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-ivory-100 text-emerald-950 group-hover:bg-emerald-950 group-hover:text-gold-300 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-emerald-950">
                  Orders & Trousseau
                </h3>
                <p className="text-xs text-charcoal-500 font-sans mt-0.5">
                  Track armored shipments & historical receipts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm hover:shadow-luxury transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-ivory-100 text-emerald-950 group-hover:bg-emerald-950 group-hover:text-gold-300 transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-emerald-950">
                  Curated Wishlist
                </h3>
                <p className="text-xs text-charcoal-500 font-sans mt-0.5">
                  {wishlistCount} saved fine jewelry creations
                </p>
              </div>
            </div>
          </Link>

          <div className="bg-emerald-950 text-gold-300 p-6 rounded-sm border border-gold-400/30 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-900 border border-gold-400/40 text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-ivory-50">
                Privilege Status
              </h3>
              <p className="text-xs text-gold-200/80 font-sans mt-0.5">
                Lifetime Hallmark & Buyback Guarantee active
              </p>
            </div>
          </div>
        </div>

        {/* Profile & Address Book Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patron Profile Info */}
          <div className="bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <h3 className="font-serif text-lg font-semibold text-emerald-950">
                Personal Dossier
              </h3>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-xs text-gold-700 hover:text-emerald-950 flex items-center gap-1 font-sans"
              >
                <Edit2 className="w-3 h-3" />
                <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gold-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gold-300 rounded-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-950 text-gold-300 text-xs uppercase tracking-wider font-semibold rounded-sm"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs font-sans text-charcoal-700">
                <div>
                  <span className="text-[11px] text-charcoal-400 block">Name</span>
                  <span className="font-semibold text-emerald-950 text-sm">{user.name}</span>
                </div>
                <div>
                  <span className="text-[11px] text-charcoal-400 block">Email Address</span>
                  <span className="text-charcoal-800">{user.email}</span>
                </div>
                <div>
                  <span className="text-[11px] text-charcoal-400 block">Registered Mobile</span>
                  <span className="text-charcoal-800">{user.phone || '+91 Not specified'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-charcoal-400 block">Account Class</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-xs bg-gold-100 text-gold-800 text-[10px] font-bold uppercase tracking-wider">
                    {user.role === 'admin' ? 'Curator Administrator' : 'Privilege Patron'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Address Book */}
          <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-gold-300/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200">
              <h3 className="font-serif text-lg font-semibold text-emerald-950">
                Armored Delivery Address Book
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-3 py-1.5 bg-emerald-950 text-gold-300 hover:bg-emerald-900 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-sm border border-gold-200 bg-ivory-50/50 flex flex-col justify-between text-xs font-sans space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-950">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900 text-gold-300 rounded font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-charcoal-600">{addr.street}</p>
                      {addr.apartment && <p className="text-charcoal-600">{addr.apartment}</p>}
                      <p className="text-charcoal-600">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-charcoal-500 mt-1">Phone: {addr.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-gold-200/50 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-red-700 hover:text-red-900 flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500 italic py-4">
                No delivery addresses currently on file. Click &apos;Add Address&apos; to register your primary shipping residence.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white max-w-md w-full rounded-sm p-6 shadow-2xl border border-gold-300">
            <h3 className="font-serif text-lg font-semibold text-emerald-950 mb-4 pb-2 border-b border-gold-200">
              Add New Delivery Destination
            </h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs font-sans">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                  Recipient Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="e.g. 9811234567"
                  className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                  Street Address & House/Building Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. 14 Colaba Causeway"
                  className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium block mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="e.g. 400001"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-gold-300 text-charcoal-700 text-xs uppercase tracking-wider rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-950 text-gold-300 text-xs uppercase tracking-wider font-semibold rounded-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

