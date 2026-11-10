'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
  Crown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RISHI LAL JEWELLERS - THE WEDDING BOOK COLLECTION
 * 7 Approved Haute Joaillerie Bridal Traditions
 *
 * Each tradition is presented using its original high-resolution assets:
 * - Rajasthani: 1456x820 approved 16:9 banner
 * - Punjabi:    1456x820 approved 16:9 banner
 * - Marathi:    1200x1254 original model portrait (Kolhapuri saaj, thushi, nath)
 * - Bengali:    1374x1145 original model portrait (mukut, filigree choker, pola)
 * - Telugu:     1200x1169 original model portrait (guttapusalu, temple gold)
 * - Tamil:      1800x2700 original model portrait (Lakshmi haram, kemp, nethi chutti)
 * - Metro:      1800x1200 original model portrait (natural diamond solitaire suite)
 * ═══════════════════════════════════════════════════════════════════════════
 */
const BRIDAL_TRADITIONS = [
  {
    id: 'rajasthani',
    index: 0,
    title: 'Rajasthani Bride',
    shortTitle: 'RAJASTHANI',
    tagline: 'Royal Grandeur & Heritage',
    pageUrl: '/wedding/rajasthani',
    badge: 'Tradition I · Rajputana Heritage',
    description:
      'Masterfully hand-forged 22KT Rajputana Kundan chokers, royal Aad collars, borla maang tikkas, meenakari kadas, and imperial hathphool crafted for royal celebrations.',
    isBanner: true,
    bannerImage: '/images/wedding/rajasthani_bride_banner.png',
    heroImage: '/images/wedding/models/rajasthani.jpg',
    imagePosition: 'center 15%',
    cardImage: '/images/wedding/approved_cards/rajasthani.png',
    polaroids: [
      { label: 'Haldi', image: '/images/wedding/jewellery-sets/traditional-rajasthani-bridal-set.png', rotation: '-rotate-3' },
      { label: 'Mehendi', image: '/images/wedding/bangles/traditional-meenakari-bangles.png', rotation: 'rotate-2' },
      { label: 'Phera', image: '/images/wedding/necklaces/polki-bridal-choker-necklace.png', rotation: '-rotate-1' },
    ],
    keywords: ['kundan', 'polki', 'aad', 'borla', 'choker', 'rajasthani', 'bridal'],
  },
  {
    id: 'punjabi',
    index: 1,
    title: 'Punjabi Bride',
    shortTitle: 'PUNJABI',
    tagline: 'Vibrant Traditions & Timeless Elegance',
    pageUrl: '/wedding/punjabi',
    badge: 'Tradition II · Punjab Royal Celebrations',
    description:
      'A joyous symphony of timeless opulence. Regal Syndicate polki rani haars, majestic chandelier jhumkis, side passas, and ceremonial bridal choodas.',
    isBanner: true,
    bannerImage: '/images/wedding/punjabi_bride_banner.png',
    heroImage: '/images/wedding/models/punjabi.jpg',
    imagePosition: 'center 15%',
    cardImage: '/images/wedding/approved_cards/punjabi.png',
    polaroids: [
      { label: 'Jaggo', image: '/images/wedding/earrings/royal-polki-chandbali-earrings.png', rotation: '-rotate-2' },
      { label: 'Chooda', image: '/images/wedding/bangles/heavy-wedding-gold-chooda.png', rotation: 'rotate-2' },
      { label: 'Anand Karaj', image: '/images/wedding/necklaces/heavy-rani-haar-necklace.png', rotation: '-rotate-1' },
    ],
    keywords: ['polki', 'chooda', 'rani haar', 'jhumki', 'passa', 'punjabi', 'bridal'],
  },
  {
    id: 'marathi',
    index: 2,
    title: 'Marathi Bride',
    shortTitle: 'MARATHI',
    tagline: 'Grace in Maharashtrian Tradition',
    pageUrl: '/wedding/marathi',
    badge: 'Tradition III · Peshwai & Maratha Heritage',
    description:
      'The venerated Kolhapuri saaj of 21 leaf tokens, tight-fitting thushi choker, pearl Brahmani moti nath, and traditional pichodi bangles crafted for the sacred Maharashtrian Lagna.',
    isBanner: false,
    heroImage: '/images/wedding/models/marathi_hd.png',
    imagePosition: 'center 18%',
    cardImage: '/images/wedding/approved_cards/marathi.png',
    polaroids: [
      { label: 'Haldi', image: '/images/wedding/book/polaroid-haldi.png', rotation: '-rotate-3' },
      { label: 'Mehendi', image: '/images/wedding/book/polaroid-mehendi.png', rotation: 'rotate-2' },
      { label: 'Lagna', image: '/images/wedding/book/polaroid-reception.png', rotation: '-rotate-1' },
    ],
    keywords: ['thushi', 'kolhapuri', 'nath', 'saaj', 'marathi', 'bridal'],
  },
  {
    id: 'bengali',
    index: 3,
    title: 'Bengali Bride',
    shortTitle: 'BENGALI',
    tagline: 'Sacred Rituals & Classic Beauty',
    pageUrl: '/wedding/bengali',
    badge: 'Tradition IV · Bengal Aristocracy',
    description:
      'A poetic tribute to delicate filigree and Zamindari splendour. Hand-drawn gold tarakasi chik chokers, multilayered sita haars, peacock kaan pashas, and gold-encased pola bandha bracelets.',
    isBanner: false,
    heroImage: '/images/wedding/models/bengali.jpg',
    imagePosition: 'center 20%',
    cardImage: '/images/wedding/approved_cards/bengali.png',
    polaroids: [
      { label: 'Gaye Holud', image: '/images/wedding/maang-tikka/traditional-kundan-maang-tikka.png', rotation: '-rotate-2' },
      { label: 'Saat Paak', image: '/images/wedding/necklaces/layered-heritage-gold-necklace.png', rotation: 'rotate-1' },
      { label: 'Bou Bhaat', image: '/images/wedding/jewellery-sets/grand-polki-wedding-jewellery-set.png', rotation: '-rotate-2' },
    ],
    keywords: ['loha', 'shankha', 'bengali', 'bridal', 'gold necklace', 'choker'],
  },
  {
    id: 'telugu',
    index: 4,
    title: 'Telugu Bride',
    shortTitle: 'TELUGU',
    tagline: 'Rich Heritage of the South',
    pageUrl: '/wedding/telugu',
    badge: 'Tradition V · Deccan Temple Artistry',
    description:
      'Breathtaking Deccan temple artistry celebrating the sacred Telugu Pelli. Exquisite cascading guttapusalu pearl collars, heavy antique kasu malais, sculpted gold vaddanam waistbelts, and Lakshmi nakshi jhumkas.',
    isBanner: false,
    heroImage: '/images/wedding/models/telugu.jpg',
    imagePosition: 'center 18%',
    cardImage: '/images/wedding/approved_cards/telugu.png',
    polaroids: [
      { label: 'Pelli Kooturu', image: '/images/wedding/necklaces/traditional-lakshmi-gold-necklace.png', rotation: '-rotate-3' },
      { label: 'Mangalasutram', image: '/images/wedding/necklaces/south-indian-bridal-necklace.png', rotation: 'rotate-2' },
      { label: 'Reception', image: '/images/wedding/jewellery-sets/traditional-south-indian-bridal-set.png', rotation: '-rotate-1' },
    ],
    keywords: ['temple', 'vaddanam', 'long chain', 'telugu', 'bridal', 'south'],
  },
  {
    id: 'tamil',
    index: 5,
    title: 'Tamil Bride',
    shortTitle: 'TAMIL',
    tagline: 'Grace of Tradition, Beauty of Heritage',
    pageUrl: '/wedding/tamil',
    badge: 'Tradition VI · Chola & Dravidian Mastery',
    description:
      'Sacred Chola temple mastery sculpted in 22KT hallmark gold. The divine Lakshmi haram, Kemp-studded manga malai mango necklace, sacred nethi chutti forehead adornment, and traditional ottiyanam waistbands.',
    isBanner: false,
    heroImage: '/images/wedding/tamil_bride_hero.jpg',
    imagePosition: '68% 28%',
    cardImage: '/images/wedding/approved_cards/tamil.png',
    polaroids: [
      { label: 'Nalangu', image: '/images/wedding/earrings/antique-temple-gold-earrings.png', rotation: '-rotate-2' },
      { label: 'Muhurtham', image: '/images/wedding/necklaces/traditional-lakshmi-gold-necklace.png', rotation: 'rotate-2' },
      { label: 'Reception', image: '/images/wedding/jewellery-sets/antique-temple-jewellery-set.png', rotation: '-rotate-1' },
    ],
    keywords: ['temple', 'kasu mala', 'jimikki', 'tamil', 'bridal', 'lakshmi'],
  },
  {
    id: 'metro',
    index: 6,
    title: 'Metro Bride',
    shortTitle: 'METRO',
    tagline: 'Modern Elegance, Timeless Beauty',
    pageUrl: '/wedding/metro',
    badge: 'Tradition VII · Contemporary Haute Joaillerie',
    description:
      'For the cosmopolitan bride whose elegance transcends conventions. Fluid certified VVS-EF natural solitaire diamond collars, Colombian emerald accents, and architectural rose gold cascades.',
    isBanner: false,
    heroImage: '/images/wedding/metro_bride_hero.jpg',
    imagePosition: '52% 24%',
    cardImage: '/images/wedding/approved_cards/metro.png',
    polaroids: [
      { label: 'Cocktail', image: '/images/wedding/earrings/bridal-diamond-drop-earrings.png', rotation: '-rotate-2' },
      { label: 'Sangeet', image: '/images/wedding/rings/classic-bridal-diamond-ring.png', rotation: 'rotate-1' },
      { label: 'Reception', image: '/images/wedding/jewellery-sets/diamond-bridal-jewellery-set.png', rotation: '-rotate-2' },
    ],
    keywords: ['diamond', 'solitaire', 'platinum', 'modern', 'metro', 'bridal'],
  },
];

