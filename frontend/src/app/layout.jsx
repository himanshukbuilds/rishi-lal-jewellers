import './globals.css';
import Providers from '@/context/Providers';
import { BRAND_CONFIG } from '@/config/brandConfig';
import CinematicSequence from '@/components/common/CinematicSequence';

export const metadata = {
  title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
  description:
    'Experience haute Indian jewelry in 22KT BIS Hallmarked gold and certified natural solitaires from Rishi Lal Jewellers. Handcrafted bridal chokers, temple haar, and engagement rings.',
  keywords: [
    'Rishi Lal Jewellers',
    'Rishi Lal Jewelry',
    'Indian Jewelry',
    'Gold Necklace',
    'Diamond Solitaires',
    'Bridal Jewellery',
    'BIS Hallmarked',
    'Kundan Polki',
  ],
  openGraph: {
    title: `${BRAND_CONFIG.name} — Luxury Indian Jewelry`,
    description: 'Timeless Elegance. Crafted for You.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#2A080E' }}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/splash/cinematic-ruby-ribbons.png"
          type="image/png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/splash/bridal-intro-ruby-background.png"
          type="image/png"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #2A080E !important;
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans selection:bg-gold-500 selection:text-emerald-950"
        style={{ backgroundColor: '#2A080E' }}
      >
        <Providers>
          <CinematicSequence>{children}</CinematicSequence>
        </Providers>
      </body>
    </html>
  );
}
