'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';

const CATEGORIES = ['Necklace', 'Earrings', 'Rings', 'Bangles', 'Bracelets', 'Other'];
const METALS = ['Gold', 'Silver', 'Diamond', 'Rose Gold'];

function matchesMetal(product, metal) {
  if (metal === 'all') return true;
  const descriptor = `${product.metal || ''} ${product.name || ''} ${(product.tags || []).join(' ')}`;
  if (metal === 'Rose Gold') return /rose\s*gold/i.test(descriptor);
  return product.metalType === metal;
}

export default function DailyWearProducts({ showFilters = false, showViewAll = false, id, initialCategory = 'all' }) {
  const [category, setCategory] = useState(initialCategory);
  const [metal, setMetal] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['daily-wear-products'],
    queryFn: () => api.getProducts({ categorySlug: 'daily-wear', limit: 60 }),
    staleTime: 60_000,
  });

  const products = useMemo(() => {
    let list = [...(data?.products || [])];
    if (category !== 'all') list = list.filter((p) => (p.subcategory || '').toLowerCase() === category.toLowerCase());
    if (metal !== 'all') list = list.filter((p) => matchesMetal(p, metal));
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter((p) => [p.name, p.description, p.subcategory, p.metal, p.metalType, ...(p.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(term));
    }
    if (priceRange !== 'all') {
      const [min, max] = ({ under5000: [0, 5000], '5000-10000': [5000, 10000], '10000-20000': [10000, 20000], above20000: [20000, Infinity] })[priceRange];
      list = list.filter((p) => Number(p.price) >= min && Number(p.price) < max);
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  }, [data?.products, category, metal, priceRange, search, sort]);

  return (
    <section id={id} className="bg-[#FAF7F2] py-12 sm:py-16" aria-labelledby="daily-wear-products-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-7 flex flex-col gap-4 border-b border-[#E6DFD3] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#9B8050]">Comfortable, considered designs</p>
            <h2 id="daily-wear-products-heading" className="font-serif text-3xl text-[#17382D] sm:text-4xl">Everyday Elegance</h2>
            <p className="mt-2 max-w-xl text-sm text-[#716D64]">Discover lightweight jewellery designed to make every day special.</p>
          </div>
          {showViewAll && <Link href="/daily-wear" className="inline-flex w-fit border border-[#7D2934] px-5 py-3 text-[10px] uppercase tracking-[.18em] text-[#7D2934] transition-colors hover:bg-[#7D2934] hover:text-white">View All Daily Wear</Link>}
        </header>

        <p className="mb-5 border border-[#E6DFD3] bg-white/80 px-4 py-3 text-[10px] leading-5 text-[#716D64]">Indicative Catalogue Price — Final price subject to confirmed product specifications and quotation. All images are AI-generated illustrative concepts and do not represent confirmed stock.</p>

        {showFilters && <div className="mb-6 grid grid-cols-1 gap-3 rounded-sm border border-[#E6DFD3] bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">Category<select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"><option value="all">All categories</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">Metal<select value={metal} onChange={(e) => setMetal(e.target.value)} className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"><option value="all">All metals</option>{METALS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">Price<select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"><option value="all">All prices</option><option value="under5000">Under ₹5,000</option><option value="5000-10000">₹5,000 – ₹10,000</option><option value="10000-20000">₹10,000 – ₹20,000</option><option value="above20000">Above ₹20,000</option></select></label>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">Sort<select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 block w-full border border-[#D6CBB8] p-2 text-xs normal-case tracking-normal text-[#292923]"><option value="recommended">Recommended</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest</option></select></label>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#826D43]">Search<span className="relative mt-1 block"><Search className="absolute left-2 top-2 h-4 w-4 text-[#9B8050]"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jewellery" className="w-full border border-[#D6CBB8] py-2 pl-8 pr-2 text-xs normal-case tracking-normal text-[#292923]"/></span></label>
        </div>}

        {isLoading && <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: showFilters ? 8 : 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-[#EEE7DC]" />)}</div>}
        {isError && !isLoading && <p className="border border-[#E6DFD3] bg-white p-8 text-center text-sm text-[#716D64]">The Daily Wear collection is temporarily unavailable.</p>}
        {!isLoading && !isError && products.length > 0 && <>
          <p className="mb-4 text-xs text-[#716D64]">Showing {products.length} designs</p>
          <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
        </>}
        {!isLoading && !isError && products.length === 0 && <div className="border border-[#E6DFD3] bg-white p-10 text-center"><h3 className="font-serif text-xl text-[#17382D]">No designs found</h3><p className="mt-2 text-sm text-[#716D64]">Try another category, metal or search.</p><button type="button" onClick={() => { setCategory('all'); setMetal('all'); setPriceRange('all'); setSort('recommended'); setSearch(''); }} className="mt-4 text-xs uppercase tracking-wider text-[#7D2934] underline">Reset filters</button></div>}
      </div>
    </section>
  );
}
