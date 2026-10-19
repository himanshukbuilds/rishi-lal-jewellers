'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShieldCheck,
  Gem,
  Truck,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  CheckCircle2,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { BRAND_CONFIG } from '@/config/brandConfig';

// Zod schema for newsletter validation
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address')
    .email('Please enter a valid email address'),
});

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
  });

  const onNewsletterSubmit = async (data) => {
    // Simulate luxury newsletter subscription
    await new Promise((r) => setTimeout(r, 600));
    setSubscribed(true);
    reset();
  };

  return (
    <footer className="bg-emerald-950 text-ivory-100 border-t border-gold-400/30 font-sans">
      {/* 1. Trust Pillars Showcase */}
      <div className="border-b border-gold-400/20 bg-emerald-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory-50 tracking-wide">
                100% BIS Hallmarked Gold
              </h4>
              <p className="text-xs text-ivory-300/80 mt-1 leading-relaxed">
                Every creation carries government-mandated HUID purity stamp.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-400 shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory-50 tracking-wide">
                IGI & GIA Certified Solitaires
              </h4>
              <p className="text-xs text-ivory-300/80 mt-1 leading-relaxed">
                Natural conflict-free diamonds with optical grading guarantee.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory-50 tracking-wide">
                Lifetime Exchange & Buyback
              </h4>
              <p className="text-xs text-ivory-300/80 mt-1 leading-relaxed">
                Guaranteed market valuation across all flagship ateliers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-full bg-emerald-950 border border-gold-400/30 text-gold-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory-50 tracking-wide">
                Complimentary Insured Transit
              </h4>
              <p className="text-xs text-ivory-300/80 mt-1 leading-relaxed">
                Armored discreet courier coverage to 26,000+ Indian PIN codes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column (2 spans on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-xs text-ivory-300/80 leading-relaxed max-w-sm pt-2">
              Inspired by the eternal splendor of Indian royalty and modern architectural finesse,
              Rishi Lal Jewellers crafts rare heirlooms in 22KT hallmarked gold and certified solitaires for life’s grandest celebrations.
            </p>

            <div className="pt-2 space-y-2 text-xs text-ivory-300/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{BRAND_CONFIG.flagshipStore.name}, {BRAND_CONFIG.flagshipStore.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Concierge: {BRAND_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{BRAND_CONFIG.contact.hours}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-gold-400">
              <a
                href={BRAND_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-emerald-900/60 hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-emerald-900/60 hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BRAND_CONFIG.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-emerald-900/60 hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-wider uppercase font-semibold text-gold-300">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300/80">
              <li>
                <Link href="/categories/bridal" className="hover:text-gold-300 transition-colors">
                  Grand Bridal Heritage
                </Link>
              </li>
              <li>
                <Link href="/categories/diamond" className="hover:text-gold-300 transition-colors">
                  Solitaire Diamond Rings
                </Link>
              </li>
              <li>
                <Link href="/categories/gold" className="hover:text-gold-300 transition-colors">
                  22K Temple Gold Necklaces
                </Link>
              </li>
              <li>
                <Link href="/categories/earrings" className="hover:text-gold-300 transition-colors">
                  Kundan & Polki Jhumkas
                </Link>
              </li>
              <li>
                <Link href="/categories/bangles" className="hover:text-gold-300 transition-colors">
                  Die-Struck Royal Kadas
                </Link>
              </li>
              <li>
                <Link href="/categories/gifts" className="hover:text-gold-300 transition-colors">
                  Anniversary Fine Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-wider uppercase font-semibold text-gold-300">
              Concierge Care
            </h4>
            <ul className="space-y-2 text-xs text-ivory-300/80">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Our Heritage & Karigars
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Book Virtual Video Call
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gold-300 transition-colors">
                  Gold Purity & Hallmark Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-gold-300 transition-colors">
                  Insured Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-gold-300 transition-colors">
                  15-Day Exchange & Returns
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gold-400 hover:text-gold-200 transition-colors font-medium">
                  Atelier Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm tracking-wider uppercase font-semibold text-gold-300">
              The Rishi Lal Gazette
            </h4>
            <p className="text-xs text-ivory-300/80 leading-relaxed">
              Receive private invitations to high-jewelry unveilings, bridal trunk shows, and seasonal privileges.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-900 border border-gold-400/40 rounded-sm flex items-center gap-2 text-xs text-gold-300 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Thank you. You have been added to our private connoisseur circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    className="w-full px-3 py-2 text-xs bg-emerald-900/60 border border-gold-400/30 rounded-sm focus:outline-none focus:border-gold-400 text-ivory-50 placeholder-ivory-400/60 font-sans"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-medium text-xs uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining...' : 'Request Invitation'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 3. Bottom Legal & Academic Banner */}
        <div className="mt-12 pt-6 border-t border-gold-400/20 flex flex-col md:flex-row items-center justify-between text-[11px] text-ivory-300/70 gap-4">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/shipping-policy" className="hover:text-gold-300 transition-colors">
              Insured Transit
            </Link>
            <Link href="/returns-refunds" className="hover:text-gold-300 transition-colors">
              Returns & Refunds
            </Link>
          </div>
        </div>

        {/* College Project Disclaimer Badge */}
        <div className="mt-6 p-3 rounded-sm bg-emerald-900/40 border border-gold-400/20 text-center text-[10px] text-ivory-300/70">
          <p className="font-serif text-gold-300 font-medium mb-0.5">
            Academic Project Demonstration • INT252 (ReactJS) & INT257 (Modern Web App Development)
          </p>
          <p>
            Rishi Lal Jewellers is a full-stack jewellery e-commerce platform. Precious metal market benchmarks are integrated with official provider feeds (IBJA / GoldAPI).
          </p>
        </div>
      </div>
    </footer>
  );
}

