/**
 * RISHI LAL JEWELLERS - Centralized Brand Configuration
 * Change any brand detail here and it reflects everywhere across the website!
 */
export const BRAND_CONFIG = {
  name: 'Rishi Lal Jewellers',
  legalName: 'Rishi Lal Jewellers Private Limited',
  tagline: 'Timeless Elegance. Crafted for You.',
  category: 'Haute Joaillerie & Fine Indian Jewelry',
  currency: {
    symbol: '₹',
    code: 'INR',
    locale: 'en-IN',
  },
  logo: {
    // Official Rishi Lal Jewellers monogram logo
    image: '/images/logo.png',
    alt: 'Rishi Lal Jewellers Emblem',
    width: 60,
    height: 60,
  },
  contact: {
    phone: '+91 (0) 22 8901 4500',
    tollFree: '1800 209 8888',
    whatsapp: '+91 98200 12345',
    email: 'concierge@rishilaljewellers.com',
    supportEmail: 'support@rishilaljewellers.com',
    hours: 'Monday – Sunday, 10:00 AM – 8:00 PM IST',
  },
  flagshipStore: {
    name: 'Rishi Lal Flagship Atelier & Boutique',
    addressLine1: 'The Grand Heritage Arcade, 14 Colaba Causeway',
    addressLine2: 'Near Gateway of India, Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  },
  socialLinks: {
    instagram: 'https://instagram.com/rishilaljewellers.official',
    facebook: 'https://facebook.com/rishilaljewellersofficial',
    pinterest: 'https://pinterest.com/rishilaljewellers',
    youtube: 'https://youtube.com/@rishilaljewellers',
  },
  trustPillars: [
    {
      id: 'bis-hallmark',
      title: '100% BIS Hallmarked Gold',
      description: 'Every gold creation is stamped with HUID purity verification by the Bureau of Indian Standards.',
      icon: 'ShieldCheck',
    },
    {
      id: 'certified-diamonds',
      title: 'IGI & GIA Certified Solitaires',
      description: 'All natural diamonds are internationally graded for VVS clarity and EF colorless brilliance.',
      icon: 'Gem',
    },
    {
      id: 'lifetime-exchange',
      title: 'Lifetime Exchange & Buyback',
      description: 'Transparent buyback value guarantee across any of our boutiques nationwide.',
      icon: 'RefreshCw',
    },
    {
      id: 'insured-shipping',
      title: 'Complimentary Insured Delivery',
      description: 'Tamper-proof, fully transit-insured armored courier delivery across 26,000+ Indian PIN codes.',
      icon: 'Truck',
    },
  ],
  announcementBar: {
    enabled: true,
    messages: [
      '✨ Complimentary Armored Insured Shipping on all orders across India',
      '💎 Festive Solitaire Gala: Enjoy 25% Off on Making Charges with code FESTIVE25',
      '👑 100% BIS Hallmarked Gold & IGI Certified Natural Diamonds',
    ],
  },
};

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