const CATEGORIES = [
  { id: 'all', title: 'All Bridal Heirlooms' },
  { id: 'necklaces', title: 'Bridal Gold Necklaces' },
  { id: 'earrings', title: 'Wedding Earrings' },
  { id: 'bangles', title: 'Bridal Bangles' },
  { id: 'rings', title: 'Wedding Rings' },
  { id: 'maang-tikka', title: 'Maang Tikka' },
  { id: 'jewellery-sets', title: 'Bridal Jewellery Sets' },
];

export default function WeddingBookExperience() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [previousIndex, setPreviousIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const totalTraditions = BRIDAL_TRADITIONS.length;
  const currentBride = BRIDAL_TRADITIONS[activeIndex];

  // Fetch bridal products from backend
  const { data, isLoading } = useQuery({
    queryKey: ['wedding-products-active', currentBride.id],
    queryFn: () => api.getProducts({ categorySlug: 'bridal', limit: 100, sort: 'newest' }),
  });

  const allProducts = data?.products || [];

  // Filter products for active bridal tradition
  const filteredProducts = React.useMemo(() => {
    let list = allProducts;
    if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
      if (catObj) {
        list = list.filter(
          (p) => p.subcategory === catObj.title || p.categorySlug === selectedCategory
        );
      }
    }
    const keywords = currentBride.keywords;
    const matched = list.filter((p) => {
      const text = `${p.name} ${p.description || ''} ${(p.tags || []).join(' ')} ${
        p.subcategory || ''
      }`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    if (matched.length >= 6) return matched;
    const others = list.filter((p) => !matched.some((m) => m._id === p._id));
    return [...matched, ...others];
  }, [allProducts, selectedCategory, currentBride]);

  // Switch between bridal traditions smoothly with transition guard
  const goToSlide = useCallback(
    (newIndex) => {
      if (newIndex === activeIndex || isTransitioning) return;
      setPreviousIndex(activeIndex);
      setFlipDirection(newIndex > activeIndex ? 'next' : 'prev');
      setIsTransitioning(true);
      setActiveIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [activeIndex, isTransitioning]
  );

  const handleNext = useCallback(() => {
    goToSlide((activeIndex + 1) % totalTraditions);
  }, [activeIndex, goToSlide, totalTraditions]);

  const handlePrev = useCallback(() => {
    goToSlide((activeIndex - 1 + totalTraditions) % totalTraditions);
  }, [activeIndex, goToSlide, totalTraditions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Open full-screen dedicated page
  const handleOpenCurrentCollection = () => {
    router.push(currentBride.pageUrl);
  };

  return (
    <main className="w-full min-h-screen bg-[#FBF8F2] text-[#3B0712] selection:bg-[#C2AA6A] selection:text-[#3B0712] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: THE GRAND WEDDING BOOK EXPERIENCE
          Matches Tanishq Rivaah "Explore the Traditions" Layout Exactly
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full pt-6 sm:pt-10 pb-12 sm:pb-16 px-3 sm:px-6 md:px-8 xl:px-12 bg-[#F9F6F0] overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 25%, #FCFAF5 0%, #F7F2E8 60%, #ECE4D4 100%)',
        }}
        aria-label="The Wedding Book Collection"
      >
        {/* Soft Background Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-10 left-8 w-4 h-3 bg-[#C23B50]/30 rounded-full rotate-45 blur-[0.5px]" />
          <div className="absolute top-24 left-1/4 w-3 h-2 bg-[#8B1E2D]/25 rounded-full -rotate-12 blur-[0.5px]" />
          <div className="absolute top-16 right-16 w-4 h-2.5 bg-[#A31D24]/30 rounded-full rotate-30 blur-[0.5px]" />
          <div className="absolute bottom-12 right-1/4 w-3.5 h-2 bg-[#C23B50]/25 rounded-full -rotate-45 blur-[0.5px]" />
        </div>

        {/* Section Header: EXPLORE THE TRADITIONS */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#540D1D] tracking-[0.08em] uppercase">
            Explore the Traditions
          </h1>
          {/* Subtle gold flourish divider */}
          <div className="mt-2.5 flex items-center justify-center gap-3">
            <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C2AA6A]" />
            <span className="text-[#C2AA6A] text-xs">✦</span>
            <span className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C2AA6A]" />
          </div>
          <p className="mt-2 text-xs sm:text-sm font-sans text-[#7A6355]">
            Discover the handcrafted heritage of regional Indian bridal jewellery by Rishi Lal Jewellers.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            THE ALBUM CONTAINER: MAIN SPREAD + LAYERED SIDE CARDS
            Balanced Desktop Dimensions (fits comfortably on 768px - 1080px screens)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 max-w-[1560px] mx-auto w-full">
          {/* Flex Row: Main Open Book (72%) + Layered Side Cards (28%) */}
          <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 min-h-[460px] sm:min-h-[520px] lg:min-h-[540px] xl:min-h-[570px] max-h-[620px]">
            {/* ──────────────────────────────────────────────────
                LEFT / MAIN: ACTIVE BRIDAL STORYBOOK (~72% width)
                Renders either 16:9 complete banner (Rajasthani/Punjabi)
                or Tanishq-style open book (Metro/Tamil/Telugu/Marathi/Bengali)
            ────────────────────────────────────────────────── */}
            <div
              className={`
                relative flex-1 lg:w-[72%] rounded-2xl sm:rounded-3xl overflow-hidden
                bg-[#FAF7F2] border border-[#C2AA6A]/45 shadow-[0_25px_60px_-15px_rgba(50,10,20,0.28)]
                transition-all duration-500
              `}
              style={{
                boxShadow:
                  '0 25px 65px -20px rgba(50,10,20,0.3), 0 10px 25px -10px rgba(194,170,106,0.18)',
              }}
            >
              {/* Inner Double Filigree Gold Border & Corner Cross Stars */}
              <div className="absolute inset-2 sm:inset-3 pointer-events-none border border-[#C2AA6A]/35 rounded-xl sm:rounded-2xl z-20">
                <span className="absolute -top-1.5 -left-1.5 text-xs text-[#C2AA6A]">✦</span>
                <span className="absolute -top-1.5 -right-1.5 text-xs text-[#C2AA6A]">✦</span>
                <span className="absolute -bottom-1.5 -left-1.5 text-xs text-[#C2AA6A]">✦</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-xs text-[#C2AA6A]">✦</span>
              </div>

              {/* Left Spine Shadow */}
              <div className="absolute top-0 left-0 bottom-0 w-6 sm:w-10 z-20 pointer-events-none bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

              {/* ──────────────────────────────────────────────
                  CONTENT: Conditional on isBanner
              ────────────────────────────────────────────── */}
              {currentBride.isBanner ? (
                /* Pre-baked High-Resolution 16:9 Banner (Rajasthani / Punjabi) */
                <div
                  onClick={handleOpenCurrentCollection}
                  className="group relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px] cursor-pointer overflow-hidden"
                  title={`Click to open dedicated ${currentBride.title} collection`}
                >
                  <SafeImage
                    src={currentBride.bannerImage}
                    alt={`${currentBride.title} - Rishi Lal Jewellers`}
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 1440px) 100vw, 1440px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-30">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C2AA6A]/60 text-[#F8F5EF] text-[10px] sm:text-xs font-sans tracking-widest uppercase">
                      <Crown className="w-3.5 h-3.5 text-[#C2AA6A]" />
                      <span>{currentBride.badge}</span>
                    </div>
                  </div>

                  {/* Floating Action Button */}
                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-30">
                    <button
                      type="button"
                      className="
                        inline-flex items-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3 rounded-full
                        bg-[#540D1D]/95 hover:bg-[#540D1D] text-[#F8F5EF]
                        border border-[#C2AA6A] shadow-[0_8px_25px_rgba(0,0,0,0.45)]
                        backdrop-blur-md text-[10px] sm:text-xs md:text-sm font-sans tracking-widest uppercase font-semibold
                        transition-all duration-300 group-hover:scale-105 active:scale-95 cursor-pointer
                      "
                    >
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C2AA6A]" />
                      <span>Open {currentBride.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C2AA6A] transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ──────────────────────────────────────────────
                   OPEN BOOK DESIGN: METRO / TAMIL / TELUGU / MARATHI / BENGALI
                   Matches Tanishq Rivaah Reference Screenshot Exactly!
                   Editorial Column (Left) + High-Res Model Portrait (Right)
                ────────────────────────────────────────────── */
                <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px] flex flex-col md:flex-row items-stretch justify-between bg-[#FAF7F2] overflow-hidden">
                  {/* LEFT EDITORIAL COLUMN (~48% width on desktop) */}
                  <div className="relative z-10 w-full md:w-[48%] lg:w-[45%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      {/* Top Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#C2AA6A]/50 text-[#8B1E2D] text-[10px] font-sans tracking-widest uppercase font-semibold mb-4 sm:mb-6 shadow-xs">
                        <Crown className="w-3 h-3 text-[#C2AA6A]" />
                        <span>{currentBride.badge}</span>
                      </div>

                      {/* Large Luxury Serif Title: e.g. "METRO BRIDE" */}
                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-[#4A0B13] tracking-tight leading-[1.05] uppercase">
                        <span>{currentBride.shortTitle}</span>
                        <br />
                        <span className="text-[#3B0712]/90">BRIDE</span>
                      </h2>

                      {/* Subtitle / Tagline */}
                      <p className="mt-2.5 sm:mt-3.5 font-serif italic text-sm sm:text-base lg:text-lg text-[#7A6355]">
                        &ldquo;{currentBride.tagline}&rdquo;
                      </p>

                      {/* EXPLORE Pill Button */}
                      <div className="mt-4 sm:mt-6">
                        <button
                          type="button"
                          onClick={handleOpenCurrentCollection}
                          className="
                            inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
                            bg-[#540D1D] hover:bg-[#6E1126] text-[#F8F5EF]
                            border border-[#C2AA6A]/80 shadow-[0_6px_20px_rgba(84,13,29,0.35)]
                            text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-semibold
                            transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer
                          "
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C2AA6A]" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom: 3 Ceremonial Polaroids (from Reference Screenshot) */}
                    <div className="mt-6 pt-4 border-t border-[#C2AA6A]/25 hidden sm:flex items-center gap-3">
                      {currentBride.polaroids.map((pol, pIdx) => (
                        <div
                          key={pIdx}
                          className={`
                            relative bg-white p-1 rounded shadow-md border border-[#C2AA6A]/30
                            transition-transform hover:scale-110 hover:z-20 cursor-pointer
                            ${pol.rotation || ''}
                          `}
                          style={{ width: '64px' }}
                          title={pol.label}
                        >
                          <div className="relative w-full h-[54px] bg-[#240307] rounded-xs overflow-hidden">
                            <SafeImage
                              src={pol.image}
                              alt={pol.label}
                              fill
                              quality={85}
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[9px] font-serif text-center text-[#540D1D] mt-1 truncate">
                            {pol.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT PHOTO COLUMN (~52% width on desktop)
                      Renders the High-Resolution Model Portrait Crisp & Uncropped! */}
                  <div
                    onClick={handleOpenCurrentCollection}
                    className="relative w-full md:w-[52%] lg:w-[55%] min-h-[300px] sm:min-h-[400px] md:min-h-full cursor-pointer overflow-hidden bg-[#F5EFEB]"
                  >
                    <SafeImage
                      src={currentBride.heroImage}
                      alt={`${currentBride.title} Model - Rishi Lal Jewellers`}
                      fill
                      priority
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.01]"
                      style={{
                        objectPosition: currentBride.imagePosition || 'center top',
                      }}
                    />

                    {/* Soft Feather Gradient at Left Edge Blending into Ivory Page */}
                    <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/50 to-transparent pointer-events-none hidden md:block" />

                    {/* Subtle vignette at top and bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* ──────────────────────────────────────────────────
                RIGHT: LAYERED BRIDAL CARDS (~28% width)
                Matches the fanned book leaves from the reference design!
                Shows the other traditions with vertical bookmarks
            ────────────────────────────────────────────────── */}
            <div
              className="
                relative flex-shrink-0 w-full lg:w-[28%]
                bg-[#F4ECE0] p-3 sm:p-4 rounded-2xl sm:rounded-3xl
                border border-[#C2AA6A]/45 shadow-lg
                flex flex-col justify-between overflow-hidden
              "
              style={{
                background:
                  'linear-gradient(to bottom, rgba(235,223,205,0.95) 0%, rgba(246,240,230,0.98) 50%, #FAF7F2 100%)',
              }}
            >
              {/* Header */}
              <div className="mb-2.5 flex items-center justify-between pb-2 border-b border-[#C2AA6A]/30 px-1">
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8B1E2D] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C2AA6A]" />
                  <span>Bridal Traditions</span>
                </span>
                <span className="font-serif text-xs font-bold text-[#C2AA6A]">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(totalTraditions).padStart(2, '0')}
                </span>
              </div>

              {/* Desktop: Vertical Stacked Leaf Cards */}
              <div className="hidden lg:flex lg:flex-col gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C2AA6A]/40 scrollbar-track-transparent pr-0.5">
                {BRIDAL_TRADITIONS.map((bride, idx) => {
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={bride.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      disabled={isTransitioning}
                      className={`
                        group relative w-full flex flex-row items-stretch rounded-xl overflow-hidden
                        transition-all duration-300 cursor-pointer text-left
                        ${
                          isActive
                            ? 'ring-2 ring-[#C2AA6A] shadow-[0_0_18px_rgba(194,170,106,0.65)] bg-white border-transparent scale-[1.01]'
                            : 'border border-[#C2AA6A]/35 hover:border-[#8B1E2D]/60 hover:shadow-md bg-white/70 hover:bg-white opacity-85 hover:opacity-100'
                        }
                      `}
                      style={{ minHeight: '68px' }}
                      aria-label={`Select ${bride.title}`}
                    >
                      {/* Left Image Thumbnail */}
                      <div className="relative w-16 sm:w-18 flex-shrink-0 overflow-hidden bg-[#240307]">
                        <SafeImage
                          src={bride.cardImage}
                          alt={`${bride.title} Preview`}
                          fill
                          quality={85}
                          sizes="80px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#540D1D]/20 pointer-events-none" />
                        )}
                      </div>

                      {/* Right Text Label */}
                      <div
                        className={`flex-1 flex flex-col justify-center px-2.5 py-1.5 border-l border-[#C2AA6A]/20 ${
                          isActive ? 'bg-[#FAF4EC]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            className={`font-serif text-[11px] font-semibold tracking-[0.12em] uppercase leading-tight ${
                              isActive ? 'text-[#540D1D]' : 'text-[#3B0712]'
                            }`}
                          >
                            {bride.shortTitle}
                          </h3>
                          {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C2AA6A] shadow-[0_0_6px_rgba(194,170,106,0.8)]" />
                          ) : (
                            <ArrowRight className="w-3 h-3 text-[#C2AA6A] opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <p className="mt-0.5 font-serif italic text-[9.5px] text-[#7A6355] line-clamp-1 leading-tight">
                          {bride.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile / Tablet: Horizontal Scrollable Strip */}
              <div className="flex lg:hidden flex-row gap-2 flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-[#C2AA6A]/40 scrollbar-track-transparent pb-1">
                {BRIDAL_TRADITIONS.map((bride, idx) => {
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={bride.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      disabled={isTransitioning}
                      className={`
                        group relative flex-shrink-0 flex flex-col rounded-xl overflow-hidden
                        transition-all duration-300 cursor-pointer text-left
                        ${
                          isActive
                            ? 'ring-2 ring-[#C2AA6A] shadow-[0_0_16px_rgba(194,170,106,0.65)]'
                            : 'border border-[#C2AA6A]/35 hover:border-[#8B1E2D]/60 opacity-80 hover:opacity-100'
                        }
                      `}
                      style={{ width: '84px', minHeight: '120px' }}
                      aria-label={`Select ${bride.title}`}
                    >
                      <div className="relative w-full flex-1 overflow-hidden bg-[#240307]" style={{ minHeight: '80px' }}>
                        <SafeImage
                          src={bride.cardImage}
                          alt={`${bride.title} Preview`}
                          fill
                          quality={85}
                          sizes="84px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <div className={`px-1 py-1 text-center ${isActive ? 'bg-[#FAF4EC]' : 'bg-white'}`}>
                        <p className={`font-serif text-[8.5px] font-bold uppercase tracking-wider leading-tight ${isActive ? 'text-[#540D1D]' : 'text-[#3B0712]'}`}>
                          {bride.shortTitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Active Notice */}
              <div className="mt-2.5 pt-2 border-t border-[#C2AA6A]/25 text-center">
                <p className="text-[10px] font-sans text-[#735C4A]">
                  Active: <strong className="text-[#540D1D] font-serif font-semibold">{currentBride.title}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              BOTTOM SLIDER NAVIGATION - MATCHES REFERENCE EXACTLY
              Circular Prev Button + Centered Pagination Dots + Circular Next Button
              Thin champagne-gold borders · White/ivory background · Burgundy active dot
          ═════════════════════════════════════════════════════════════════ */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-6 sm:gap-8">
            {/* Circular Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isTransitioning}
              aria-label="Previous bridal tradition"
              className="
                group w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                bg-white/95 hover:bg-[#540D1D] text-[#8B1E2D] hover:text-white
                border border-[#C2AA6A]/60 hover:border-[#540D1D]
                shadow-[0_2px_10px_rgba(194,170,106,0.25)]
                transition-all duration-300 hover:scale-110 active:scale-95
                cursor-pointer disabled:opacity-40
              "
            >
              <ChevronLeft className="w-5 h-5 text-[#8B1E2D] group-hover:text-white transition-colors" />
            </button>

            {/* Pagination Dots */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 px-3 py-1.5"
              role="tablist"
              aria-label="Bridal traditions navigation"
            >
              {BRIDAL_TRADITIONS.map((bride, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={bride.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`View ${bride.title}`}
                    className="p-1 focus:outline-none cursor-pointer group"
                  >
                    <span
                      className={`
                        block rounded-full transition-all duration-300
                        ${
                          isActive
                            ? 'w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#540D1D] ring-2 ring-[#C2AA6A] shadow-[0_0_8px_rgba(84,13,29,0.6)]'
                            : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#C2AA6A]/45 hover:bg-[#8B1E2D]/70 group-hover:scale-125'
                        }
                      `}
                    />
                  </button>
                );
              })}
            </div>

            {/* Circular Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isTransitioning}
              aria-label="Next bridal tradition"
              className="
                group w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                bg-white/95 hover:bg-[#540D1D] text-[#8B1E2D] hover:text-white
                border border-[#C2AA6A]/60 hover:border-[#540D1D]
                shadow-[0_2px_10px_rgba(194,170,106,0.25)]
                transition-all duration-300 hover:scale-110 active:scale-95
                cursor-pointer disabled:opacity-40
              "
            >
              <ChevronRight className="w-5 h-5 text-[#8B1E2D] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: DEDICATED BRIDAL JEWELLERY HEIRLOOMS CATALOGUE
          Active Collection Connected to Backend Database / MongoDB
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 md:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C2AA6A]/40 text-[#540D1D] text-xs uppercase font-sans tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
            <span>Curated Bridal Catalogue</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3B0712] tracking-tight">
            {currentBride.title} Heirlooms
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-sans text-[#735C4A]">
            {currentBride.description}
          </p>
        </div>

        {/* Categories Filter Tabs */}
        <div className="mb-10 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-[#D8C7B0]/60 shadow-sm max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-5 py-2.5 rounded-full text-xs font-sans tracking-wider transition-all whitespace-nowrap cursor-pointer
                    ${
                      isSelected
                        ? 'bg-[#540D1D] text-white font-semibold shadow-xs'
                        : 'text-[#574438] hover:text-[#540D1D] hover:bg-[#FAF6EE]'
                    }
                  `}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Count & Active Status */}
        <div className="mb-6 flex items-center justify-between text-xs sm:text-sm font-sans text-[#735C4A] border-b border-[#D8C7B0]/40 pb-3">
          <span>
            Showing <strong className="text-[#3B0712]">{filteredProducts.length}</strong> heirloom designs for{' '}
            <span className="text-[#540D1D] font-serif font-medium">{currentBride.title}</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#C2AA6A] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% BIS Hallmarked 22KT Gold</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-[#F2EDE4] rounded-2xl animate-pulse border border-[#D8C7B0]/30"
              />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#D8C7B0]/50 max-w-xl mx-auto shadow-sm">
            <Gem className="w-12 h-12 text-[#C2AA6A] mx-auto mb-3" />
            <h3 className="font-serif text-xl sm:text-2xl text-[#540D1D]">
              Heirlooms Under Curation
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#735C4A]">
              We are handcrafting new bridal designs for this category. Please explore our other jewellery categories or visit our store.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#540D1D] text-white text-xs font-sans tracking-widest uppercase hover:bg-[#8B1E2D] transition-colors"
            >
              Show All {currentBride.title} Designs
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
