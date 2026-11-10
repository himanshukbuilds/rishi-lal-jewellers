import Image from 'next/image';
import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import DailyWearProducts from '@/components/dailywear/DailyWearProducts';

export const metadata = {
  title: 'Casual & Daily Wear Jewellery | Rishi Lal Jewellers',
  description: 'Explore lightweight illustrative jewellery concepts for everyday style. Prices and product specifications are confirmed by enquiry.',
};

export default function DailyWearPage({ searchParams }) {
  const categoryCards = [
    { title: 'Necklaces', image: '/images/daily-wear/categories/necklaces.jpg', href: '/necklaces' },
    { title: 'Earrings', image: '/images/daily-wear/categories/earrings.jpg', href: '/earrings' },
    { title: 'Rings', image: '/images/daily-wear/categories/rings.jpg', href: '/rings' },
    { title: 'Bracelets', image: '/images/daily-wear/categories/bracelets.jpg', href: '/daily-wear?category=Bracelets' },
    { title: 'Bangles', image: '/images/daily-wear/categories/bangles.jpg', href: '/bangles' },
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="relative isolate min-h-[1420px] overflow-hidden bg-[#32070C] text-[#F8F3E8] sm:min-h-[1160px] lg:min-h-[760px]">
        <div className="absolute inset-x-0 top-0 h-[500px] overflow-hidden lg:hidden">
          <Image src="/images/daily-wear/casual-daily-wear-hero.jpg" alt="Smiling woman wearing delicate everyday gold earrings, pendant necklace and ring" fill priority sizes="100vw" className="object-cover object-[60%_top]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#32070c_0%,rgba(50,7,12,.12)_65%,rgba(50,7,12,.02)_100%)]" />
        </div>
        <Image src="/images/daily-wear/casual-daily-wear-hero.jpg" alt="" fill sizes="100vw" className="hidden object-cover object-[center_40%] lg:block" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#32070c_0%,rgba(50,7,12,.98)_29%,rgba(50,7,12,.88)_43%,rgba(50,7,12,.48)_57%,rgba(50,7,12,.04)_78%),linear-gradient(0deg,#32070c_18%,transparent_46%)] lg:block" />

        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1600 900" fill="none" preserveAspectRatio="none">
          <path d="M-120 90C60 10 145 8 260-45M-80 145C100 50 190 54 294-8M1190 900c100-155 180-244 440-298M1240 900c90-122 194-186 360-214" stroke="#C6A15B" strokeWidth="1.2" />
          <g stroke="#C6A15B" strokeWidth="1" opacity=".72">
            <path d="M54 675c55-68 96-109 153-151M96 640c-12-41-9-68 8-94 23 25 30 51 22 79M136 603c-3-43 7-70 31-92 14 31 12 57-6 84M176 566c9-36 26-57 53-68 2 30-8 52-31 69M93 645c-40-9-63-25-77-53 31-4 55 6 76 30M136 604c-38-4-63-17-81-43 31-8 56-1 80 23M176 566c-33-1-57-11-77-33 27-9 51-5 74 14" />
            <circle cx="208" cy="524" r="12"/><path d="M208 505v38m-19-19h38m-32-13 27 27m0-27-27 27" />
          </g>
          <path d="M1350 112c72 54 129 57 211 15M1370 145c73 52 133 57 218 17" stroke="#C6A15B" strokeWidth="1" opacity=".3" />
        </svg>

        <div className="relative z-10 mx-auto grid min-h-[1420px] max-w-[1500px] grid-cols-1 px-5 pb-[490px] pt-[440px] sm:min-h-[1270px] sm:px-8 sm:pb-[380px] sm:pt-[450px] lg:min-h-[760px] lg:grid-cols-[45%_55%] lg:px-12 lg:pb-[235px] lg:pt-10 xl:px-16">
          <div className="flex max-w-[610px] flex-col items-start justify-center">
            <BrandLogo variant="light" size="md" showTagline className="mb-8 scale-[.88] origin-left sm:scale-100" />
            <div className="mb-4 flex items-center gap-3 text-[#D7B86D]" aria-hidden="true"><span className="h-px w-12 bg-[#C6A15B]"/><span className="text-sm">✦</span><span className="h-px w-12 bg-[#C6A15B]"/></div>
            <p className="max-w-[520px] text-[9px] font-semibold uppercase tracking-[.2em] text-[#D7B86D] sm:text-[11px] sm:tracking-[.24em]">Lightweight jewellery for your everyday style.</p>
            <h1 className="mt-4 font-serif text-[clamp(3.15rem,7vw,6.9rem)] font-normal leading-[.91] tracking-[-.035em]">
              <span className="block text-[#F7F1E7]">Casual &amp;</span>
              <span className="mt-1 block text-[#D5B66D]">Daily Wear</span>
            </h1>
            <p className="mt-5 max-w-[450px] font-serif text-base italic leading-7 text-[#F2E8D5] sm:text-lg">Minimal, versatile and elegant designs crafted for your everyday moments.</p>
            <Link href="#daily-wear-products" className="mt-7 inline-flex items-center gap-3 border border-[#C6A15B] px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[.2em] text-[#F0D68E] transition-colors duration-300 hover:bg-[#C6A15B] hover:text-[#32070C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8D18B]">Explore Collection <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>

        <nav aria-label="Shop casual and daily wear by category" className="absolute inset-x-0 bottom-5 z-20 mx-auto grid max-w-[1320px] grid-cols-2 gap-3 px-5 sm:bottom-6 sm:grid-cols-3 sm:px-8 lg:grid-cols-5 lg:gap-5 lg:px-10">
          {categoryCards.map((card, index) => (
            <Link key={card.title} href={card.href} className={`group relative flex h-[145px] items-end overflow-hidden border border-[#B99650]/90 bg-[#3A090E] p-3 shadow-[0_8px_28px_rgba(0,0,0,.2)] transition-all duration-500 hover:-translate-y-1 hover:border-[#E2C574] hover:shadow-[0_12px_30px_rgba(0,0,0,.3)] sm:h-[160px] lg:h-[190px] ${index === 4 ? 'col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-full' : ''}`}>
              <Image src={card.image} alt={`${card.title} daily wear jewellery concept`} fill sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 18vw" className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26050B]/95 via-[#26050B]/12 to-transparent" />
              <span className="relative z-10 w-full pb-1 text-center font-serif text-lg text-[#F7F1E7] sm:text-xl">{card.title}</span>
              <span className="absolute bottom-2 left-1/2 h-px w-8 -translate-x-1/2 bg-[#C6A15B] transition-all duration-300 group-hover:w-14" />
            </Link>
          ))}
        </nav>
      </section>
      <DailyWearProducts id="daily-wear-products" showFilters initialCategory={searchParams?.category || 'all'} />
    </main>
  );
}
