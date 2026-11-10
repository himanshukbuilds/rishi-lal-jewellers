'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SafeImage from '@/components/common/SafeImage';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Shield,
  LogOut,
  Package,
  LayoutDashboard,
  Camera,
  Crown,
  Gem,
  Disc,
  CircleDot,
  Link2,
  Circle,
  Sun,
  Gift,
  Baby,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { BRAND_CONFIG } from '@/config/brandConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';

// Announcement bar rotating messages
const ANNOUNCEMENT_MESSAGES = [
  'Discover the Rishi Lal Jewellers collection',
  'Jewellery for the moments that matter',
  'Explore traditional, contemporary and bridal designs',
];

// Category navigation items with lucide icons
const NAV_CATEGORIES = [
  { name: 'Gold', href: '/gold', icon: Crown },
  { name: 'Diamond', href: '/diamond', icon: Gem },
  { name: 'Earrings', href: '/earrings', icon: Disc },
  { name: 'Rings', href: '/rings', icon: CircleDot },
  { name: 'Necklaces', href: '/necklaces', icon: Link2 },
  { name: 'Bangles', href: '/bangles', icon: Circle },
  { name: 'Casual Wear', href: '/daily-wear', icon: Sun },
  { name: 'Wedding', href: '/wedding', icon: Heart },
  { name: 'Men', href: '/men', icon: Shield },
  { name: 'Kids', href: '/kids', icon: Baby },
  { name: 'Gifting', href: '/gifting', icon: Gift },
];

const getNecklaceMetalGroup = (product) => {
  if (['Gold', 'Diamond', 'Silver'].includes(product.metalType)) return product.metalType;
  const descriptor = [product.name, product.category, product.metal, ...(product.tags || [])].filter(Boolean).join(' ');
  if (/diamond|solitaire|polki/i.test(descriptor) || (product.gemstones || []).some((stone) => /diamond/i.test(stone.type || ''))) return 'Diamond';
  if (/silver/i.test(descriptor)) return 'Silver';
  if (/gold|\b\d{2}k\b/i.test(descriptor)) return 'Gold';
  return null;
};

const getRingMetalGroup = (product) => {
  const descriptor = [product.name, product.metal, ...(product.tags || [])].filter(Boolean).join(' ');
  if (/rose\s*gold/i.test(descriptor)) return 'Rose Gold';
  if (/platinum\s*finish/i.test(descriptor)) return 'Platinum Finish';
  return getNecklaceMetalGroup(product);
};

const getNecklaceAvailability = (product) => {
  if (product.availability === 'made-to-order') return 'Made to Order';
  if (product.availability === 'contact-for-availability') return 'Contact for Availability';
  return product.stock > 0 ? 'In Stock · Ready to Dispatch' : 'Made to Order';
};

