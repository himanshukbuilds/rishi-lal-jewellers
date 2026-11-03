'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api } from '@/services/api';
import ProductCard from '@/components/product/ProductCard';

const ranges = [
  { label: 'Under ₹50,000', maxPriceExclusive: 50000 },
  { label: '₹50,000 – ₹1,00,000', minPrice: 50000, maxPriceExclusive: 100000 },
  { label: '₹1,00,000 – ₹2,00,000', minPrice: 100000, maxPriceExclusive: 200000 },
  { label: '₹2,00,000 – ₹5,00,000', minPrice: 200000, maxPriceExclusive: 500000 },
  { label: 'Above ₹5,00,000', minPrice: 500000 },
];
const styles = ['Bridal', 'Traditional', 'Daily Wear', 'Party Wear', 'Temple', 'Lightweight', 'Modern'];
export default function NecklacesLandingPage() {
  const [metal, setMetal] = useState('all');
  const [purity, setPurity] = useState('all');
  const [weightClass, setWeightClass] = useState('all');
  const [style, setStyle] = useState('all');
  const [rangeIndex, setRangeIndex] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedMetal = params.get('metal');
    const selectedStyle = params.get('style') || params.get('subcategory');
    if (['Gold', 'Diamond', 'Silver'].includes(selectedMetal)) setMetal(selectedMetal);
    if (styles.includes(selectedStyle)) setStyle(selectedStyle);
  }, []);
  const range = rangeIndex === 'all' ? {} : ranges[Number(rangeIndex)];
  const params = useMemo(() => ({
    categorySlug: 'necklaces', limit: 100, metal: metal === 'all' ? undefined : metal,
    purity: purity === 'all' ? undefined : purity,
    weightClass: weightClass === 'all' ? undefined : weightClass,
    subcategory: style === 'all' ? undefined : style,
    search: search.trim() || undefined,
    sort: sort === 'price-low' ? 'price_asc' : sort === 'price-high' ? 'price_desc' : sort === 'new' ? 'newest' : 'bestseller',
    ...range,
  }), [metal, purity, weightClass, style, search, sort, range]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['necklaces-collection', params],
    queryFn: () => api.getProducts(params),
  });
  const products = data?.products || [];
  const reset = () => { setMetal('all'); setPurity('all'); setWeightClass('all'); setStyle('all'); setRangeIndex('all'); setSearch(''); setSort('recommended'); };

  return <main className="min-h-screen bg-[#FAF8F3] text-[#17382D]">
    <section className="relative min-h-[390px] overflow-hidden bg-[#17382D] text-[#F8F3E8] sm:min-h-[470px]">
      <Image src="/images/necklaces/model-clean.png" alt="Rishi Lal Jewellers necklace collection" fill priority sizes="100vw" className="object-cover object-center opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#10271F]/95 via-[#10271F]/75 to-[#10271F]/10" />
      <div className="relative mx-auto flex min-h-[390px] max-w-7xl items-center px-5 py-16 sm:min-h-[470px] sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[.3em] text-[#D5BC7A]">Rishi Lal Jewellers · Fine Craftsmanship</p>
          <h1 className="font-serif text-5xl leading-[1.04] sm:text-7xl">Necklaces, <span className="italic text-[#E4D2A2]">made memorable.</span></h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/80 sm:text-base">Explore gold, diamond and silver designs shaped for celebrations, rituals and the everyday moments that become heirlooms.</p>
          <a href="#collection" className="mt-8 inline-flex items-center gap-3 border border-[#D5BC7A] px-6 py-3 text-xs uppercase tracking-[.18em] transition-colors hover:bg-[#D5BC7A] hover:text-[#17382D]">Explore the collection <ArrowRight size={15} /></a>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-12" id="collection">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-[11px] uppercase tracking-[.25em] text-[#9B8050]">The necklace edit</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">Find your forever piece</h2></div>
        <label className="flex w-full items-center gap-2 border-b border-[#C9C0AE] py-2 sm:w-64"><Search size={16} className="text-[#9B8050]"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search necklaces" className="w-full bg-transparent text-sm outline-none placeholder:text-[#8C8A82]" /></label>
      </div>

      <div className="mb-8 rounded-sm border border-[#E5DFD2] bg-white/70 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[.16em] text-[#53685D]"><SlidersHorizontal size={15}/> Refine your selection</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <FilterSelect label="Metal" value={metal} onChange={setMetal} options={['all','Gold','Diamond','Silver']} />
          <FilterSelect label="Gold purity" value={purity} onChange={setPurity} options={['all','18K','22K','24K']} />
          <FilterSelect label="Weight" value={weightClass} onChange={setWeightClass} options={['all','Lightweight','Medium','Heavy']} />
          <FilterSelect label="Style" value={style} onChange={setStyle} options={['all',...styles]} />
          <label className="text-[10px] uppercase tracking-widest text-[#758076]">Price range<select value={rangeIndex} onChange={e=>setRangeIndex(e.target.value)} className="mt-1 block w-full border border-[#DED8CB] bg-[#FAF8F3] px-2 py-2.5 text-xs normal-case tracking-normal text-[#17382D]"><option value="all">All prices</option>{ranges.map((r,i)=><option key={r.label} value={i}>{r.label}</option>)}</select></label>
          <label className="text-[10px] uppercase tracking-widest text-[#758076]">Sort by<select value={sort} onChange={e=>setSort(e.target.value)} className="mt-1 block w-full border border-[#DED8CB] bg-[#FAF8F3] px-2 py-2.5 text-xs normal-case tracking-normal text-[#17382D]"><option value="recommended">Recommended</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="new">New Arrivals</option></select></label>
          <button onClick={reset} className="self-end px-3 py-2.5 text-xs text-[#66776C] underline underline-offset-4">Reset filters</button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between"><p className="text-sm text-[#68736A]">{isLoading ? 'Finding your pieces…' : `${data?.totalProducts ?? products.length} necklaces`}</p><p className="hidden items-center gap-1 text-[11px] text-[#8D7950] sm:flex"><Sparkles size={13}/> Thoughtfully selected designs</p></div>
      {isError ? <div className="border border-[#E5DFD2] bg-white p-10 text-center"><h3 className="font-serif text-2xl">Collection is temporarily unavailable</h3><p className="mt-2 text-sm text-[#68736A]">Please try again in a little while.</p></div> : isLoading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-[.78] animate-pulse bg-[#E9E4D9]" />)}</div> : products.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
        {products.map(product=><ProductCard key={product._id || product.slug} product={product} />)}
      </div> : <div className="border border-[#E5DFD2] bg-white px-6 py-16 text-center"><h3 className="font-serif text-2xl">No necklaces match these filters</h3><p className="mt-2 text-sm text-[#68736A]">Try adjusting your selection to discover more designs.</p><button onClick={reset} className="mt-5 border border-[#B8AA8C] px-5 py-2 text-xs uppercase tracking-widest">Clear filters</button></div>}
    </section>
  </main>;
}

function FilterSelect({label,value,onChange,options}) { return <label className="text-[10px] uppercase tracking-widest text-[#758076]">{label}<select value={value} onChange={e=>onChange(e.target.value)} className="mt-1 block w-full border border-[#DED8CB] bg-[#FAF8F3] px-2 py-2.5 text-xs normal-case tracking-normal text-[#17382D]">{options.map((option,i)=><option key={option} value={option}>{i===0?'All':option}</option>)}</select></label>; }
