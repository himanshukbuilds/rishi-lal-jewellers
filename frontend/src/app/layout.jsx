import './globals.css';
import Providers from '@/context/Providers';
import { BRAND_CONFIG } from '@/config/brandConfig';

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
    <html lang="en" style={{ backgroundColor: '#3B0710' }}>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/splash/satin_background_clean.png"
          type="image/png"
          fetchPriority="high"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #3B0710 !important;
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans selection:bg-gold-500 selection:text-emerald-950"
        style={{ backgroundColor: '#3B0710' }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