function EarringsMenuCard({ product, onClick, mobile = false }) {
  const image = product.image || product.images?.[0] || '/images/placeholder-jewelry.jpg';
  return (
    <Link href={`/products/${product.slug || product._id}`} onClick={onClick} className="group/card overflow-hidden border border-[#E6DFD3] bg-white transition-shadow hover:shadow-md">
      <div className={`relative overflow-hidden bg-[#F2EEE5] ${mobile ? 'aspect-[4/3]' : 'aspect-[1.15]'}`}>
        <SafeImage src={image} alt={`${product.name} — ${product.imageType || 'product image'}`} fill sizes={mobile ? '42vw' : '(max-width: 640px) 45vw, 220px'} className="object-contain p-1 transition-transform duration-700 ease-out group-hover/card:scale-105" fallbackSrc="/images/placeholder-jewelry.jpg" />
        <span className="absolute left-2 top-2 bg-[#FBF9F4]/95 px-2 py-1 text-[7px] uppercase tracking-wider text-[#53685D]">{product.imageType || 'Image source not recorded'}</span>
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 min-h-9 font-serif text-xs leading-snug text-[#17382D]">{product.name}</p>
        <p className="mt-1 font-sans text-[9px] text-[#766F61]">{product.pricingType === 'price-on-request' || product.price == null ? 'Price on request' : `₹${Number(product.price).toLocaleString('en-IN')}`}</p>
        <p className="mt-1 text-[8px] uppercase tracking-wider text-[#8A604F]">{getNecklaceAvailability(product)}</p>
      </div>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileJewelleryOpen, setMobileJewelleryOpen] = useState(false);
  const [necklaceProducts, setNecklaceProducts] = useState([]);
  const [bangleProducts, setBangleProducts] = useState([]);
  const [earringProducts, setEarringProducts] = useState([]);
  const [ringProducts, setRingProducts] = useState([]);
  const [dailyWearProducts, setDailyWearProducts] = useState([]);
  const [necklaceMenuLoading, setNecklaceMenuLoading] = useState(true);
  const [bangleMenuLoading, setBangleMenuLoading] = useState(true);
  const [earringMenuLoading, setEarringMenuLoading] = useState(true);
  const [ringMenuLoading, setRingMenuLoading] = useState(true);
  const [dailyWearMenuLoading, setDailyWearMenuLoading] = useState(true);
  const [necklaceMenuError, setNecklaceMenuError] = useState(false);
  const [bangleMenuError, setBangleMenuError] = useState(false);
  const [earringMenuError, setEarringMenuError] = useState(false);
  const [ringMenuError, setRingMenuError] = useState(false);
  const [dailyWearMenuError, setDailyWearMenuError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementFade, setAnnouncementFade] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.request('/products?categorySlug=necklaces&limit=30')
      .then((data) => { if (mounted) setNecklaceProducts(data.products || []); })
      .catch(() => { if (mounted) setNecklaceMenuError(true); })
      .finally(() => { if (mounted) setNecklaceMenuLoading(false); });
    api.request('/products?categorySlug=bangles&limit=60')
      .then((data) => { if (mounted) setBangleProducts(data.products || []); })
      .catch(() => { if (mounted) setBangleMenuError(true); })
      .finally(() => { if (mounted) setBangleMenuLoading(false); });
    api.request('/products?categorySlug=earrings&limit=60')
      .then((data) => { if (mounted) setEarringProducts(data.products || []); })
      .catch(() => { if (mounted) setEarringMenuError(true); })
      .finally(() => { if (mounted) setEarringMenuLoading(false); });
    api.request('/products?categorySlug=rings&limit=60')
      .then((data) => { if (mounted) setRingProducts(data.products || []); })
      .catch(() => { if (mounted) setRingMenuError(true); })
      .finally(() => { if (mounted) setRingMenuLoading(false); });
    api.request('/products?categorySlug=daily-wear&limit=60')
      .then((data) => { if (mounted) setDailyWearProducts(data.products || []); })
      .catch(() => { if (mounted) setDailyWearMenuError(true); })
      .finally(() => { if (mounted) setDailyWearMenuLoading(false); });
    return () => { mounted = false; };
  }, []);

  const necklaceMenuGroups = ['Gold', 'Diamond', 'Silver'].map((metalType) => ({
    metalType,
    products: necklaceProducts.filter((product) => getNecklaceMetalGroup(product) === metalType),
  }));
  const bangleMenuGroups = ['Gold', 'Diamond', 'Silver'].map((metalType) => ({
    metalType,
    products: bangleProducts.filter((product) => getNecklaceMetalGroup(product) === metalType),
  }));
  const earringMenuGroups = ['Gold', 'Diamond', 'Silver'].map((metalType) => ({
    metalType,
    products: earringProducts.filter((product) => getNecklaceMetalGroup(product) === metalType),
  }));
  const ringMenuGroups = ['Gold', 'Diamond', 'Silver', 'Rose Gold', 'Platinum Finish'].map((metalType) => ({
    metalType,
    products: ringProducts.filter((product) => getRingMetalGroup(product) === metalType),
  }));
  const dailyWearCategoryTiles = [
    { name: 'Necklaces', category: 'Necklace' },
    { name: 'Earrings', category: 'Earrings' },
    { name: 'Rings', category: 'Rings' },
    { name: 'Bangles', category: 'Bangles' },
    { name: 'Bracelets', category: 'Bracelets' },
    { name: 'Other', category: 'Other' },
  ].map((tile) => ({ ...tile, product: dailyWearProducts.find((product) => product.subcategory === tile.category) }));
  const bangleStyleGroups = [
    { name: 'Bridal Bangles', slug: 'bridal', match: /bridal|heavy/i },
    { name: 'Daily Wear Bangles', slug: 'daily', match: /daily|lightweight/i },
    { name: 'Temple Bangles', slug: 'temple', match: /temple/i },
    { name: 'Kada Bangles', slug: 'kada', match: /kada/i },
  ].map((group) => ({ ...group, product: bangleProducts.find((product) => group.match.test(`${product.name} ${product.subcategory || ''}`)) }));

  // Shrink/shadow header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate announcement messages every 4 seconds
  useEffect(() => {
    if (barDismissed) return;

    const interval = setInterval(() => {
      // Fade out
      setAnnouncementFade(false);

      // After fade-out completes, change message and fade in
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
        setAnnouncementFade(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [barDismissed]);

  // Close account menu on outside click
  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-account-menu]')) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [accountMenuOpen]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery('');
      }
    },
    [searchQuery, router]
  );

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* ═══════════════════════════════════════════════════════════════════
          ROW 1: PROMOTIONAL ANNOUNCEMENT BAR (Section 3)
      ═══════════════════════════════════════════════════════════════════ */}
      {!barDismissed && (
        <div className="bg-[#8B1E2D] text-white px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider border-b border-[#C2AA6A]/20 font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Trust badge */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/90 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2AA6A]" />
              <span>Rishi Lal Jewellers · Crafted for every occasion</span>
            </div>

            {/* Center: Rotating announcement */}
            <div className="flex-1 flex justify-center min-w-0 px-2">
              <div
                className={`flex items-center gap-1.5 font-medium text-[11px] sm:text-xs transition-opacity duration-400 min-w-0 ${
                  announcementFade ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDuration: '400ms' }}
              >
                <Sparkles className="w-3 h-3 text-[#C2AA6A] animate-pulse shrink-0" />
                <span className="tracking-wide text-white truncate">{ANNOUNCEMENT_MESSAGES[announcementIndex]}</span>
              </div>
            </div>

            {/* Right: Close button */}
            <button
              onClick={() => setBarDismissed(true)}
              className="flex-shrink-0 ml-1 sm:ml-4 p-0.5 text-white/70 hover:text-[#C2AA6A] transition-colors"
              aria-label="Dismiss announcement bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 2: MAIN NAVIGATION BAR (Section 3)
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className={`bg-white border-b border-[#E6DFD3] transition-all duration-300 ${
          isScrolled ? 'py-1.5 sm:py-2 shadow-md shadow-black/5' : 'py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* LEFT: Brand Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 mr-1 sm:mr-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors shrink-0"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <BrandLogo showTagline={!isScrolled} size={isScrolled ? 'sm' : 'md'} />
          </div>

          {/* CENTER: Search Bar (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-auto">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search for jewelry, diamonds, gold..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 text-sm bg-[#F8F5EF] border border-[#E6DFD3] rounded-full focus:outline-none focus:border-[#C2AA6A] focus:bg-white focus:ring-1 focus:ring-[#C2AA6A]/40 text-[#4A0B13] placeholder-charcoal-500 font-sans transition-all"
              />
              <Search className="w-4 h-4 text-[#C2AA6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-[#C2AA6A] transition-colors"
                aria-label="Visual Search"
              >
                <Camera className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* RIGHT: Action Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Precious Metal Rates Link (desktop) */}
            <Link
              href="/#precious-metals-pricing"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[#4A0B13] hover:text-[#C2AA6A] hover:bg-[#F8F5EF] transition-colors rounded-full border border-transparent hover:border-[#E6DFD3]"
              aria-label="Today's Precious Metal Prices"
            >
              <TrendingUp className="w-4 h-4 text-[#C2AA6A]" />
              <span className="hidden xl:inline text-xs font-medium uppercase tracking-wider font-sans">Metal Prices</span>
            </Link>

            {/* User Account Dropdown */}
            <div className="relative" data-account-menu>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors rounded-full hover:bg-[#F8F5EF]"
                aria-label="Account Menu"
                aria-expanded={accountMenuOpen}
              >
                <User className="w-5 h-5" />
                <span className="hidden xl:inline text-xs font-medium">
                  {isAuthenticated ? user?.name?.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3 h-3 hidden xl:inline text-charcoal-500" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gold-300/70 rounded-sm shadow-xl py-2 z-50 text-xs animate-fade-in">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-ivory-200">
                        <p className="font-semibold text-emerald-950">{user?.name}</p>
                        <p className="text-[11px] text-charcoal-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gold-100 text-gold-800">
                          {user?.role === 'admin' ? 'Curator Admin' : 'Privilege Member'}
                        </span>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-charcoal-700 hover:bg-ivory-100 hover:text-emerald-950"
                      >
                        <User className="w-4 h-4 text-gold-700" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-charcoal-700 hover:bg-ivory-100 hover:text-emerald-950"
                      >
                        <Package className="w-4 h-4 text-gold-700" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/account/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-charcoal-700 hover:bg-ivory-100 hover:text-emerald-950"
                      >
                        <Heart className="w-4 h-4 text-gold-700" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-gold-800 font-semibold bg-gold-50 hover:bg-gold-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gold-700" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <div className="border-t border-ivory-200 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-ivory-200">
                        <p className="font-serif font-semibold text-emerald-950">Welcome to Rishi Lal Jewellers</p>
                        <p className="text-[11px] text-charcoal-500">Sign in to view orders &amp; privileges</p>
                      </div>

                      <Link
                        href="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2.5 font-medium text-emerald-950 hover:bg-ivory-100"
                      >
                        Customer Sign In
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-charcoal-600 hover:bg-ivory-100"
                      >
                        Create New Account
                      </Link>

                      <div className="border-t border-ivory-200 mt-1 pt-1">
                        <Link
                          href="/admin/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gold-800 hover:bg-gold-50 font-medium"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Admin Portal Login</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors rounded-full hover:bg-[#F8F5EF]"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#C2AA6A] text-[#4A0B13] text-[10px] font-bold flex items-center justify-center font-sans shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors rounded-full hover:bg-[#F8F5EF]"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#8B1E2D] text-white border border-[#C2AA6A]/60 text-[10px] font-bold flex items-center justify-center font-sans shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {searchOpen && (
          <div className="lg:hidden px-4 pt-3 pb-2 border-t border-[#E6DFD3] bg-white animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for jewelry, diamonds, gold..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F8F5EF] border border-[#E6DFD3] rounded-full focus:outline-none focus:border-[#C2AA6A] text-[#4A0B13] placeholder-charcoal-500"
              />
              <Search className="w-4 h-4 text-[#C2AA6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-800"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 3: CATEGORY NAVIGATION (Desktop only - Section 3)
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="hidden lg:block bg-white border-b border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 xl:gap-x-7 2xl:gap-x-9">
            <li
              className="group relative"
              data-jewellery-menu
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMegaMenuOpen(false); }}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen((open) => !open)}
                onFocus={() => setMegaMenuOpen(true)}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
                className={`flex flex-col items-center gap-1 py-1 transition-colors ${megaMenuOpen ? 'text-[#8B1E2D]' : 'text-[#2B2B2B] hover:text-[#8B1E2D]'}`}
              >
                <Sparkles className="h-4 w-4 text-[#C2AA6A]" />
                <span className="flex items-center gap-1 text-xs font-sans font-medium uppercase tracking-widest">Jewellery <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} /></span>
              </button>
              <div className={`absolute left-1/2 top-full z-50 w-[min(1180px,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition-all duration-300 ${megaMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'}`}>
                <div className="max-h-[calc(100vh-145px)] overflow-y-auto border border-[#D8CFBD] bg-[#FBF9F4] p-5 shadow-[0_18px_55px_rgba(26,35,29,.2)] sm:p-7">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#E7E0D3] pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[.25em] text-[#9B8050]">Rishi Lal Jewellers · Live catalogue</p>
                      <h2 className="mt-1 font-serif text-2xl text-[#17382D] sm:text-3xl">Shop jewellery by collection</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/gifting" onClick={() => setMegaMenuOpen(false)} className="inline-flex items-center gap-1.5 border border-[#C6A15B] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#9B8050] transition-colors hover:bg-[#C6A15B] hover:text-white">
                        Gifting Collection
                      </Link>
                    </div>
                  </div>
                  <section className="mb-7 border-b border-[#E7E0D3] pb-6">
                    <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#9B8050]">Visual collection</p><h3 className="mt-1 font-serif text-2xl text-[#17382D]">Earrings</h3></div><Link href="/earrings" onClick={() => setMegaMenuOpen(false)} className="text-[10px] uppercase tracking-[.18em] text-[#7D2934] underline underline-offset-4">View all earrings</Link></div>
                    {earringMenuLoading && <p className="py-4 text-center text-xs text-[#66736A]">Loading earrings from the catalogue…</p>}
                    {earringMenuError && <p className="py-4 text-center text-xs text-[#7D2934]">The live earrings collection is temporarily unavailable.</p>}
                    {!earringMenuLoading && !earringMenuError && earringProducts.length === 0 && <p className="py-4 text-center text-xs text-[#66736A]">No published earrings are available yet.</p>}
                    <div className="space-y-5">{earringMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} earrings`}><h4 className="mb-3 flex items-center gap-3 font-serif text-lg text-[#17382D]">{group.metalType} Earrings <span className="h-px flex-1 bg-[#E7E0D3]" /></h4><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{group.products.map((product) => <EarringsMenuCard key={product._id} product={product} onClick={() => setMegaMenuOpen(false)} />)}</div></section>)}</div>
                  </section>
                  <section className="mb-7 border-b border-[#E7E0D3] pb-6">
                    <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#9B8050]">Visual collection</p><h3 className="mt-1 font-serif text-2xl text-[#17382D]">Rings</h3></div><Link href="/rings" onClick={() => setMegaMenuOpen(false)} className="text-[10px] uppercase tracking-[.18em] text-[#7D2934] underline underline-offset-4">View all rings</Link></div>
                    {ringMenuLoading && <p className="py-4 text-center text-xs text-[#66736A]">Loading rings from the catalogue…</p>}
                    {ringMenuError && <p className="py-4 text-center text-xs text-[#7D2934]">The live rings collection is temporarily unavailable.</p>}
                    {!ringMenuLoading && !ringMenuError && ringProducts.length === 0 && <p className="py-4 text-center text-xs text-[#66736A]">No published rings are available yet.</p>}
                    <div className="space-y-5">{ringMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} rings`}><h4 className="mb-3 flex items-center gap-3 font-serif text-lg text-[#17382D]">{group.metalType} Rings <span className="h-px flex-1 bg-[#E7E0D3]" /></h4><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{group.products.map((product) => <EarringsMenuCard key={product._id} product={product} onClick={() => setMegaMenuOpen(false)} />)}</div></section>)}</div>
                  </section>
                  {necklaceMenuLoading && <p className="py-8 text-center font-sans text-xs text-[#66736A]">Loading necklaces from the collection…</p>}
                  {necklaceMenuError && <p className="py-8 text-center font-sans text-xs text-[#7D2934]">The live necklace collection is temporarily unavailable.</p>}
                  {!necklaceMenuLoading && !necklaceMenuError && necklaceProducts.length === 0 && <p className="py-8 text-center font-sans text-xs text-[#66736A]">No published necklaces are available yet.</p>}
                  <div className="space-y-6">
                    {necklaceMenuGroups.map((group) => group.products.length > 0 && (
                      <section key={group.metalType} aria-label={`${group.metalType} necklaces`}>
                        <h3 className="mb-3 flex items-center gap-3 font-serif text-xl text-[#17382D]">{group.metalType} Necklaces <span className="h-px flex-1 bg-[#E7E0D3]" /></h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {group.products.map((product) => (
                            <Link key={product._id} href={`/products/${product.slug || product._id}`} onClick={() => setMegaMenuOpen(false)} className="group/card overflow-hidden border border-[#E6DFD3] bg-white transition-shadow hover:shadow-md">
                              <div className="relative aspect-[1.22] overflow-hidden bg-[#F2EEE5]">
                                <Image src={product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${product.name} — ${product.imageType || 'product image'}`} fill sizes="(max-width: 640px) 45vw, 250px" className="object-contain p-1 transition-transform duration-700 ease-out group-hover/card:scale-105" />
                                <span className="absolute left-2 top-2 bg-[#FBF9F4]/95 px-2 py-1 text-[7px] uppercase tracking-wider text-[#53685D]">{product.imageType || 'Image source not recorded'}</span>
                              </div>
                              <div className="p-2.5 sm:p-3"><p className="line-clamp-2 min-h-9 font-serif text-xs leading-snug text-[#17382D] sm:text-sm">{product.name}</p><div className="mt-1 flex items-center justify-between gap-2 font-sans text-[9px] text-[#766F61]"><span>{product.metalType || product.metal}</span><span className="shrink-0">{product.pricingType === 'price-on-request' || !product.price ? 'Price on request' : `₹${Number(product.price).toLocaleString('en-IN')}`}</span></div><p className="mt-1 text-[8px] uppercase tracking-wider text-[#8A604F]">{getNecklaceAvailability(product)}</p></div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <div className="mt-7 border-t border-[#D8CFBD] pt-6">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#9B8050]">Visual collection</p><h3 className="mt-1 font-serif text-2xl text-[#17382D]">Bangles</h3></div><Link href="/bangles" onClick={() => setMegaMenuOpen(false)} className="text-[10px] uppercase tracking-[.18em] text-[#7D2934] underline underline-offset-4">View all bangles</Link></div>
                    {bangleMenuLoading && <p className="py-5 text-center font-sans text-xs text-[#66736A]">Loading bangles from the collection…</p>}
                    {bangleMenuError && <p className="py-5 text-center font-sans text-xs text-[#7D2934]">The live bangle collection is temporarily unavailable.</p>}
                    {!bangleMenuLoading && !bangleMenuError && bangleProducts.length === 0 && <p className="py-5 text-center font-sans text-xs text-[#66736A]">No published bangles are available yet.</p>}
                    <div className="space-y-6">
                      {bangleMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} bangles`}><h4 className="mb-3 flex items-center gap-3 font-serif text-lg text-[#17382D]">{group.metalType} Bangles <span className="h-px flex-1 bg-[#E7E0D3]" /></h4><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{group.products.map((product) => <Link key={product._id} href={`/products/${product.slug || product._id}`} onClick={() => setMegaMenuOpen(false)} className="group/card overflow-hidden border border-[#E6DFD3] bg-white transition-shadow hover:shadow-md"><div className="relative aspect-[1.15] overflow-hidden bg-[#F2EEE5]"><Image src={product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${product.name} — ${product.imageType || 'product image'}`} fill sizes="(max-width: 640px) 45vw, 220px" className="object-contain p-1 transition-transform duration-700 ease-out group-hover/card:scale-105"/><span className="absolute left-2 top-2 bg-[#FBF9F4]/95 px-2 py-1 text-[7px] uppercase tracking-wider text-[#53685D]">{product.imageType || 'Image source not recorded'}</span></div><div className="p-2.5"><p className="line-clamp-2 min-h-9 font-serif text-xs leading-snug text-[#17382D]">{product.name}</p><p className="mt-1 font-sans text-[9px] text-[#766F61]">{product.pricingType === 'price-on-request' || !product.price ? 'Price on request' : `₹${Number(product.price).toLocaleString('en-IN')}`}</p><p className="mt-1 text-[8px] uppercase tracking-wider text-[#8A604F]">{getNecklaceAvailability(product)}</p></div></Link>)}</div></section>)}
                    </div>
                    <section className="mt-6 border-t border-[#E7E0D3] pt-5"><h4 className="mb-3 font-serif text-lg text-[#17382D]">Explore by style</h4><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{bangleStyleGroups.filter((group) => group.product).map((group) => <Link key={group.slug} href={`/bangles?style=${group.slug}`} onClick={() => setMegaMenuOpen(false)} className="group/style overflow-hidden border border-[#E6DFD3] bg-white hover:shadow-md"><div className="relative aspect-[1.35] overflow-hidden bg-[#F2EEE5]"><Image src={group.product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${group.name} — AI-generated concept image`} fill sizes="(max-width: 640px) 45vw, 230px" className="object-contain p-1 transition-transform duration-700 group-hover/style:scale-105"/><span className="absolute left-2 top-2 bg-white/90 px-2 py-1 text-[7px] uppercase tracking-wider text-[#53685D]">AI-Generated Concept Image</span></div><p className="p-2.5 font-serif text-sm text-[#17382D]">{group.name}</p></Link>)}</div></section>
                  </div>
                  <section className="mt-7 border-t border-[#D8CFBD] pt-6">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.2em] text-[#9B8050]">One shared live catalogue</p><h3 className="mt-1 font-serif text-2xl text-[#17382D]">Casual &amp; Daily Wear</h3></div><Link href="/daily-wear" onClick={() => setMegaMenuOpen(false)} className="text-[10px] uppercase tracking-[.18em] text-[#7D2934] underline underline-offset-4">View all daily wear</Link></div>
                    {dailyWearMenuLoading && <p className="py-4 text-center text-xs text-[#66736A]">Loading daily wear designs…</p>}
                    {dailyWearMenuError && <p className="py-4 text-center text-xs text-[#7D2934]">The daily wear catalogue is temporarily unavailable.</p>}
                    {!dailyWearMenuLoading && !dailyWearMenuError && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{dailyWearCategoryTiles.map((tile) => tile.product && <Link key={tile.category} href={`/daily-wear?category=${encodeURIComponent(tile.category)}`} onClick={() => setMegaMenuOpen(false)} className="group/card overflow-hidden border border-[#E6DFD3] bg-white transition-shadow hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden bg-[#F2EEE5]"><SafeImage src={tile.product.images?.[0]} alt={tile.name} fill sizes="(max-width: 640px) 45vw, 180px" className="object-contain p-2 transition-transform duration-700 ease-out group-hover/card:scale-105" fallbackSrc="/images/placeholder-jewelry.jpg"/></div><p className="p-2 font-serif text-xs text-[#17382D]">Daily Wear {tile.name}</p></Link>)}</div>}
                  </section>
                  <div className="mt-5 flex justify-end border-t border-[#E7E0D3] pt-4">
                    <Link href="/necklaces" onClick={() => setMegaMenuOpen(false)} className="text-[10px] uppercase tracking-[.18em] text-[#7D2934] underline underline-offset-4">View all necklaces</Link>
                  </div>
                </div>
              </div>
            </li>
            {NAV_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isGoldActive = cat.name === 'Gold' && (pathname === '/gold' || pathname === '/categories/gold');
              const isDiamondActive = cat.name === 'Diamond' && (pathname === '/diamond' || pathname === '/categories/diamond');
              const isEarringsActive = cat.name === 'Earrings' && (pathname === '/earrings' || pathname === '/categories/earrings');
              const isNecklaceActive = cat.name === 'Necklaces' && (pathname === '/necklaces' || pathname === '/categories/necklaces');
              const isRingsActive = cat.name === 'Rings' && (pathname === '/rings' || pathname === '/categories/rings');
              const isBanglesActive = cat.name === 'Bangles' && (pathname === '/bangles' || pathname === '/categories/bangles');
              const isMenActive = cat.name === 'Men' && (pathname === '/men' || pathname === '/categories/men');
              const isKidsActive = cat.name === 'Kids' && (pathname === '/kids' || pathname === '/categories/kids');
              const isActive = isGoldActive || isDiamondActive || isEarringsActive || isNecklaceActive || isRingsActive || isBanglesActive || isMenActive || isKidsActive || pathname === cat.href || (cat.href !== '/products' && pathname?.startsWith(cat.href));
              return (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className={`flex flex-col items-center gap-1 group transition-colors py-1 relative ${
                      isActive ? 'text-[#8B1E2D] font-semibold' : 'text-[#2B2B2B] hover:text-[#8B1E2D]'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#C2AA6A]' : 'text-[#C2AA6A]/75 group-hover:text-[#8B1E2D]'
                    }`} />
                    <span className="text-xs font-sans uppercase tracking-widest font-medium">
                      {cat.name}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#8B1E2D] rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE DRAWER MENU
      ═══════════════════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="p-4 bg-[#4A0B13] text-white flex items-center justify-between border-b border-[#C2AA6A]/30">
              <BrandLogo variant="light" size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-white/80 hover:text-[#C2AA6A]"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-serif">
              <p className="text-[11px] font-sans uppercase tracking-widest text-[#8B1E2D] font-bold">
                Fine Jewelry Collections
              </p>
              <div className="overflow-hidden border border-[#D8CFBD] bg-[#FBF9F4]">
                <button type="button" onClick={() => setMobileJewelleryOpen((open) => !open)} aria-expanded={mobileJewelleryOpen} className="flex w-full items-center justify-between px-3 py-3 text-left text-[#17382D]">
                  <span><span className="block font-serif text-lg">Jewellery</span><span className="mt-0.5 block font-sans text-[9px] uppercase tracking-wider text-[#82775F]">Explore jewellery collections</span></span>
                  <ChevronDown className={`h-4 w-4 text-[#9B8050] transition-transform duration-300 ${mobileJewelleryOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-500 ease-in-out ${mobileJewelleryOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="space-y-3 border-t border-[#E7E0D3] p-2">
                      {necklaceMenuLoading && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">Loading live necklaces…</p>}
                      {necklaceMenuError && <p className="py-3 text-center font-sans text-[10px] text-[#7D2934]">Collection temporarily unavailable.</p>}
                      {!necklaceMenuLoading && !necklaceMenuError && necklaceMenuGroups.map((group) => group.products.length > 0 && (
                        <section key={group.metalType} aria-label={`${group.metalType} necklaces`}>
                          <h3 className="mb-2 px-1 font-serif text-sm text-[#17382D]">{group.metalType} Necklaces</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {group.products.map((product) => (
                              <Link key={product._id} href={`/products/${product.slug || product._id}`} onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="group/card overflow-hidden border border-[#E7E0D3] bg-white">
                                <div className="relative aspect-[1.2] overflow-hidden bg-[#F2EEE5]"><Image src={product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${product.name} — ${product.imageType || 'product image'}`} fill sizes="40vw" className="object-contain p-1 transition-transform duration-500 group-hover/card:scale-105" /><span className="absolute left-1 top-1 bg-white/90 px-1 py-0.5 font-sans text-[7px] uppercase tracking-wider text-[#53685D]">{product.imageType || 'Image type unknown'}</span></div>
                                <span className="block px-2 pt-1.5 font-serif text-[11px] leading-tight text-[#17382D]">{product.name}</span>
                                <span className="block px-2 pb-1.5 pt-1 font-sans text-[8px] text-[#766F61]">{product.pricingType === 'price-on-request' || !product.price ? 'Price on request' : `₹${Number(product.price).toLocaleString('en-IN')}`}<br />{getNecklaceAvailability(product)}</span>
                              </Link>
                            ))}
                          </div>
                        </section>
                      ))}
                      {!necklaceMenuLoading && !necklaceMenuError && necklaceProducts.length === 0 && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">No published necklaces are available yet.</p>}
                      <section className="border-t border-[#D8CFBD] pt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-lg text-[#17382D]">Earrings</h3><Link href="/earrings" onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="text-[9px] uppercase tracking-wider text-[#7D2934] underline">View all</Link></div>{earringMenuLoading && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">Loading live earrings…</p>}{earringMenuError && <p className="py-3 text-center font-sans text-[10px] text-[#7D2934]">Earrings collection temporarily unavailable.</p>}{!earringMenuLoading && !earringMenuError && earringMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} earrings`}><h4 className="mb-2 px-1 font-serif text-sm text-[#17382D]">{group.metalType} Earrings</h4><div className="mb-3 grid grid-cols-2 gap-2">{group.products.map((product) => <EarringsMenuCard key={product._id} product={product} mobile onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} />)}</div></section>)}</section>
                      <section className="border-t border-[#D8CFBD] pt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-lg text-[#17382D]">Casual &amp; Daily Wear</h3><Link href="/daily-wear" onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="text-[9px] uppercase tracking-wider text-[#7D2934] underline">View all</Link></div>{dailyWearMenuLoading && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">Loading live daily wear…</p>}{dailyWearMenuError && <p className="py-3 text-center font-sans text-[10px] text-[#7D2934]">Daily wear catalogue temporarily unavailable.</p>}{!dailyWearMenuLoading && !dailyWearMenuError && <div className="mb-3 grid grid-cols-2 gap-2">{dailyWearCategoryTiles.map((tile) => tile.product && <Link key={tile.category} href={`/daily-wear?category=${encodeURIComponent(tile.category)}`} onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="group/card overflow-hidden border border-[#E7E0D3] bg-white"><div className="relative aspect-[4/3] overflow-hidden bg-[#F2EEE5]"><SafeImage src={tile.product.images?.[0]} alt={`${tile.name} — AI-generated concept image`} fill sizes="42vw" className="object-contain p-1 transition-transform duration-500 group-hover/card:scale-105" fallbackSrc="/images/placeholder-jewelry.jpg"/></div><span className="block p-2 font-serif text-[11px] text-[#17382D]">{tile.name}</span></Link>)}</div>}</section>
                      <section className="border-t border-[#D8CFBD] pt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-lg text-[#17382D]">Rings</h3><Link href="/rings" onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="text-[9px] uppercase tracking-wider text-[#7D2934] underline">View all</Link></div>{ringMenuLoading && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">Loading live rings…</p>}{ringMenuError && <p className="py-3 text-center font-sans text-[10px] text-[#7D2934]">Rings collection temporarily unavailable.</p>}{!ringMenuLoading && !ringMenuError && ringMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} rings`}><h4 className="mb-2 px-1 font-serif text-sm text-[#17382D]">{group.metalType} Rings</h4><div className="mb-3 grid grid-cols-2 gap-2">{group.products.map((product) => <EarringsMenuCard key={product._id} product={product} mobile onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} />)}</div></section>)}</section>
                      <div className="border-t border-[#D8CFBD] pt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-lg text-[#17382D]">Bangles</h3><Link href="/bangles" onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="text-[9px] uppercase tracking-wider text-[#7D2934] underline">View all</Link></div>{bangleMenuLoading && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">Loading live bangles…</p>}{bangleMenuError && <p className="py-3 text-center font-sans text-[10px] text-[#7D2934]">Bangle collection temporarily unavailable.</p>}{!bangleMenuLoading && !bangleMenuError && bangleProducts.length === 0 && <p className="py-3 text-center font-sans text-[10px] text-[#66736A]">No published bangles are available yet.</p>}<div className="space-y-3">{bangleMenuGroups.map((group) => group.products.length > 0 && <section key={group.metalType} aria-label={`${group.metalType} bangles`}><h4 className="mb-2 px-1 font-serif text-sm text-[#17382D]">{group.metalType} Bangles</h4><div className="grid grid-cols-2 gap-2">{group.products.map((product) => <Link key={product._id} href={`/products/${product.slug || product._id}`} onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="group/card overflow-hidden border border-[#E7E0D3] bg-white"><div className="relative aspect-[1.2] overflow-hidden bg-[#F2EEE5]"><Image src={product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${product.name} — ${product.imageType || 'product image'}`} fill sizes="40vw" className="object-contain p-1 transition-transform duration-500 group-hover/card:scale-105"/><span className="absolute left-1 top-1 bg-white/90 px-1 py-0.5 font-sans text-[7px] uppercase tracking-wider text-[#53685D]">{product.imageType || 'Image type unknown'}</span></div><span className="block px-2 pt-1.5 font-serif text-[11px] leading-tight text-[#17382D]">{product.name}</span><span className="block px-2 pb-1.5 pt-1 font-sans text-[8px] text-[#766F61]">{product.pricingType === 'price-on-request' || !product.price ? 'Price on request' : `₹${Number(product.price).toLocaleString('en-IN')}`}<br/>{getNecklaceAvailability(product)}</span></Link>)}</div></section>)}</div></div>
                      <section className="border-t border-[#D8CFBD] pt-3"><h4 className="mb-2 px-1 font-serif text-sm text-[#17382D]">Shop by bangle style</h4><div className="grid grid-cols-2 gap-2">{bangleStyleGroups.filter((group) => group.product).map((group) => <Link key={group.slug} href={`/bangles?style=${group.slug}`} onClick={() => { setMobileMenuOpen(false); setMobileJewelleryOpen(false); }} className="overflow-hidden border border-[#E7E0D3] bg-white"><div className="relative aspect-[1.3] bg-[#F2EEE5]"><Image src={group.product.images?.[0] || '/images/placeholder-jewelry.jpg'} alt={`${group.name} — AI-generated concept image`} fill sizes="40vw" className="object-contain p-1"/></div><span className="block p-2 font-serif text-[11px] text-[#17382D]">{group.name}</span></Link>)}</div></section>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 text-base text-[#4A0B13]">
                {NAV_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <li key={cat.name}>
                  <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-1 hover:text-[#C2AA6A] transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-[#C2AA6A]" />
                        <span>{cat.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-4 border-t border-[#E6DFD3] space-y-3 font-sans text-xs">
                <p className="text-[11px] uppercase tracking-widest text-[#8B1E2D] font-bold">Customer Care</p>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#454545] hover:text-[#8B1E2D]"
                >
                  About Rishi Lal Heritage
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#454545] hover:text-[#8B1E2D]"
                >
                  Boutique Concierge &amp; Contact
                </Link>
                <Link
                  href="/faqs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#454545] hover:text-[#8B1E2D]"
                >
                  Purity &amp; Certification FAQs
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F8F5EF] border-t border-[#E6DFD3] font-sans text-xs text-charcoal-600">
              <p className="font-semibold text-[#4A0B13] mb-1">Concierge Hotline</p>
              <div className="space-y-0.5">
                <a
                  href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                  className="block font-medium text-emerald-950 hover:text-[#8B1E2D] transition-colors"
                >
                  {BRAND_CONFIG.contact.phone}
                </a>
                <a
                  href={`tel:${BRAND_CONFIG.contact.phoneSecondaryRaw}`}
                  className="block font-medium text-emerald-950 hover:text-[#8B1E2D] transition-colors"
                >
                  {BRAND_CONFIG.contact.phoneSecondary}
                </a>
              </div>
              <p className="text-[11px] text-charcoal-500 mt-2">
                100% BIS Hallmarked • Insured Armored Shipping
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
