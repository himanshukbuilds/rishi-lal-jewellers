'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  Gem,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { api } from '@/services/api';

export default function LivePreciousMetalsPrices() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Diamond 4Cs interactive parameters
  const [selectedCarat, setSelectedCarat] = useState(1.0);
  const [selectedShape, setSelectedShape] = useState('Round Brilliant');
  const [selectedColor, setSelectedColor] = useState('D-F (Colorless)');
  const [selectedClarity, setSelectedClarity] = useState('VVS1-VVS2');
  const [selectedOrigin, setSelectedOrigin] = useState('Natural Earth-Mined');

  const fetchRates = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await api.getMarketPrices(force);
      setMarketData(data);
    } catch (err) {
      console.warn('Failed to load market rates:', err);
      setError('Unable to retrieve market prices. Please try again shortly.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleToggle = () => {
    if (!isExpanded && !marketData) {
      fetchRates(false);
    }
    setIsExpanded((prev) => !prev);
  };

  // Format price helper
  const formatINR = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '—';
    return `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <section
      id="precious-metals-pricing"
      aria-label="Today's Precious Metal Prices"
      className="bg-white py-6 sm:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Outer Framed Banner Container matching the luxury aesthetic */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#C2AA6A]/40 bg-gradient-to-r from-[#4A0B13] via-[#731422] to-[#4A0B13] p-1 shadow-md transition-all duration-300">
          {/* Inner Decorative Framing Line */}
          <div className="relative rounded-xl border border-[#C2AA6A]/30 p-5 sm:p-7 text-white">
            {/* Top Bar: Heading, Subtitle, and Toggle Button */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C2AA6A]/40 bg-[#4A0B13]/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E4D4A7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C2AA6A] animate-pulse" />
                    Market rates • India
                  </span>
                  {marketData?.dataStatus === 'CURRENT' && (
                    <span className="rounded bg-emerald-900/60 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                      Official Benchmark
                    </span>
                  )}
                  {marketData?.dataStatus === 'STALE' && (
                    <span className="rounded bg-amber-900/60 border border-amber-400/30 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                      Cached Benchmark
                    </span>
                  )}
                  {marketData?.dataStatus === 'UNCONFIGURED' && (
                    <span className="rounded bg-amber-950/60 border border-[#C2AA6A]/40 px-2 py-0.5 text-[10px] font-medium text-[#E4D4A7]">
                      Provider Setup Required
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl font-normal tracking-wide text-white sm:text-3xl">
                  Today&apos;s Precious Metal Prices
                </h2>

                <p className="font-sans text-xs text-white/80 sm:text-sm">
                  Check the latest available gold, silver and diamond market benchmark rates.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={handleToggle}
                  className="group inline-flex items-center gap-2 rounded-xl border border-[#C2AA6A] bg-gradient-to-r from-[#C2AA6A] to-[#D8C488] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#4A0B13] shadow-sm transition-all duration-300 hover:from-white hover:to-[#E4D4A7] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C2AA6A] focus:ring-offset-2 focus:ring-offset-[#4A0B13]"
                >
                  <span>{isExpanded ? 'HIDE PRICES' : "CHECK TODAY'S PRICES"}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Price Details Panel */}
            {isExpanded && (
              <div className="mt-6 border-t border-[#C2AA6A]/25 pt-6 transition-all duration-500 ease-out animate-in fade-in slide-in-from-top-4">
                {/* Header Controls inside Expanded Panel */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/75">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#C2AA6A]" />
                    <span>
                      {marketData?.retrievedAt ? (
                        <>
                          Retrieved: {new Date(marketData.retrievedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}, {new Date(marketData.retrievedAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {marketData.session && ` • ${marketData.session}`}
                        </>
                      ) : (
                        'Fetching latest official benchmark...'
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {marketData?.provider && (
                      <span className="hidden text-[11px] text-[#E4D4A7] sm:inline">
                        Source: {marketData.provider}
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={isRefreshing || isLoading}
                      onClick={() => fetchRates(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                      title="Request fresh rates from provider"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#C2AA6A]' : ''}`} />
                      <span>{isRefreshing ? 'Refreshing...' : 'Refresh Prices'}</span>
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#C2AA6A]" />
                    <p className="mt-3 font-serif text-sm text-white">
                      Connecting to precious metal market feeds...
                    </p>
                    <p className="text-xs text-white/60">
                      Querying official bullion benchmarks (IBJA / GoldAPI)
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {error && !isLoading && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-xs text-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Market Feed Notice</p>
                      <p className="mt-0.5 text-white/80">{error}</p>
                    </div>
                  </div>
                )}

                {/* Provider Configuration Notice */}
                {!isLoading && marketData?.dataStatus === 'UNCONFIGURED' && (
                  <div className="mb-6 rounded-xl border border-[#C2AA6A]/40 bg-[#2D050B] p-4 text-xs text-white/90">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-[#C2AA6A] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#E4D4A7]">
                          Precious Metal Provider Configuration Required
                        </h4>
                        <p className="mt-1 text-white/80 leading-relaxed">
                          Rishi Lal Jewellers displays genuine Indian market benchmark prices directly from authorized bullion data providers (IBJA / GoldAPI) rather than fabricated numbers. To activate live streaming on this server, set <code className="text-[#E4D4A7] font-semibold bg-black/30 px-1 py-0.5 rounded">IBJA_ACCESS_TOKEN</code> or <code className="text-[#E4D4A7] font-semibold bg-black/30 px-1 py-0.5 rounded">GOLDAPI_KEY</code> in <code className="text-[#E4D4A7]">backend/.env</code>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Three Differentiated Price Sections */}
                {!isLoading && (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* SECTION A: GOLD RATES */}
                    <div className="flex flex-col rounded-xl border border-[#C2AA6A]/35 bg-white/5 p-5 backdrop-blur-xs">
                      <div className="flex items-center justify-between border-b border-[#C2AA6A]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C2AA6A]/20 text-[#C2AA6A]">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-semibold text-white">
                              Gold Rates
                            </h3>
                            <p className="text-[10px] text-white/60">
                              Official Indian Bullion Benchmark
                            </p>
                          </div>
                        </div>
                        <span className="rounded bg-[#C2AA6A]/20 px-2 py-0.5 text-[10px] font-bold text-[#E4D4A7]">
                          24K / 22K / 18K
                        </span>
                      </div>

                      {marketData?.gold?.available ? (
                        <div className="mt-4 flex-1 space-y-3.5">
                          {/* 24K 999 */}
                          <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-semibold text-white">
                                24K Pure Gold (999)
                              </span>
                              <span className="font-serif text-base font-bold text-[#E4D4A7]">
                                {formatINR(marketData.gold.rates?.['24k']?.perGram)} / g
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
                              <span>Per 10 Grams:</span>
                              <span className="font-medium text-white/90">
                                {formatINR(marketData.gold.rates?.['24k']?.per10Gram)}
                              </span>
                            </div>
                          </div>

                          {/* 22K 916 (Standard Jewelry) */}
                          <div className="rounded-lg bg-[#C2AA6A]/10 p-3 border border-[#C2AA6A]/30">
                            <div className="flex items-baseline justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">
                                  22K Jewelry Gold (916)
                                </span>
                                <span className="rounded bg-[#C2AA6A] px-1 py-0.2 text-[8px] font-bold uppercase text-[#4A0B13]">
                                  Most Popular
                                </span>
                              </div>
                              <span className="font-serif text-base font-bold text-[#E4D4A7]">
                                {formatINR(marketData.gold.rates?.['22k']?.perGram)} / g
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
                              <span>Per 10 Grams:</span>
                              <span className="font-medium text-white/90">
                                {formatINR(marketData.gold.rates?.['22k']?.per10Gram)}
                              </span>
                            </div>
                          </div>

                          {/* 18K 750 */}
                          <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-semibold text-white">
                                18K Diamond Jewelry Gold (750)
                              </span>
                              <span className="font-serif text-base font-bold text-[#E4D4A7]">
                                {formatINR(marketData.gold.rates?.['18k']?.perGram)} / g
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-white/60">
                              <span>Per 10 Grams:</span>
                              <span className="font-medium text-white/90">
                                {formatINR(marketData.gold.rates?.['18k']?.per10Gram)}
                              </span>
                            </div>
                          </div>

                          <p className="pt-1 text-[10px] text-white/60 italic leading-relaxed">
                            {marketData.gold.disclaimer ||
                              '*Wholesale benchmark rate excluding 3% GST and making charges.'}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 flex-1 space-y-3">
                          <div className="rounded-lg bg-white/5 p-3 border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">24K Pure Gold (999)</span>
                            <span className="text-[11px] text-[#E4D4A7]/70 italic">Awaiting Provider Feed</span>
                          </div>
                          <div className="rounded-lg bg-[#C2AA6A]/10 p-3 border border-[#C2AA6A]/30 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">22K Jewelry Gold (916)</span>
                            <span className="text-[11px] text-[#E4D4A7]/70 italic">Awaiting Provider Feed</span>
                          </div>
                          <div className="rounded-lg bg-white/5 p-3 border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">18K Diamond Gold (750)</span>
                            <span className="text-[11px] text-[#E4D4A7]/70 italic">Awaiting Provider Feed</span>
                          </div>

                          <div className="rounded-lg bg-black/25 p-3 text-center text-xs text-white/70">
                            <p className="text-[11px]">
                              Configure <code className="text-[#C2AA6A]">IBJA_ACCESS_TOKEN</code> or <code className="text-[#C2AA6A]">GOLDAPI_KEY</code> in <code className="text-white">backend/.env</code> to stream live rates.
                            </p>
                            <Link
                              href="/products?category=Gold"
                              className="mt-2.5 inline-block font-sans text-xs font-semibold text-[#E4D4A7] hover:underline"
                            >
                              Explore 22KT Gold Catalog →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION B: SILVER RATES */}
                    <div className="flex flex-col rounded-xl border border-[#C2AA6A]/35 bg-white/5 p-5 backdrop-blur-xs">
                      <div className="flex items-center justify-between border-b border-[#C2AA6A]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/20 text-slate-200">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-semibold text-white">
                              Silver Rates
                            </h3>
                            <p className="text-[10px] text-white/60">
                              Physical Bullion Benchmark
                            </p>
                          </div>
                        </div>
                        <span className="rounded bg-slate-200/20 px-2 py-0.5 text-[10px] font-bold text-slate-100">
                          999 Purity
                        </span>
                      </div>

                      {marketData?.silver?.available ? (
                        <div className="mt-4 flex-1 space-y-3.5">
                          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-semibold text-white">
                                Pure Silver 999 (Per Gram)
                              </span>
                              <span className="font-serif text-lg font-bold text-[#E4D4A7]">
                                {formatINR(marketData.silver.perGram)} / g
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-semibold text-white">
                                Silver Bullion (Per Kilogram)
                              </span>
                              <span className="font-serif text-lg font-bold text-[#E4D4A7]">
                                {formatINR(marketData.silver.perKg)} / kg
                              </span>
                            </div>
                          </div>

                          <div className="rounded-lg bg-black/20 p-3 text-[11px] text-white/70 space-y-1">
                            <p className="font-semibold text-[#E4D4A7]">Silver Idols & Bullion Keepsakes</p>
                            <p>
                              Handcrafted solid silver murtis and 999 coins are available in our curated collection.
                            </p>
                            <Link
                              href="/categories/silver-idols"
                              className="inline-block pt-1 font-semibold text-[#C2AA6A] hover:underline"
                            >
                              Explore 999 Silver Idols →
                            </Link>
                          </div>

                          <p className="pt-1 text-[10px] text-white/60 italic leading-relaxed">
                            {marketData.silver.disclaimer ||
                              '*Benchmark rate for 999 pure silver bars and bullion.'}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 flex-1 space-y-3">
                          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Pure Silver 999 (Per Gram)</span>
                            <span className="text-[11px] text-[#E4D4A7]/70 italic">Awaiting Provider Feed</span>
                          </div>
                          <div className="rounded-lg bg-white/5 p-3.5 border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Silver Bullion (Per Kilogram)</span>
                            <span className="text-[11px] text-[#E4D4A7]/70 italic">Awaiting Provider Feed</span>
                          </div>

                          <div className="rounded-lg bg-black/25 p-3 text-center text-xs text-white/70">
                            <p className="text-[11px]">
                              Configure <code className="text-[#C2AA6A]">IBJA_ACCESS_TOKEN</code> or <code className="text-[#C2AA6A]">GOLDAPI_KEY</code> in backend configuration.
                            </p>
                            <Link
                              href="/categories/silver-idols"
                              className="mt-2.5 inline-block font-sans text-xs font-semibold text-[#E4D4A7] hover:underline"
                            >
                              Explore Divine Silver Idols Collection →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION C: DIAMOND BENCHMARKS */}
                    <div className="flex flex-col rounded-xl border border-[#C2AA6A]/35 bg-white/5 p-5 backdrop-blur-xs">
                      <div className="flex items-center justify-between border-b border-[#C2AA6A]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C2AA6A]/20 text-[#C2AA6A]">
                            <Gem className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-serif text-base font-semibold text-white">
                              Diamond Benchmarks
                            </h3>
                            <p className="text-[10px] text-white/60">
                              4Cs Valuation & Standards
                            </p>
                          </div>
                        </div>
                        <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                          GIA / IGI
                        </span>
                      </div>

                      <div className="mt-4 flex-1 flex flex-col justify-between space-y-3">
                        {/* Interactive 4Cs Parameter Explorer */}
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                                Carat
                              </label>
                              <select
                                value={selectedCarat}
                                onChange={(e) => setSelectedCarat(parseFloat(e.target.value))}
                                className="w-full rounded bg-[#4A0B13] border border-[#C2AA6A]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C2AA6A]"
                              >
                                <option value={0.5}>0.50 Carat</option>
                                <option value={0.75}>0.75 Carat</option>
                                <option value={1.0}>1.00 Carat</option>
                                <option value={1.5}>1.50 Carat</option>
                                <option value={2.0}>2.00 Carats</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                                Shape
                              </label>
                              <select
                                value={selectedShape}
                                onChange={(e) => setSelectedShape(e.target.value)}
                                className="w-full rounded bg-[#4A0B13] border border-[#C2AA6A]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C2AA6A]"
                              >
                                <option value="Round Brilliant">Round Brilliant</option>
                                <option value="Princess">Princess</option>
                                <option value="Emerald">Emerald</option>
                                <option value="Oval">Oval</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                                Color
                              </label>
                              <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full rounded bg-[#4A0B13] border border-[#C2AA6A]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C2AA6A]"
                              >
                                <option value="D-F (Colorless)">D-F (Colorless)</option>
                                <option value="G-H (Near Colorless)">G-H (Near Colorless)</option>
                                <option value="I-J">I-J (Faint)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                                Clarity
                              </label>
                              <select
                                value={selectedClarity}
                                onChange={(e) => setSelectedClarity(e.target.value)}
                                className="w-full rounded bg-[#4A0B13] border border-[#C2AA6A]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C2AA6A]"
                              >
                                <option value="VVS1-VVS2">VVS1-VVS2</option>
                                <option value="VS1-VS2">VS1-VS2</option>
                                <option value="SI1">SI1</option>
                              </select>
                            </div>
                          </div>

                          {/* Origin Selector: Natural Earth-Mined vs Lab-Grown */}
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                              Diamond Origin
                            </label>
                            <select
                              value={selectedOrigin}
                              onChange={(e) => setSelectedOrigin(e.target.value)}
                              className="w-full rounded bg-[#4A0B13] border border-[#C2AA6A]/40 px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C2AA6A]"
                            >
                              <option value="Natural Earth-Mined">100% Natural Earth-Mined (IGI/GIA Certified)</option>
                              <option value="Lab-Grown">Lab-Grown (CVD / HPHT Synthetic)</option>
                            </select>
                          </div>
                        </div>

                        {/* Selected Specification Summary */}
                        <div className="rounded-lg bg-white/5 p-2.5 text-[11px] border border-white/10 text-white/80">
                          <span className="text-[#E4D4A7] font-semibold">Selected: </span>
                          <span>{selectedCarat}ct {selectedShape} • {selectedColor} • {selectedClarity} ({selectedOrigin})</span>
                        </div>

                        {/* Provider Status Announcement */}
                        <div className="rounded-lg bg-black/25 p-3 text-[11px] text-white/80 border border-white/10 space-y-1">
                          <p className="font-semibold text-amber-300">
                            Diamond pricing data is currently unavailable
                          </p>
                          <p className="text-[10px] leading-relaxed text-white/70">
                            Natural diamond trade benchmarks require an active Rapaport B2B trade subscription (<code className="text-[#E4D4A7]">RAPAPORT_CLIENT_ID</code>). Unlike gold bullion, diamond values depend strictly on individual laboratory 4Cs certification.
                          </p>
                        </div>

                        {/* CTA: Browse certified diamond solitaires */}
                        <Link
                          href="/categories/diamond"
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-[#C2AA6A]/50 bg-white/10 px-3 py-2 text-center text-xs font-semibold text-[#E4D4A7] transition-colors hover:bg-[#C2AA6A] hover:text-[#4A0B13]"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Explore IGI Certified Solitaires</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

