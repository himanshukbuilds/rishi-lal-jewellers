'use client';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';

const collections={
  necklaces:{title:'Bridal Gold Necklaces',sub:'Heirloom forms for a royal celebration',image:'/images/wedding/necklaces/royal-kundan-bridal-necklace.png'},
  earrings:{title:'Wedding Earrings',sub:'Kundan, polki and timeless statement designs',image:'/images/wedding/earrings/traditional-kundan-jhumka-earrings.png'},
  bangles:{title:'Bridal Bangles',sub:'Ceremonial details in a considered edit',image:'/images/wedding/bangles/traditional-22k-bridal-gold-bangles.png'},
  rings:{title:'Wedding Rings',sub:'Symbols of a promise, styled for the occasion',image:'/images/wedding/rings/classic-bridal-diamond-ring.png'},
  'maang-tikka':{title:'Maang Tikka',sub:'A finishing touch for the bridal look',image:'/images/wedding/maang-tikka/traditional-kundan-maang-tikka.png'},
  'jewellery-sets':{title:'Bridal Jewellery Sets',sub:'A complete occasion edit',image:'/images/wedding/jewellery-sets/royal-kundan-bridal-jewellery-set.png'}
};
const prices=[['all','All prices'],['0-50000','Under ₹50,000'],['50000-100000','₹50,000–₹1,00,000'],['100000-200000','₹1,00,000–₹2,00,000'],['200000-500000','₹2,00,000–₹5,00,000'],['500000-plus','Above ₹5,00,000']];
export default function WeddingCategoryPage(){
 const {collection=''}=useParams(); const item=collections[collection];
 const [search,setSearch]=useState('');const [metal,setMetal]=useState('all');const [range,setRange]=useState('all');const [sort,setSort]=useState('newest');
 const query=useMemo(()=>{const p={categorySlug:'bridal',subcategory:item?.title,limit:100,sort};if(search.trim())p.search=search.trim();if(metal!=='all')p.metal=metal;if(range!=='all'){if(range==='0-50000'){p.minPrice=0;p.maxPriceExclusive=50000;}else if(range==='500000-plus')p.minPrice=500000;else{const [lo,hi]=range.split('-').map(Number);p.minPrice=lo;p.maxPriceExclusive=hi;}}return p;},[item?.title,search,metal,range,sort]);
 const {data,isLoading,isError}=useQuery({queryKey:['wedding-category',collection,query],queryFn:()=>api.getProducts(query),enabled:!!item});
 if(!item)return <main className="min-h-[50vh] p-12 text-center"><h1>Collection not found</h1><Link href="/wedding">Return to Wedding Collection</Link></main>;
 const products=data?.products||[];
 return <main className="min-h-screen bg-[#f8f1e6] text-[#3b0712]">
  <div className="relative mx-auto h-[270px] max-w-[1600px] overflow-hidden bg-[#3b0712] sm:h-[340px]">
   <SafeImage src={item.image} alt={`${item.title} concept image`} fill priority sizes="100vw" className="object-cover opacity-45"/>
   <div className="absolute inset-0 bg-gradient-to-r from-[#3b0712] via-[#3b0712]/80 to-transparent"/>
   <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-14"><Link href="/wedding" className="mb-5 flex items-center gap-2 text-sm text-[#f8f1e6]"><ArrowLeft size={16}/> Wedding Collection</Link><p className="text-xs uppercase tracking-[.24em] text-[#d6b36a]">A Bride&apos;s Timeless Treasures</p><h1 className="mt-2 font-serif text-4xl text-[#fffaf0] sm:text-6xl">{item.title}</h1><p className="mt-3 max-w-xl text-sm text-[#f8f1e6] sm:text-base">{item.sub}</p></div>
  </div>
  <section className="mx-auto max-w-[1480px] px-4 py-8 sm:px-8 sm:py-12">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl sm:text-3xl">{item.title}</h2><p className="mt-1 text-sm text-[#75695f]">{isLoading?'Loading designs…':`${data?.totalProducts??products.length} designs`}</p></div></div>
   <div className="mb-7 grid grid-cols-1 gap-3 rounded-sm border border-[#ddcfb8] bg-[#fffdf9] p-3 sm:grid-cols-4">
    <label className="relative"><Search size={16} className="absolute left-3 top-3 text-[#927a4c]"/><input aria-label="Search wedding designs" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search designs" className="w-full border border-[#e6dfd3] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#aa8540]"/></label>
    <select aria-label="Filter by metal" value={metal} onChange={e=>setMetal(e.target.value)} className="border border-[#e6dfd3] bg-white px-3 py-2.5 text-sm"><option value="all">All metals</option><option>Gold</option><option>Diamond</option><option>Silver</option></select>
    <select aria-label="Filter by price" value={range} onChange={e=>setRange(e.target.value)} className="border border-[#e6dfd3] bg-white px-3 py-2.5 text-sm">{prices.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
    <select aria-label="Sort designs" value={sort} onChange={e=>setSort(e.target.value)} className="border border-[#e6dfd3] bg-white px-3 py-2.5 text-sm"><option value="newest">Recommended</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select>
   </div>
   {isLoading&&<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-[3/4] animate-pulse bg-white"/>)}</div>}
   {!isLoading&&products.length>0&&<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map(product=><ProductCard key={product._id||product.slug} product={product}/>)}</div>}
   {!isLoading&&products.length===0&&<div className="border border-[#ddcfb8] bg-white px-6 py-16 text-center"><h3 className="font-serif text-2xl">No designs match these filters</h3><p className="mt-2 text-sm text-[#75695f]">Try a different search or clear the selected filters.</p><button onClick={()=>{setSearch('');setMetal('all');setRange('all');setSort('newest')}} className="mt-5 border border-[#aa8540] px-5 py-2 text-xs uppercase tracking-widest">Reset filters</button></div>}
   {isError&&<p role="alert" className="mt-5 text-center text-sm text-red-800">We could not load this collection. Please refresh and try again.</p>}
  </section>
 </main>
}
