'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  Sparkles,
  RefreshCcw,
  PackageX,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search and filter states initialized from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialMetal = searchParams.get('metal') || 'all';
  const initialGender = searchParams.get('gender') || 'all';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialBridal = searchParams.get('isBridal') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [metal, setMetal] = useState(initialMetal);
  const [gender, setGender] = useState(initialGender);
  const [priceRange, setPriceRange] = useState(
    initialMinPrice || initialMaxPrice ? `${initialMinPrice}-${initialMaxPrice}` : 'all'
  );
  const [sort, setSort] = useState(initialSort);
  const [isBridal, setIsBridal] = useState(initialBridal === 'true');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'all');
    setMetal(searchParams.get('metal') || 'all');
    setGender(searchParams.get('gender') || 'all');
    const min = searchParams.get('minPrice') || '';
    const max = searchParams.get('maxPrice') || '';
    setPriceRange(min || max ? `${min}-${max}` : 'all');
    setSort(searchParams.get('sort') || 'newest');
    setIsBridal(searchParams.get('isBridal') === 'true');
  }, [searchParams]);

  // Parse price range
  const { minPrice, maxPrice } = useMemo(() => {
    if (priceRange === 'under-50000') return { minPrice: 0, maxPrice: 50000 };
    if (priceRange === '50000-100000') return { minPrice: 50000, maxPrice: 100000 };
    if (priceRange === '100000-200000') return { minPrice: 100000, maxPrice: 200000 };
    if (priceRange === 'above-200000') return { minPrice: 200000, maxPrice: 10000000 };
    if (priceRange.includes('-')) {
      const [min, max] = priceRange.split('-');
      return { minPrice: min || undefined, maxPrice: max || undefined };
    }
    return { minPrice: undefined, maxPrice: undefined };
  }, [priceRange]);

  // TanStack Query for products with active filters
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products-catalog', category, metal, gender, minPrice, maxPrice, search, sort, isBridal],
    queryFn: () =>
      api.getProducts({
        category: category !== 'all' ? category : undefined,
        metal: metal !== 'all' ? metal : undefined,
        gender: gender !== 'all' ? gender : undefined,
        minPrice,
        maxPrice,
        search: search.trim() || undefined,
        sort,
        isBridal: isBridal ? 'true' : undefined,
        limit: 40,
      }),
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;

  // Filter reset helper
  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setMetal('all');
    setGender('all');
    setPriceRange('all');
    setSort('newest');
    setIsBridal(false);
    router.push('/products');
  };

  const categoriesList = [
    { id: 'all', label: 'All Jewelry' },
    { id: 'Bridal', label: 'Bridal Sets' },
    { id: 'Diamond', label: 'Diamonds' },
    { id: 'Gold', label: '22K Gold' },
    { id: 'Necklaces', label: 'Necklaces & Chokers' },
    { id: 'Earrings', label: 'Earrings & Jhumkas' },
    { id: 'Rings', label: 'Solitaire & Gemstone Rings' },
    { id: 'Bangles', label: 'Kadas & Bangles' },
    { id: 'Gifts', label: 'Precious Keepsakes' },
  ];

  const gendersList = [
    { id: 'all', label: 'All Curations' },
    { id: 'women', label: 'Women Jewellery' },
    { id: 'men', label: 'Men Jewellery' },
    { id: 'kids', label: 'Kids Jewellery' },
  ];

  const metalsList = [
    { id: 'all', label: 'All Metals' },
    { id: '22K Yellow Gold', label: '22K Yellow Gold (916)' },
    { id: '18K Yellow Gold', label: '18K Yellow Gold (750)' },
    { id: '18K White Gold', label: '18K White Gold' },
    { id: '18K Rose Gold', label: '18K Rose Gold' },
  ];

  const priceTiers = [
    { id: 'all', label: 'All Price Ranges' },
    { id: 'under-50000', label: 'Under ₹50,000' },
    { id: '50000-100000', label: '₹50,000 to ₹1,00,000' },
    { id: '100000-200000', label: '₹1,00,000 to ₹2,00,000' },
    { id: 'above-200000', label: 'Above ₹2,00,000' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest Additions' },
    { id: 'bestseller', label: 'Bestselling First' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'rating', label: 'Customer Rating' },
  ];

  return (
    <div className="bg-ivory-50 min-h-screen pb-20">
      {/* Editorial Banner */}
      <div className="bg-[#F1ECE3] text-[#292923] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-[#8B1E2D] font-semibold mb-2">
            Rishi Lal Jewellers
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#292923]">
            Explore the Collection
          </h1>
          <div className="w-12 h-px bg-[#C2AA6A] mx-auto mt-3" />
          <p className="font-sans text-xs sm:text-sm text-[#716D64] mt-3 max-w-xl mx-auto">
            Find jewellery for celebrations, gifting and everyday wear.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gold-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-gold-300 rounded-sm text-xs font-sans uppercase tracking-wider font-medium text-emerald-950 flex items-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-700" />
              <span>Filters</span>
            </button>
            <p className="font-sans text-xs text-charcoal-600">
              Showing <span className="font-bold text-emerald-950">{products.length}</span> of {totalProducts} creations
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Live Search */}
            <div className="relative w-48 sm:w-64">
              <input
                type="text"
                placeholder="Search jewelry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950"
              />
              <Search className="w-3.5 h-3.5 text-gold-700 absolute left-2.5 top-2.5" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-2 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-gold-300 text-xs text-emerald-950 py-1.5 pl-3 pr-8 rounded-sm focus:outline-none focus:border-gold-600 font-sans cursor-pointer shadow-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gold-700 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-sm border border-gold-300/60 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <h3 className="font-serif text-base font-semibold text-emerald-950">
                  Refine Collection
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-sans text-gold-700 hover:text-emerald-950 flex items-center gap-1 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-serif text-sm font-medium text-emerald-950 mb-2.5">
                  Jewelry Category
                </h4>
                <div className="space-y-1.5">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-xs text-charcoal-700 hover:text-emerald-950 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat.id}
                        onChange={() => setCategory(cat.id)}
                        className="text-gold-600 focus:ring-gold-500 rounded-full"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender / Curation Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="font-serif text-sm font-medium text-emerald-950 mb-2.5">
                  Curated For
                </h4>
                <div className="space-y-1.5">
                  {gendersList.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 text-xs text-charcoal-700 hover:text-emerald-950 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g.id}
                        onChange={() => setGender(g.id)}
                        className="text-gold-600 focus:ring-gold-500 rounded-full"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal & Purity Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="font-serif text-sm font-medium text-emerald-950 mb-2.5">
                  Metal & Purity
                </h4>
                <div className="space-y-1.5">
                  {metalsList.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 text-xs text-charcoal-700 hover:text-emerald-950 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="metal"
                        checked={metal === m.id}
                        onChange={() => setMetal(m.id)}
                        className="text-gold-600 focus:ring-gold-500 rounded-full"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <h4 className="font-serif text-sm font-medium text-emerald-950 mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  {priceTiers.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-charcoal-700 hover:text-emerald-950 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="text-gold-600 focus:ring-gold-500 rounded-full"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bridal Special Checkbox */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="flex items-center gap-2 text-xs text-charcoal-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBridal}
                    onChange={(e) => setIsBridal(e.target.checked)}
                    className="text-gold-600 focus:ring-gold-500 rounded-xs"
                  />
                  <span>Royal Bridal Pavilion Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area (3 Columns on desktop) */}
          <main className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse bg-white rounded-sm border border-gold-200/50 aspect-[3/4]"
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="p-8 bg-white border border-red-200 rounded-sm text-center">
                <p className="text-sm text-red-700 mb-3">
                  Unable to load jewelry creations at this moment.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-emerald-950 text-gold-300 text-xs uppercase tracking-wider font-medium rounded-sm"
                >
                  Retry Request
                </button>
              </div>
            )}

            {/* Empty Results State */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="bg-white rounded-sm border border-gold-300/40 p-12 text-center max-w-md mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-ivory-100 flex items-center justify-center text-gold-700 mx-auto mb-4 border border-gold-300/40">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-medium text-emerald-950 mb-1">
                  No creations match your filter
                </h3>
                <p className="text-xs text-charcoal-600 mb-6">
                  Try adjusting your price range, metal purity, or search query.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-emerald-900 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 overflow-y-auto space-y-6 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-gold-200">
              <h3 className="font-serif text-lg font-semibold text-emerald-950">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-charcoal-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-emerald-950 mb-2">Category</h4>
              <div className="space-y-1.5">
                {categoriesList.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-xs text-charcoal-700">
                    <input
                      type="radio"
                      name="m-cat"
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="text-gold-600"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender / Curation */}
            <div className="pt-4 border-t border-ivory-200">
              <h4 className="font-serif text-sm font-semibold text-emerald-950 mb-2">Curated For</h4>
              <div className="space-y-1.5">
                {gendersList.map((g) => (
                  <label key={g.id} className="flex items-center gap-2 text-xs text-charcoal-700">
                    <input
                      type="radio"
                      name="m-gender"
                      checked={gender === g.id}
                      onChange={() => setGender(g.id)}
                      className="text-gold-600"
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metal */}
            <div className="pt-4 border-t border-ivory-200">
              <h4 className="font-serif text-sm font-semibold text-emerald-950 mb-2">Metal</h4>
              <div className="space-y-1.5">
                {metalsList.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-xs text-charcoal-700">
                    <input
                      type="radio"
                      name="m-metal"
                      checked={metal === m.id}
                      onChange={() => setMetal(m.id)}
                      className="text-gold-600"
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-ivory-200">
              <h4 className="font-serif text-sm font-semibold text-emerald-950 mb-2">Price Tier</h4>
              <div className="space-y-1.5">
                {priceTiers.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-xs text-charcoal-700">
                    <input
                      type="radio"
                      name="m-price"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                      className="text-gold-600"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gold-200 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-emerald-950 text-emerald-950 text-xs uppercase tracking-wider font-medium rounded-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 bg-emerald-950 text-gold-300 text-xs uppercase tracking-wider font-medium rounded-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Rishi Lal Collection...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}

