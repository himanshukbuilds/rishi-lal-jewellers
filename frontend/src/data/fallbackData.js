/**
 * Rishi Lal Jewellers — Offline / Fallback Catalog Data
 * Ensures 100% storefront uptime and zero blank pages during demonstrations,
 * viva presentations, or when the Express API server is starting up.
 */

export const FALLBACK_CATEGORIES = [
  {
    _id: 'cat-gold',
    name: 'Gold',
    slug: 'gold',
    description: '100% BIS Hallmarked 22KT and 18KT gold jewelry with authentic HUID verification.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 1,
  },
  {
    _id: 'cat-diamond',
    name: 'Diamond',
    slug: 'diamond',
    description: 'Rare, ethically sourced natural solitaires certified by IGI and GIA for pristine brilliance.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 2,
  },
  {
    _id: 'cat-bridal',
    name: 'Bridal',
    slug: 'bridal',
    description: 'Opulent royal bridal ensembles and heritage wedding jewelry crafted for your grand celebration.',
    image: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 3,
  },
  {
    _id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'From majestic jhumkas and chandeliers to refined daily diamond studs.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 4,
  },
  {
    _id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaire engagement rings, diamond bands, and royal gemstone statement rings.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 5,
  },
  {
    _id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Regal chokers, layered haars, kundan collars, and delicate diamond chains.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 6,
  },
  {
    _id: 'cat-bangles',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Handcrafted temple kadas, diamond eternity tennis bracelets, and traditional choodas.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 7,
  },
  {
    _id: 'cat-gifts',
    name: 'Gifts',
    slug: 'gifts',
    description: 'Thoughtful fine jewelry keepsakes crafted for anniversaries, milestones, and festivals.',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
    featured: true,
    displayOrder: 8,
  },
];

