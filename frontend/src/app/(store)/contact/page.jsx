'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brandConfig';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(2, 'Please select a subject'),
  message: z.string().min(10, 'Please enter your message (at least 10 characters)'),
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-emerald-950 text-ivory-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold">
            Boutique Concierge
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ivory-50">
            Connect with Our Curators
          </h1>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
          <p className="font-sans text-xs sm:text-sm text-ivory-200/85 mt-3 leading-relaxed">
            Schedule a bridal consultation, inquire about custom gemstone sourcing, or visit our flagship atelier.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info & Boutique Hours */}
          <div className="space-y-8 font-sans text-xs text-charcoal-700">
            <div>
              <span className="text-gold-700 font-bold uppercase tracking-widest text-[11px] block mb-1">
                Flagship Atelier
              </span>
              <h2 className="font-serif text-2xl text-emerald-950 font-normal">
                {BRAND_CONFIG.flagshipStore.name}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 bg-white rounded-sm border border-gold-200">
                <MapPin className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-emerald-950 text-sm">Boutique Address</h4>
                  <p className="text-charcoal-600 mt-1 leading-relaxed">
                    {BRAND_CONFIG.flagshipStore.addressLine1}, {BRAND_CONFIG.flagshipStore.addressLine2}, {BRAND_CONFIG.flagshipStore.city}, {BRAND_CONFIG.flagshipStore.state} - {BRAND_CONFIG.flagshipStore.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white rounded-sm border border-gold-200">
                <Phone className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-emerald-950 text-sm">Concierge Hotline & WhatsApp</h4>
                  <p className="text-charcoal-600 mt-1">Direct: {BRAND_CONFIG.contact.phone}</p>
                  <p className="text-charcoal-600">Toll-Free India: {BRAND_CONFIG.contact.tollFree}</p>
                  <p className="text-emerald-800 font-medium mt-1">WhatsApp Concierge: {BRAND_CONFIG.contact.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white rounded-sm border border-gold-200">
                <Mail className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-emerald-950 text-sm">Electronic Correspondence</h4>
                  <p className="text-charcoal-600 mt-1">Concierge: {BRAND_CONFIG.contact.email}</p>
                  <p className="text-charcoal-600">Client Care: {BRAND_CONFIG.contact.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-white rounded-sm border border-gold-200">
                <Clock className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-emerald-950 text-sm">Salon Hours</h4>
                  <p className="text-charcoal-600 mt-1">{BRAND_CONFIG.contact.hours}</p>
                  <p className="text-gold-700 mt-0.5 italic">Private salon visits available by prior appointment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="bg-white p-8 rounded-sm border border-gold-300 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-emerald-950 mb-2">
              Send an Inquiry
            </h3>
            <p className="text-xs text-charcoal-600 font-sans mb-6">
              Our jewelry curators respond to private inquiries within 24 business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-900/10 border border-emerald-800/30 rounded-sm text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-800 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-950">Inquiry Received</h4>
                <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
                  Thank you for reaching out to Rishi Lal Jewellers. A dedicated jewelry curator will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-emerald-950 text-gold-300 text-xs uppercase tracking-wider font-semibold rounded-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Maharani Gayatri"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. patron@example.com"
                      className="w-full px-3 py-2 border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600"
                    />
                    {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. 9820012345"
                      className="w-full px-3 py-2 border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600"
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Inquiry Nature *
                  </label>
                  <select
                    {...register('subject')}
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm bg-white focus:outline-none focus:border-gold-600"
                  >
                    <option value="Bridal Consultation">Bespoke Bridal Trousseau Consultation</option>
                    <option value="Solitaire Inquiries">Solitaire Diamond Custom Ordering</option>
                    <option value="Purity Certification">BIS Hallmarking & Hallmark Inquiries</option>
                    <option value="Order Tracking">Existing Order Consignment Tracking</option>
                    <option value="Other Concierge">General Atelier Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Your Message / Desired Date *
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Tell us about the occasion, design preferences, or budget range..."
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600"
                  />
                  {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8B1E2D] hover:bg-[#4A0B13] text-white uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors border border-[#C2AA6A]/40 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

