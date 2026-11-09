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
    phone: '+91 98353 22525',
    phoneRaw: '9835322525',
    phoneSecondary: '+91 94315 43122',
    phoneSecondaryRaw: '9431543122',
    phones: [
      { display: '+91 98353 22525', raw: '9835322525' },
      { display: '+91 94315 43122', raw: '9431543122' },
    ],
    whatsapp: '+91 98353 22525',
    whatsappRaw: '9835322525',
    email: 'rishilaljewellers@gmail.com',
    supportEmail: 'rishilaljewellers@gmail.com',
    hours: 'Monday – Sunday, 10:00 AM – 8:00 PM IST',
  },
  flagshipStore: {
    name: 'Rishi Lal Jewellers',
    addressLine1: 'Rajlabandh, Main Road, Baharagora',
    addressLine2: 'East Singhbhum',
    city: 'Baharagora',
    district: 'East Singhbhum',
    state: 'Jharkhand',
    postalCode: '832101',
    country: 'India',
    formattedAddress: 'Rajlabandh, Main Road, Baharagora, East Singhbhum, Jharkhand – 832101',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rishi+Lal+Jewellers,+Rajlabandh,+Main+Road,+Baharagora,+East+Singhbhum,+Jharkhand+832101',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Rajlabandh,+Main+Road,+Baharagora,+East+Singhbhum,+Jharkhand+832101&t=&z=15&ie=UTF8&iwloc=&output=embed',
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
