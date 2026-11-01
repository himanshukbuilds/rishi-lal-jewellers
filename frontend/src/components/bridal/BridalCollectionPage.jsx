'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gem, Sparkles } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import './bridal-collection.css';

const bridalCategories = [
  {
    title: 'Bridal Gold Necklaces',
    subtitle: 'Heirloom silhouettes',
    image: '/images/necklaces/ai-bridal-necklace.png',
    href: '/wedding/necklaces',
  },
  {
    title: 'Wedding Earrings',
    subtitle: 'Kundan & polki details',
    image: '/images/earrings/kundan-bridal-01.png',
    href: '/wedding/earrings',
  },
  {
    title: 'Bridal Bangles',
    subtitle: 'A touch of tradition',
    image: '/images/bangles/gold-bridal-bangles.png',
    href: '/wedding/bangles',
  },
  {
    title: 'Wedding Rings',
    subtitle: 'Made for the promise',
    image: '/images/rings/diamond-wedding-ring.png',
    href: '/wedding/rings',
  },
  {
    title: 'Maang Tikka',
    subtitle: 'A finishing heirloom',
    image: '/images/wedding/maang-tikka/traditional-kundan-maang-tikka.png',
    href: '/wedding/maang-tikka',
  },
  {
    title: 'Bridal Jewellery Sets',
    subtitle: 'A complete occasion edit',
    image: '/images/wedding/jewellery-sets/royal-kundan-bridal-jewellery-set.png',
    href: '/wedding/jewellery-sets',
  },
];

function CategoryCard({ item, index }) {
  return (
    <Link href={item.href} className="bridal-category-card group" style={{ '--card-delay': `${index * 90}ms` }}>
      <span className="bridal-category-image">
        <SafeImage
          src={item.image}
          alt={`${item.title} campaign concept`}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 16vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </span>
      <span className="bridal-category-copy">
        <span className="bridal-category-subtitle">{item.subtitle}</span>
        <span className="bridal-category-title">{item.title}</span>
        <span className="bridal-category-arrow" aria-hidden="true"><ArrowRight size={15} /></span>
      </span>
    </Link>
  );
}

export default function BridalCollectionPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wedding-collection-products'],
    queryFn: () => api.getProducts({ categorySlug: 'bridal', sort: 'newest', limit: 100 }),
  });
  const products = data?.products || [];
  const categoryCounts = bridalCategories.map((item) => ({ ...item, count: products.filter((product) => product.subcategory === item.title).length }));
  const featuredProducts = bridalCategories.map((item) => products.find((product) => product.subcategory === item.title)).filter(Boolean);

  return (
    <main className="bridal-page">
      <section className="bridal-hero" aria-labelledby="bridal-title">
        <div className="bridal-hero-glow" aria-hidden="true" />
        <div className="bridal-hero-ornament bridal-hero-ornament-one" aria-hidden="true" />
        <div className="bridal-hero-ornament bridal-hero-ornament-two" aria-hidden="true" />
        <div className="bridal-hero-photo" aria-hidden="true">
          <SafeImage
            src="/images/bridal/bridal-campaign-hero.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-[58%_center]"
          />
        </div>
        <div className="bridal-hero-shade" aria-hidden="true" />

        <div className="bridal-hero-inner">
          <div className="bridal-hero-copy">
            <div className="bridal-brand-mark" aria-label="Rishi Lal Jewellers">
              <span className="bridal-brand-emblem">RL</span>
              <span className="bridal-brand-name">Rishi Lal Jewellers</span>
              <span className="bridal-brand-tagline">Timeless elegance. Crafted for you.</span>
            </div>
            <div className="bridal-divider" aria-hidden="true"><span /><Gem size={13} /><span /></div>
            <p className="bridal-eyebrow">The art of forever</p>
            <h1 id="bridal-title" className="bridal-title">
              <span className="bridal-title-line bridal-title-ivory">Royal Wedding</span>
              <span className="bridal-title-line bridal-title-gold">Collection</span>
            </h1>
            <p className="bridal-description">
              Celebrate your forever with exquisite jewellery, timeless craftsmanship and unforgettable elegance.
            </p>
            <Link href="#bridal-collection" className="bridal-cta">
              <span>Explore the Collection</span><ArrowRight size={17} />
            </Link>
            <p className="bridal-image-note"><Sparkles size={12} /> Illustrative campaign image</p>
          </div>
        </div>
        <div className="bridal-hero-bottom-rule" aria-hidden="true"><span /></div>
      </section>

      <section className="bridal-categories" aria-labelledby="bridal-categories-title">
        <div className="bridal-section-heading">
          <p className="bridal-section-kicker">A celebration of craft</p>
          <h2 id="bridal-categories-title">A Bride&apos;s Timeless Treasures</h2>
          <span className="bridal-section-divider" aria-hidden="true" />
        </div>
        <div className="bridal-category-grid">
          {bridalCategories.map((item, index) => <CategoryCard key={item.title} item={item} index={index} />)}
        </div>
        <p className="bridal-concept-note">Campaign and category imagery is illustrative. Product details and availability are shown on each listing.</p>
      </section>

      <section className="bridal-explore-section" aria-labelledby="bridal-explore-title">
        <div className="bridal-section-heading">
          <p className="bridal-section-kicker">Six edits for the wedding day</p>
          <h2 id="bridal-explore-title">Explore Our Wedding Collection</h2>
          <span className="bridal-section-divider" aria-hidden="true" />
        </div>
        <div className="bridal-explore-grid">
          {categoryCounts.map((item) => <Link href={item.href} className="bridal-explore-card" key={item.title}>
            <span>{item.title}</span><small>{item.count} designs</small><ArrowRight size={16} aria-hidden="true" />
          </Link>)}
        </div>
      </section>

      <section className="bridal-featured-section" aria-labelledby="bridal-featured-title">
        <div className="bridal-products-heading"><div><p className="bridal-section-kicker">A considered edit</p><h2 id="bridal-featured-title">Curated for Your Special Day</h2></div></div>
        {!isLoading && featuredProducts.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {featuredProducts.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
        </div>}
      </section>

      <section id="bridal-collection" className="bridal-products-section" aria-labelledby="bridal-products-title">
        <div className="bridal-products-heading">
          <div>
            <p className="bridal-section-kicker">Made for your moment</p>
            <h2 id="bridal-products-title">Featured Wedding Collection</h2>
          </div>
          <Link href="/wedding/necklaces" className="bridal-view-all">View the collection <ArrowRight size={15} /></Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" aria-label="Loading wedding collection">
            {Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse border border-[#E6DFD3] bg-white" />)}
          </div>
        )}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
          </div>
        )}
        {!isLoading && products.length === 0 && (
          <div className="bridal-empty-state">
            <p>{isError ? 'The wedding collection could not be loaded right now.' : 'Wedding collection pieces are being curated.'}</p>
            <Link href="/wedding/necklaces">Browse bridal designs <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>
    </main>
  );
}
