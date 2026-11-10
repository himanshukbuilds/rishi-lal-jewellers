import React from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import ShopByGender from '@/components/home/ShopByGender';
import CategoryGrid from '@/components/home/CategoryGrid';
import DailyWearProducts from '@/components/dailywear/DailyWearProducts';
import LivePreciousMetalsPrices from '@/components/home/LivePreciousMetalsPrices';
import CollectionsShowcase from '@/components/home/CollectionsShowcase';
import FeaturedTabs from '@/components/home/FeaturedTabs';
import BridalShowcase from '@/components/home/BridalShowcase';
import BrandStory from '@/components/home/BrandStory';
import CraftsmanshipHeritage from '@/components/home/CraftsmanshipHeritage';
import GiftGuide from '@/components/home/GiftGuide';
import Testimonials from '@/components/home/Testimonials';
import VisitOurStoreSection from '@/components/store/VisitOurStoreSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TrustBar from '@/components/home/TrustBar';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroCarousel />
      <CategoryGrid />
      <DailyWearProducts showViewAll id="casual-daily-wear" />
      <LivePreciousMetalsPrices />
      <ShopByGender />
      <CollectionsShowcase />
      <FeaturedTabs />
      <BridalShowcase />
      <BrandStory />
      <GiftGuide />
      <CraftsmanshipHeritage />
      <Testimonials />
      <VisitOurStoreSection />
      <NewsletterSection />
      <TrustBar />
    </div>
  );
}