export const FALLBACK_PRODUCTS = [
  {
    _id: 'prod-001',
    name: 'Padmavati Royal Kundan & Polki Choker Set',
    slug: 'padmavati-royal-kundan-polki-choker-set',
    sku: 'AUR-BRD-NK-001',
    category: 'Bridal',
    categorySlug: 'bridal',
    price: 345000,
    originalPrice: 385000,
    discountPercentage: 10,
    description: 'An ethereal bridal choker set crafted in 22KT yellow gold, encrusted with uncut syndicate polki diamonds and finished with Zambian emerald beads and South Sea pearl drops. Includes matching chandelier earrings.',
    craftsmanshipStory: 'Handcrafted over 180 meticulous hours by royal Gujarati karigars using jadau and meenakari enameling on the reverse side.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 72.4,
    netGoldWeight: 58.2,
    gemstones: [
      { type: 'Uncut Syndicate Polki', carat: 14.5, clarity: 'Natural', color: 'Warm Glow', count: 48 },
      { type: 'Zambian Emerald Beads', carat: 22.0, clarity: 'AAA Grade', color: 'Deep Green', count: 24 }
    ],
    availableSizes: ['Adjustable Dori'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 3,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 34,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 14.0,
    tags: ['bridal', 'kundan', 'polki', 'wedding', 'royal', 'choker']
  },
  {
    _id: 'prod-002',
    name: 'The Crown 1.50 Ct Solitaire Diamond Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    sku: 'AUR-DIA-RG-002',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 195000,
    originalPrice: 220000,
    discountPercentage: 11,
    description: 'An iconic six-prong platinum crown solitaire ring showcasing a breathtaking 1.50 carat round brilliant cut diamond with micro-pavé diamonds along the 18K white gold band.',
    craftsmanshipStory: 'Engineered with microscopic laser precision to maximize light return and fire from every angle. Certified by the International Gemological Institute (IGI).',
    metal: '18K White Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 4.85,
    netGoldWeight: 4.45,
    gemstones: [
      { type: 'Natural Solitaire Diamond', carat: 1.5, clarity: 'VVS1', color: 'E (Colorless)', count: 1 },
      { type: 'Accent Pavé Diamonds', carat: 0.35, clarity: 'VVS-VS', color: 'F-G', count: 16 }
    ],
    availableSizes: ['11', '12', '13', '14', '15', '16', '17'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 7,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 28,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.5,
    tags: ['diamond', 'solitaire', 'engagement', 'rings', 'luxury']
  },
  {
    _id: 'prod-003',
    name: 'Mayur Heritage 22K Gold Temple Jhumkas',
    slug: 'mayur-heritage-22k-gold-temple-jhumkas',
    sku: 'AUR-GLD-ER-003',
    category: 'Earrings',
    categorySlug: 'earrings',
    price: 78000,
    originalPrice: 85000,
    discountPercentage: 8,
    description: 'Intricately sculpted antique temple earrings featuring a dancing peacock motif with delicate gold bead jhallar bells that chime softly with movement.',
    craftsmanshipStory: 'Forged in Chennai ateliers following ancient Chola bronze casting traditions, given a signature heritage antique patina.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 18.6,
    netGoldWeight: 18.6,
    gemstones: [],
    availableSizes: ['Standard Clip & Post'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 12,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 42,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.5,
    tags: ['gold', 'earrings', 'jhumka', 'temple', 'antique', 'festive']
  },
  {
    _id: 'prod-004',
    name: 'Imperial Royal Elephant 22K Gold Kadas (Pair)',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    sku: 'AUR-GLD-BG-004',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 245000,
    originalPrice: 265000,
    discountPercentage: 7,
    description: 'A pair of substantial die-struck 22KT gold kadas featuring hand-carved royal elephant heads with ruby eyes and filigree scrollwork.',
    craftsmanshipStory: 'Constructed with a hidden safety screw hinge for effortless elegance and lifetime security.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 42.0,
    netGoldWeight: 41.5,
    gemstones: [
      { type: 'Natural Burmese Rubies', carat: 0.5, clarity: 'Eye Clean', color: 'Pigeon Blood Red', count: 4 }
    ],
    availableSizes: ['2.4', '2.6', '2.8'],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 5,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 19,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 11.5,
    tags: ['bangles', 'gold', 'kadas', 'royal', 'bridal', 'elephants']
  },
  {
    _id: 'prod-005',
    name: 'Zubeda Royal Emerald & Diamond Statement Haar',
    slug: 'zubeda-royal-emerald-diamond-statement-haar',
    sku: 'AUR-BRD-NK-005',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 480000,
    originalPrice: 520000,
    discountPercentage: 8,
    description: 'A masterpiece layered haar strung with seven strands of certified natural emeralds, crowned with an antique medallion set with brilliant round diamonds.',
    craftsmanshipStory: 'Sourced from the historic gem-cutting bazaars of Jaipur and hand-strung with pure silk threads by master thread artisans.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 96.0,
    netGoldWeight: 45.0,
    gemstones: [
      { type: 'Natural Colombian Emeralds', carat: 125.0, clarity: 'Translucent Gem Grade', color: 'Vivid Forest Green', count: 350 },
      { type: 'Brilliant Round Diamonds', carat: 5.2, clarity: 'VVS-VS', color: 'G-H', count: 64 }
    ],
    availableSizes: ['Adjustable Length'],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 2,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 11,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 15.0,
    tags: ['emerald', 'haar', 'necklace', 'bridal', 'statement', 'luxury']
  },
  {
    _id: 'prod-006',
    name: 'Celestial Dewdrop Solitaire Diamond Studs (1.00 Ct)',
    slug: 'celestial-dewdrop-solitaire-diamond-studs-1-00-ct',
    sku: 'AUR-DIA-ER-006',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 92000,
    originalPrice: 105000,
    discountPercentage: 12,
    description: 'Timeless four-prong solitaire studs featuring matching 0.50 ct each round brilliant cut diamonds (1.00 ct total weight) in 18K yellow gold.',
    craftsmanshipStory: 'Precisely matched pair for identical optical scintillation, fire, and table percentage.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 2.9,
    netGoldWeight: 2.7,
    gemstones: [
      { type: 'Natural Solitaire Diamonds', carat: 1.0, clarity: 'VVS2', color: 'F', count: 2 }
    ],
    availableSizes: ['Screw Back'],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 15,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    gender: 'kids',
    rating: 4.9,
    reviewsCount: 56,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 10.0,
    tags: ['diamond', 'studs', 'earrings', 'everyday', 'solitaire', 'kids', 'children']
  },
  {
    _id: 'prod-007',
    name: 'Aadya 22K Gold Temple Choker with Lakshmi Motif',
    slug: 'aadya-22k-gold-temple-choker-lakshmi-motif',
    sku: 'AUR-GLD-NK-007',
    category: 'Gold',
    categorySlug: 'gold',
    price: 215000,
    originalPrice: 235000,
    discountPercentage: 8,
    description: 'An auspicious gold choker featuring Goddess Lakshmi seated on a lotus flanked by divine elephants, adorned with unheated rubies and hanging golden pearls.',
    craftsmanshipStory: 'Created using the traditional Nakshi repoussé embossing technique on solid gold sheets.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 44.5,
    netGoldWeight: 43.0,
    gemstones: [
      { type: 'Natural Rubies', carat: 2.5, clarity: 'Cabochon', color: 'Deep Pink-Red', count: 12 }
    ],
    availableSizes: ['Adjustable Chain Link'],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 4,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 27,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 13.0,
    tags: ['gold', 'temple', 'lakshmi', 'choker', 'festive', 'traditional']
  },
  {
    _id: 'prod-008',
    name: 'Eternal Rose Diamond Tennis Bracelet (3.00 Ct)',
    slug: 'eternal-rose-diamond-tennis-bracelet-3-00-ct',
    sku: 'AUR-DIA-BG-008',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 185000,
    originalPrice: 210000,
    discountPercentage: 11,
    description: 'A continuous line of 52 scintillating brilliant-cut diamonds handset in a flexible 18K rose gold channel setting with double safety lock.',
    craftsmanshipStory: 'Fluid link engineering allows effortless drape around the wrist while preventing rotation.',
    metal: '18K Rose Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 11.2,
    netGoldWeight: 10.6,
    gemstones: [
      { type: 'Natural Round Diamonds', carat: 3.0, clarity: 'VVS-VS', color: 'G', count: 52 }
    ],
    availableSizes: ['6.5 inch', '7.0 inch', '7.5 inch'],
    images: [
      'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 6,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 31,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.0,
    tags: ['bracelet', 'diamond', 'tennis', 'rose gold', 'modern']
  },
  {
    _id: 'prod-009',
    name: 'Navratna Royal Nine-Gem Heritage Ring',
    slug: 'navratna-royal-nine-gem-heritage-ring',
    sku: 'AUR-GEM-RG-009',
    category: 'Rings',
    categorySlug: 'rings',
    price: 88000,
    originalPrice: 95000,
    discountPercentage: 7,
    description: 'A traditional cosmic ring featuring the 9 sacred astrological gemstones arranged around a natural ruby centerpiece in solid 22KT hallmarked gold.',
    craftsmanshipStory: 'Aligned according to Vedic gemological symmetry to channel harmony, prosperity, and wellness.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 9.8,
    netGoldWeight: 8.5,
    gemstones: [
      { type: 'Natural 9 Sacred Gemstones', carat: 2.8, clarity: 'Natural', color: 'Multicolor', count: 9 }
    ],
    availableSizes: ['12', '14', '16', '18', '20'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 9,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: false,
    isBridal: false,
    rating: 4.7,
    reviewsCount: 16,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.0,
    tags: ['navratna', 'rings', 'gemstone', 'vedic', 'gold']
  },
  {
    _id: 'prod-010',
    name: 'Kashmir Royale Colombian Emerald Pendant with 18K Chain',
    slug: 'kashmir-royale-colombian-emerald-pendant-18k-chain',
    sku: 'AUR-GFT-PD-010',
    category: 'Gifts',
    categorySlug: 'gifts',
    price: 68000,
    originalPrice: 75000,
    discountPercentage: 9,
    description: 'A cushion-cut 1.80 carat Colombian emerald encircled by a halo of micro-prong diamonds, suspended from a delicate 18K yellow gold cable chain.',
    craftsmanshipStory: 'The perfect anniversary or milestone gift, packaged in Rishi Lal signature emerald velvet jewellery casket.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 5.4,
    netGoldWeight: 4.8,
    gemstones: [
      { type: 'Natural Colombian Emerald', carat: 1.8, clarity: 'Fine', color: 'Luminous Green', count: 1 },
      { type: 'Natural Diamonds', carat: 0.28, clarity: 'VVS', color: 'F', count: 18 }
    ],
    availableSizes: ['18 inch adjustable'],
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 14,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 38,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 10.0,
    tags: ['pendant', 'emerald', 'gifts', 'anniversary', 'necklace']
  },
  {
    _id: 'prod-011',
    name: 'Noor Modern 18K Gold Diamond Mangalsutra',
    slug: 'noor-modern-18k-gold-diamond-mangalsutra',
    sku: 'AUR-GLD-MG-011',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 58000,
    originalPrice: 65000,
    discountPercentage: 10,
    description: 'An elegant contemporary mangalsutra featuring an infinity loop diamond pendant on a double strand of auspicious black onyx beads and 18K gold links.',
    craftsmanshipStory: 'Designed for the modern Indian woman who desires traditional sacred symbolism with minimalist luxury aesthetic.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 6.2,
    netGoldWeight: 5.5,
    gemstones: [
      { type: 'Natural Diamonds', carat: 0.42, clarity: 'VVS-VS', color: 'G-H', count: 14 }
    ],
    availableSizes: ['16 inch', '18 inch'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 11,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 45,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 11.0,
    tags: ['mangalsutra', 'diamond', 'wedding', 'modern', 'gold']
  },
  {
    _id: 'prod-012',
    name: 'Sultan Men’s 22K Solid Gold Lion Signet Ring',
    slug: 'sultan-mens-22k-solid-gold-lion-signet-ring',
    sku: 'AUR-MEN-RG-012',
    category: 'Rings',
    categorySlug: 'rings',
    price: 94000,
    originalPrice: 102000,
    discountPercentage: 7,
    description: 'A commanding men’s signet ring hand-carved in heavy 22KT yellow gold featuring the regal Ashoka lion emblem with matte side fluting.',
    craftsmanshipStory: 'Solid-backed high-comfort band crafted to withstand generations of daily wear.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 14.8,
    netGoldWeight: 14.8,
    gemstones: [],
    availableSizes: ['18', '20', '22', '24'],
    images: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 8,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: false,
    isBridal: false,
    gender: 'men',
    rating: 4.8,
    reviewsCount: 22,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.0,
    tags: ['men', 'signet', 'rings', 'gold', 'royal']
  },
  {
    _id: 'prod-013',
    name: 'Meenakari Hand-Painted Floral 22K Gold Bangle',
    slug: 'meenakari-hand-painted-floral-22k-gold-bangle',
    sku: 'AUR-GLD-BG-013',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 135000,
    originalPrice: 148000,
    discountPercentage: 8,
    description: 'A Jaipur enamel art masterwork featuring pastel pink and emerald green meenakari blossoms engraved directly into 22KT hallmarked gold.',
    craftsmanshipStory: 'Fired five times in traditional charcoal kilns by hereditary Meenakar craftspeople.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 26.5,
    netGoldWeight: 25.2,
    gemstones: [
      { type: 'Natural Polki Glass', carat: 1.2, clarity: 'Heritage', color: 'Translucent', count: 12 }
    ],
    availableSizes: ['2.4', '2.6', '2.8'],
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 5,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 14,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 14.0,
    tags: ['meenakari', 'bangle', 'gold', 'jaipur', 'enamel']
  },
  {
    _id: 'prod-014',
    name: 'Basra Heritage Natural Pearl & Diamond Choker',
    slug: 'basra-heritage-natural-pearl-diamond-choker',
    sku: 'AUR-BRD-NK-014',
    category: 'Bridal',
    categorySlug: 'bridal',
    price: 295000,
    originalPrice: 320000,
    discountPercentage: 7,
    description: 'An aristocrat collar choker comprising five rows of natural Basra-style lustrous pearls held together by diamond-studded 18K white gold spacer bars.',
    craftsmanshipStory: 'Finished with a hand-woven golden zardozi cordon with silk tassels.',
    metal: '18K White Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 68.0,
    netGoldWeight: 28.0,
    gemstones: [
      { type: 'Natural Saltwater Pearls', carat: 85.0, clarity: 'High Luster', color: 'Ivory White', count: 180 },
      { type: 'Natural Diamonds', carat: 3.4, clarity: 'VVS', color: 'F-G', count: 48 }
    ],
    availableSizes: ['Adjustable Dori'],
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 3,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 9,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 15.0,
    tags: ['pearl', 'choker', 'bridal', 'white gold', 'vintage']
  },
  {
    _id: 'prod-015',
    name: 'Royal Mughal Ruby & Uncut Diamond Cocktail Ring',
    slug: 'royal-mughal-ruby-uncut-diamond-cocktail-ring',
    sku: 'AUR-GEM-RG-015',
    category: 'Rings',
    categorySlug: 'rings',
    price: 110000,
    originalPrice: 122000,
    discountPercentage: 9,
    description: 'A striking oval ruby cabochon (3.5 ct) flanked by open-set uncut polki diamonds in an antique 22K yellow gold floral filigree setting.',
    craftsmanshipStory: 'Carved with intricate miniature scrollwork on the under-gallery visible from all side profiles.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 12.4,
    netGoldWeight: 10.8,
    gemstones: [
      { type: 'Natural Unheated Burma Ruby', carat: 3.5, clarity: 'Cabochon', color: 'Crimson Red', count: 1 },
      { type: 'Uncut Syndicate Polki', carat: 1.1, clarity: 'Natural', color: 'Light Amber', count: 10 }
    ],
    availableSizes: ['12', '14', '16', '18'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 6,
    isBestseller: false,
    isNewArrival: false,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 19,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 12.5,
    tags: ['ruby', 'polki', 'cocktail ring', 'antique', 'gold']
  },
  {
    _id: 'prod-016',
    name: 'Ananya Everyday 18K Yellow Gold Rope Chain',
    slug: 'ananya-everyday-18k-yellow-gold-rope-chain',
    sku: 'AUR-GLD-CH-016',
    category: 'Gold',
    categorySlug: 'gold',
    price: 42000,
    originalPrice: 46000,
    discountPercentage: 8,
    description: 'A diamond-cut French rope chain crafted in solid 18KT yellow gold. Sparkles with subtle brilliance under natural daylight.',
    craftsmanshipStory: 'Braided using continuous solid links with reinforced lobster claw safety clasp.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 7.2,
    netGoldWeight: 7.2,
    gemstones: [],
    availableSizes: ['18 inch', '20 inch', '22 inch'],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 20,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: false,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 68,
    certification: 'BIS Hallmarked & IGI Certified',
    makingChargesRate: 9.0,
    tags: ['chain', 'rope chain', 'everyday', 'gold', 'minimalist']
  }
];

export function getFallbackHighlights() {
  return {
    bestsellers: FALLBACK_PRODUCTS.filter((p) => p.isBestseller).slice(0, 4),
    newArrivals: FALLBACK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4),
    bridalCollection: FALLBACK_PRODUCTS.filter((p) => p.isBridal).slice(0, 4),
    featured: FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4),
  };
}

export function filterFallbackProducts(params = {}) {
  let list = [...FALLBACK_PRODUCTS];

  if (params.category && params.category !== 'all') {
    list = list.filter(
      (p) =>
        p.category.toLowerCase() === params.category.toLowerCase() ||
        p.categorySlug === params.category.toLowerCase()
    );
  }

  if (params.categorySlug) {
    list = list.filter((p) => p.categorySlug === params.categorySlug.toLowerCase());
  }

  if (params.metal && params.metal !== 'all') {
    list = list.filter((p) => p.metal.toLowerCase().includes(params.metal.toLowerCase()));
  }

  if (params.minPrice) {
    list = list.filter((p) => p.price >= Number(params.minPrice));
  }

  if (params.maxPrice) {
    list = list.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.isBridal === 'true' || params.isBridal === true) {
    list = list.filter((p) => p.isBridal);
  }

  if (params.gender && params.gender !== 'all') {
    const g = params.gender.toLowerCase().trim();
    const targetG = (g === 'kids' || g === 'children') ? 'kids' : g;
    list = list.filter(
      (p) =>
        (p.gender && (p.gender === targetG || p.gender === 'unisex')) ||
        (p.tags && (p.tags.includes(targetG) || (targetG === 'men' && p.tags.includes('men')) || (targetG === 'kids' && p.tags.includes('kids'))))
    );
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (params.sort) {
    if (params.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'bestseller') {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (params.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
  }

  const limit = params.limit ? Number(params.limit) : 40;
  const page = params.page ? Number(params.page) : 1;
  const startIndex = (page - 1) * limit;
  const paginated = list.slice(startIndex, startIndex + limit);

  return {
    success: true,
    totalProducts: list.length,
    totalPages: Math.ceil(list.length / limit) || 1,
    currentPage: page,
    count: paginated.length,
    products: paginated,
  };
}

