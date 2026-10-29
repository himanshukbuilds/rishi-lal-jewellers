'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MoreHorizontal,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { BRAND_CONFIG } from '@/config/brandConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// Announcement bar rotating messages
const ANNOUNCEMENT_MESSAGES = [
  'Discover the Rishi Lal Jewellers collection',
  'Jewellery for the moments that matter',
  'Explore traditional, contemporary and bridal designs',
];

// Category navigation items with lucide icons
const NAV_CATEGORIES = [
  { name: 'All Jewellery', href: '/products', icon: Sparkles },
  { name: 'Gold', href: '/gold', icon: Crown },
  { name: 'Diamond', href: '/diamond', icon: Gem },
  { name: 'Earrings', href: '/earrings', icon: Disc },
  { name: 'Rings', href: '/rings', icon: CircleDot },
  { name: 'Necklaces', href: '/necklaces', icon: Link2 },
  { name: 'Bangles', href: '/bangles', icon: Circle },
  { name: 'Daily Wear', href: '/products?category=Gold&maxPrice=50000', icon: Sun },
  { name: 'Wedding', href: '/categories/bridal', icon: Heart },
  { name: 'Gifting', href: '/categories/gifts', icon: Gift },
  { name: 'More', href: '/products', icon: MoreHorizontal },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementFade, setAnnouncementFade] = useState(true);

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
        <div className="bg-[#8B1E2D] text-white px-4 py-2 text-xs tracking-wider border-b border-[#C2AA6A]/20 font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Trust badge */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/90 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2AA6A]" />
              <span>Rishi Lal Jewellers · Crafted for every occasion</span>
            </div>

            {/* Center: Rotating announcement */}
            <div className="flex-1 flex justify-center">
              <div
                className={`flex items-center gap-1.5 font-medium text-xs transition-opacity duration-400 ${
                  announcementFade ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDuration: '400ms' }}
              >
                <Sparkles className="w-3 h-3 text-[#C2AA6A] animate-pulse" />
                <span className="tracking-wide text-white">{ANNOUNCEMENT_MESSAGES[announcementIndex]}</span>
              </div>
            </div>

            {/* Right: Close button */}
            <button
              onClick={() => setBarDismissed(true)}
              className="flex-shrink-0 ml-4 p-0.5 text-white/70 hover:text-[#C2AA6A] transition-colors"
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
          isScrolled ? 'py-2 shadow-md shadow-black/5' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* LEFT: Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 mr-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
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
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-[#4A0B13] hover:text-[#C2AA6A] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
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
          <ul className="flex items-center justify-center gap-7 py-2.5">
            {NAV_CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isGoldActive = cat.name === 'Gold' && (pathname === '/gold' || pathname === '/categories/gold');
              const isDiamondActive = cat.name === 'Diamond' && (pathname === '/diamond' || pathname === '/categories/diamond');
              const isEarringsActive = cat.name === 'Earrings' && (pathname === '/earrings' || pathname === '/categories/earrings');
              const isNecklaceActive = cat.name === 'Necklaces' && (pathname === '/necklaces' || pathname === '/categories/necklaces');
              const isRingsActive = cat.name === 'Rings' && (pathname === '/rings' || pathname === '/categories/rings');
              const isBanglesActive = cat.name === 'Bangles' && (pathname === '/bangles' || pathname === '/categories/bangles');
              const isActive = isGoldActive || isDiamondActive || isEarringsActive || isNecklaceActive || isRingsActive || isBanglesActive || pathname === cat.href || (cat.href !== '/products' && pathname?.startsWith(cat.href));
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
              <p>{BRAND_CONFIG.contact.phone}</p>
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
