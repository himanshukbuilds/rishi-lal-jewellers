'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Gem,
  Package,
  Users,
  ExternalLink,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // If on admin login page, don't show the dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center text-gold-300 font-sans text-xs">
        Verifying administrator authorization...
      </div>
    );
  }

  // Strict RBAC Access Barrier: Not logged in or not an admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-6 text-center text-ivory-50">
        <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-normal text-ivory-50 mb-2">
          Restricted Administrator Access
        </h2>
        <p className="text-xs text-ivory-300/80 max-w-md font-sans mb-6 leading-relaxed">
          The Rishi Lal Atelier Administration Portal requires verified administrator credentials.
          Customer accounts are strictly prohibited from viewing backend operations.
        </p>
        <div className="flex gap-4">
          <Link
            href="/admin/login"
            className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-emerald-950 text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors"
          >
            Admin Sign In
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-transparent border border-gold-400/40 text-ivory-50 text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-emerald-900 transition-colors"
          >
            Customer Storefront
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Jewelry Catalog', href: '/admin/products', icon: Gem },
    { label: 'Order Management', href: '/admin/orders', icon: Package },
    { label: 'Registered Patrons', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-emerald-950 text-ivory-50 p-4 flex items-center justify-between border-b border-gold-400/30">
        <BrandLogo variant="light" size="sm" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gold-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`w-full md:w-64 bg-emerald-950 text-ivory-50 flex flex-col justify-between border-r border-gold-400/20 shrink-0 ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Logo & Portal Badge */}
          <div className="p-6 border-b border-gold-400/20">
            <BrandLogo variant="light" size="md" />
            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-900 text-[10px] text-gold-300 font-bold uppercase tracking-wider border border-gold-400/30">
              <ShieldCheck className="w-3 h-3 text-gold-400" />
              <span>Atelier Admin Portal</span>
            </div>
          </div>

          {/* Admin Profile Pill */}
          <div className="px-6 py-4 bg-emerald-900/40 border-b border-gold-400/10 text-xs">
            <span className="text-[10px] text-gold-400 uppercase tracking-widest block font-medium">
              Signed In Curator
            </span>
            <span className="font-semibold text-ivory-50 truncate block mt-0.5">{user.name}</span>
            <span className="text-[11px] text-ivory-400/80 truncate block">{user.email}</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm transition-colors font-medium ${
                    isActive
                      ? 'bg-gold-500 text-emerald-950 font-bold shadow-sm'
                      : 'text-ivory-200 hover:bg-emerald-900/60 hover:text-gold-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-gold-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gold-400/20 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 text-ivory-300 hover:text-gold-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gold-400" />
            <span>Storefront Customer View</span>
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-sm transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}

