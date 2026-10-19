const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { connectDB } = require('../config/db');
const { DEMO_ACCOUNTS } = require('../config/constants');

// Verified high-definition luxury jewelry imagery
const JEWELRY_IMAGES = {
  bridalChoker: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
  bridalSet: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=900&q=80',
  diamondRing: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
  solitaireStuds: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
  goldJhumka: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
  goldBangles: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
  goldNecklace: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
  emeraldPendant: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=80',
  rubyRing: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
  diamondBracelet: 'https://images.unsplash.com/photo-1611591475152-473523dd665e?auto=format&fit=crop&w=900&q=80',
  goldKada: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80',
  pearlChoker: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
  menGoldRing: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
  mangalsutra: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
  antiqueHaar: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
};

const categoriesData = [
  {
    name: 'Gold',
    slug: 'gold',
    description: '100% BIS Hallmarked 22KT and 18KT gold jewelry with authentic HUID verification.',
    image: JEWELRY_IMAGES.goldNecklace,
    featured: true,
    displayOrder: 1
  },
  {
    name: 'Diamond',
    slug: 'diamond',
    description: 'Rare, ethically sourced natural solitaires certified by IGI and GIA for pristine brilliance.',
    image: JEWELRY_IMAGES.diamondRing,
    featured: true,
    displayOrder: 2
  },
  {
    name: 'Bridal',
    slug: 'bridal',
    description: 'Opulent royal bridal ensembles and heritage wedding jewelry crafted for your grand celebration.',
    image: JEWELRY_IMAGES.bridalSet,
    featured: true,
    displayOrder: 3
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'From majestic jhumkas and chandeliers to refined daily diamond studs.',
    image: JEWELRY_IMAGES.goldJhumka,
    featured: true,
    displayOrder: 4
  },
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaire engagement rings, diamond bands, and royal gemstone statement rings.',
    image: JEWELRY_IMAGES.rubyRing,
    featured: true,
    displayOrder: 5
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Regal chokers, layered haars, kundan collars, and delicate diamond chains.',
    image: JEWELRY_IMAGES.bridalChoker,
    featured: true,
    displayOrder: 6
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    description: 'Handcrafted temple kadas, diamond eternity tennis bracelets, and traditional choodas.',
    image: JEWELRY_IMAGES.goldBangles,
    featured: true,
    displayOrder: 7
  },
  {
    name: 'Gifts',
    slug: 'gifts',
    description: 'Thoughtful fine jewelry keepsakes crafted for anniversaries, milestones, and festivals.',
    image: JEWELRY_IMAGES.emeraldPendant,
    featured: true,
    displayOrder: 8
  }
];

const productsData = [
  {
    name: 'Padmavati Royal Kundan & Polki Choker Set',
    slug: 'padmavati-royal-kundan-polki-choker-set',
    sku: 'AUR-BRD-NK-001',
    category: 'Bridal',
    categorySlug: 'bridal',
    price: 345000,
    originalPrice: 385000,
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
    images: [JEWELRY_IMAGES.bridalChoker, JEWELRY_IMAGES.bridalSet, JEWELRY_IMAGES.goldNecklace],
    stock: 3,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 34,
    tags: ['bridal', 'kundan', 'polki', 'wedding', 'royal', 'choker']
  },
  {
    name: 'The Crown 1.50 Ct Solitaire Diamond Ring',
    slug: 'the-crown-1-50-ct-solitaire-diamond-ring',
    sku: 'AUR-DIA-RG-002',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 195000,
    originalPrice: 220000,
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
    images: [JEWELRY_IMAGES.diamondRing, JEWELRY_IMAGES.rubyRing],
    stock: 7,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 28,
    tags: ['diamond', 'solitaire', 'engagement', 'rings', 'luxury']
  },
  {
    name: 'Mayur Heritage 22K Gold Temple Jhumkas',
    slug: 'mayur-heritage-22k-gold-temple-jhumkas',
    sku: 'AUR-GLD-ER-003',
    category: 'Earrings',
    categorySlug: 'earrings',
    price: 78000,
    originalPrice: 85000,
    description: 'Intricately sculpted antique temple earrings featuring a dancing peacock motif with delicate gold bead jhallar bells that chime softly with movement.',
    craftsmanshipStory: 'Forged in Chennai ateliers following ancient Chola bronze casting traditions, given a signature heritage antique patina.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 18.6,
    netGoldWeight: 18.6,
    gemstones: [],
    availableSizes: ['Standard Clip & Post'],
    images: [JEWELRY_IMAGES.goldJhumka, JEWELRY_IMAGES.solitaireStuds],
    stock: 12,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 42,
    tags: ['gold', 'earrings', 'jhumka', 'temple', 'antique', 'festive']
  },
  {
    name: 'Imperial Royal Elephant 22K Gold Kadas (Pair)',
    slug: 'imperial-royal-elephant-22k-gold-kadas-pair',
    sku: 'AUR-GLD-BG-004',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 245000,
    originalPrice: 265000,
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
    images: [JEWELRY_IMAGES.goldBangles, JEWELRY_IMAGES.goldKada],
    stock: 5,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    gender: 'unisex',
    rating: 4.9,
    reviewsCount: 19,
    tags: ['bangles', 'gold', 'kadas', 'royal', 'bridal', 'elephants', 'men']
  },
  {
    name: 'Zubeda Royal Emerald & Diamond Statement Haar',
    slug: 'zubeda-royal-emerald-diamond-statement-haar',
    sku: 'AUR-BRD-NK-005',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 480000,
    originalPrice: 520000,
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
    images: [JEWELRY_IMAGES.antiqueHaar, JEWELRY_IMAGES.bridalChoker],
    stock: 2,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 11,
    tags: ['emerald', 'haar', 'necklace', 'bridal', 'statement', 'luxury']
  },
  {
    name: 'Celestial Dewdrop Solitaire Diamond Studs (1.00 Ct)',
    slug: 'celestial-dewdrop-solitaire-diamond-studs-1-00-ct',
    sku: 'AUR-DIA-ER-006',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 92000,
    originalPrice: 105000,
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
    images: [JEWELRY_IMAGES.solitaireStuds, JEWELRY_IMAGES.goldJhumka],
    stock: 15,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    gender: 'kids',
    rating: 4.9,
    reviewsCount: 56,
    tags: ['diamond', 'studs', 'earrings', 'everyday', 'solitaire', 'kids', 'women']
  },
  {
    name: 'Aadya 22K Gold Temple Choker with Lakshmi Motif',
    slug: 'aadya-22k-gold-temple-choker-lakshmi-motif',
    sku: 'AUR-GLD-NK-007',
    category: 'Gold',
    categorySlug: 'gold',
    price: 215000,
    originalPrice: 235000,
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
    images: [JEWELRY_IMAGES.goldNecklace, JEWELRY_IMAGES.bridalChoker],
    stock: 4,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 27,
    tags: ['gold', 'temple', 'lakshmi', 'choker', 'festive', 'traditional']
  },
  {
    name: 'Eternal Rose Diamond Tennis Bracelet (3.00 Ct)',
    slug: 'eternal-rose-diamond-tennis-bracelet-3-00-ct',
    sku: 'AUR-DIA-BG-008',
    category: 'Diamond',
    categorySlug: 'diamond',
    price: 185000,
    originalPrice: 210000,
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
    images: [JEWELRY_IMAGES.diamondBracelet, JEWELRY_IMAGES.goldBangles],
    stock: 6,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 31,
    tags: ['bracelet', 'diamond', 'tennis', 'rose gold', 'modern']
  },
  {
    name: 'Navratna Royal Nine-Gem Heritage Ring',
    slug: 'navratna-royal-nine-gem-heritage-ring',
    sku: 'AUR-GEM-RG-009',
    category: 'Rings',
    categorySlug: 'rings',
    price: 88000,
    originalPrice: 95000,
    description: 'A traditional cosmic ring featuring the 9 sacred astrological gemstones arranged around a natural ruby centerpiece in solid 22KT hallmarked gold.',
    craftsmanshipStory: 'Aligned according to Vedic gemological symmetry to channel harmony, prosperity, and wellness.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 9.8,
    netGoldWeight: 8.5,
    gemstones: [
      { type: 'Natural Ruby, Diamond, Pearl, Coral, Hessonite, Sapphire, Cat’s Eye, Yellow Sapphire, Emerald', carat: 2.8, clarity: 'Natural', color: 'Multicolor', count: 9 }
    ],
    availableSizes: ['12', '14', '16', '18', '20'],
    images: [JEWELRY_IMAGES.rubyRing, JEWELRY_IMAGES.diamondRing],
    stock: 9,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: false,
    isBridal: false,
    rating: 4.7,
    reviewsCount: 16,
    tags: ['navratna', 'rings', 'gemstone', 'vedic', 'gold']
  },
  {
    name: 'Kashmir Royale Colombian Emerald Pendant with 18K Chain',
    slug: 'kashmir-royale-colombian-emerald-pendant-18k-chain',
    sku: 'AUR-GFT-PD-010',
    category: 'Gifts',
    categorySlug: 'gifts',
    price: 68000,
    originalPrice: 75000,
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
    images: [JEWELRY_IMAGES.emeraldPendant, JEWELRY_IMAGES.goldNecklace],
    stock: 14,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['pendant', 'emerald', 'gifts', 'anniversary', 'necklace']
  },
  {
    name: 'Noor Modern 18K Gold Diamond Mangalsutra',
    slug: 'noor-modern-18k-gold-diamond-mangalsutra',
    sku: 'AUR-GLD-MG-011',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 58000,
    originalPrice: 65000,
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
    images: [JEWELRY_IMAGES.mangalsutra, JEWELRY_IMAGES.goldNecklace],
    stock: 11,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    isBridal: true,
    rating: 4.9,
    reviewsCount: 45,
    tags: ['mangalsutra', 'diamond', 'wedding', 'modern', 'gold']
  },
  {
    name: 'Sultan Men’s 22K Solid Gold Lion Signet Ring',
    slug: 'sultan-mens-22k-solid-gold-lion-signet-ring',
    sku: 'AUR-MEN-RG-012',
    category: 'Rings',
    categorySlug: 'rings',
    price: 94000,
    originalPrice: 102000,
    description: 'A commanding men’s signet ring hand-carved in heavy 22KT yellow gold featuring the regal Ashoka lion emblem with matte side fluting.',
    craftsmanshipStory: 'Solid-backed high-comfort band crafted to withstand generations of daily wear.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 14.8,
    netGoldWeight: 14.8,
    gemstones: [],
    availableSizes: ['18', '20', '22', '24'],
    images: [JEWELRY_IMAGES.menGoldRing, JEWELRY_IMAGES.diamondRing],
    stock: 8,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: false,
    isBridal: false,
    gender: 'men',
    rating: 4.8,
    reviewsCount: 22,
    tags: ['men', 'signet', 'rings', 'gold', 'royal']
  },
  {
    name: 'Meenakari Hand-Painted Floral 22K Gold Bangle',
    slug: 'meenakari-hand-painted-floral-22k-gold-bangle',
    sku: 'AUR-GLD-BG-013',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 135000,
    originalPrice: 148000,
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
    images: [JEWELRY_IMAGES.goldKada, JEWELRY_IMAGES.goldBangles],
    stock: 5,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    rating: 4.9,
    reviewsCount: 14,
    tags: ['meenakari', 'bangle', 'gold', 'jaipur', 'enamel']
  },
  {
    name: 'Basra Heritage Natural Pearl & Diamond Choker',
    slug: 'basra-heritage-natural-pearl-diamond-choker',
    sku: 'AUR-BRD-NK-014',
    category: 'Bridal',
    categorySlug: 'bridal',
    price: 295000,
    originalPrice: 320000,
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
    images: [JEWELRY_IMAGES.pearlChoker, JEWELRY_IMAGES.bridalChoker],
    stock: 3,
    isBestseller: false,
    isNewArrival: true,
    isFeatured: true,
    isBridal: true,
    rating: 5.0,
    reviewsCount: 9,
    tags: ['pearl', 'choker', 'bridal', 'white gold', 'vintage']
  },
  {
    name: 'Royal Mughal Ruby & Uncut Diamond Cocktail Ring',
    slug: 'royal-mughal-ruby-uncut-diamond-cocktail-ring',
    sku: 'AUR-GEM-RG-015',
    category: 'Rings',
    categorySlug: 'rings',
    price: 110000,
    originalPrice: 122000,
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
    images: [JEWELRY_IMAGES.rubyRing, JEWELRY_IMAGES.diamondRing],
    stock: 6,
    isBestseller: false,
    isNewArrival: false,
    isFeatured: true,
    isBridal: false,
    rating: 4.8,
    reviewsCount: 19,
    tags: ['ruby', 'polki', 'cocktail ring', 'antique', 'gold']
  },
  {
    name: 'Ananya Everyday 18K Yellow Gold Rope Chain',
    slug: 'ananya-everyday-18k-yellow-gold-rope-chain',
    sku: 'AUR-GLD-CH-016',
    category: 'Gold',
    categorySlug: 'gold',
    price: 42000,
    originalPrice: 46000,
    description: 'A diamond-cut French rope chain crafted in solid 18KT yellow gold. Sparkles with subtle brilliance under natural daylight.',
    craftsmanshipStory: 'Braided using continuous solid links with reinforced lobster claw safety clasp.',
    metal: '18K Yellow Gold',
    purity: '18KT (750 Hallmarked)',
    grossWeight: 7.2,
    netGoldWeight: 7.2,
    gemstones: [],
    availableSizes: ['18 inch', '20 inch', '22 inch'],
    images: [JEWELRY_IMAGES.goldNecklace, JEWELRY_IMAGES.emeraldPendant],
    stock: 20,
    isBestseller: true,
    isNewArrival: false,
    isFeatured: false,
    isBridal: false,
    gender: 'unisex',
    rating: 4.9,
    reviewsCount: 68,
    tags: ['chain', 'rope chain', 'everyday', 'gold', 'minimalist', 'men', 'kids']
  },
  {
    name: 'Aarav Baby 22K Gold Nazariya Evil-Eye Bracelet Pair',
    slug: 'aarav-baby-22k-gold-nazariya-bracelet-pair',
    sku: 'AUR-KID-BG-017',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 24500,
    originalPrice: 28000,
    description: 'Auspicious protective baby nazariya bracelets handcrafted in pure 22KT gold featuring smooth black onyx beads and gentle rounded safety clasps for delicate skin.',
    craftsmanshipStory: 'Engineered specifically for infants and young children with smooth, snag-free gold links and hypoallergenic high-polish finishing.',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: 4.2,
    netGoldWeight: 3.8,
    gemstones: [
      { type: 'Black Onyx Protective Beads', carat: 0.4, clarity: 'Cabochon', color: 'Natural Black', count: 12 }
    ],
    availableSizes: ['Infant (4.5 inch)', 'Toddler (5.0 inch)', 'Child (5.5 inch)'],
    images: [JEWELRY_IMAGES.goldBangles, JEWELRY_IMAGES.goldKada],
    stock: 12,
    isBestseller: true,
    isNewArrival: true,
    isFeatured: true,
    isBridal: false,
    gender: 'kids',
    rating: 5.0,
    reviewsCount: 41,
    tags: ['kids', 'children', 'nazariya', 'bracelet', 'gold', 'baby', 'protection']
  }
];

const couponsData = [
  {
    code: 'RISHILAL10',
    description: '10% Welcome Luxury Privileges on Orders Above ₹10,000',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 10000,
    maxDiscountAmount: 15000,
    isActive: true
  },
  {
    code: 'AURELIA10',
    description: '10% Welcome Luxury Privileges on Orders Above ₹10,000 (Legacy Alias)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 10000,
    maxDiscountAmount: 15000,
    isActive: true
  },
  {
    code: 'BRIDAL5000',
    description: 'Flat ₹5,000 Off on Grand Bridal & Wedding Ensembles',
    discountType: 'fixed',
    discountValue: 5000,
    minOrderValue: 50000,
    isActive: true
  },
  {
    code: 'FESTIVE25',
    description: 'Festive Connoisseur: 25% Off Making Charges (Up to ₹8,000)',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 25000,
    maxDiscountAmount: 8000,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('[Seed] Commencing Rishi Lal Jewellers luxury catalog seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Coupon.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // 1. Seed Categories
    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${seededCategories.length} categories.`);

    // 2. Seed Products
    const seededProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Seeded ${seededProducts.length} luxury jewelry products.`);

    // 3. Seed Demo Users (Admin and Customer)
    // Note: User.pre('save') handles hashing when created individually or through new User()
    const adminUser = new User({
      name: DEMO_ACCOUNTS.ADMIN.name,
      email: DEMO_ACCOUNTS.ADMIN.email,
      password: DEMO_ACCOUNTS.ADMIN.password,
      role: DEMO_ACCOUNTS.ADMIN.role,
      phone: '+91 98200 88990',
      addresses: [
        {
          fullName: 'Rishi Lal Head Curator',
          phone: '+91 98200 88990',
          street: '14 Colaba Causeway',
          apartment: 'Suite 401',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          isDefault: true
        }
      ]
    });
    await adminUser.save();

    const customerUser = new User({
      name: DEMO_ACCOUNTS.CUSTOMER.name,
      email: DEMO_ACCOUNTS.CUSTOMER.email,
      password: DEMO_ACCOUNTS.CUSTOMER.password,
      role: DEMO_ACCOUNTS.CUSTOMER.role,
      phone: '+91 98112 34567',
      addresses: [
        {
          fullName: 'Priya Sharma',
          phone: '+91 98112 34567',
          street: '42 Golf Links',
          apartment: 'Bungalow 7',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110003',
          country: 'India',
          isDefault: true
        }
      ]
    });
    // Add first 2 products to customer's wishlist
    customerUser.wishlist = [seededProducts[0]._id, seededProducts[1]._id];
    await customerUser.save();

    // Legacy demo accounts for seamless backward compatibility during testing
    try {
      const legacyAdmin = new User({
        name: 'Rishi Lal Head Curator',
        email: 'admin@aureliajewels.demo',
        password: 'Admin@123',
        role: 'admin',
        phone: '+91 98200 88990'
      });
      await legacyAdmin.save();

      const legacyCustomer = new User({
        name: 'Priya Sharma',
        email: 'customer@aureliajewels.demo',
        password: 'Customer@123',
        role: 'customer',
        phone: '+91 98112 34567'
      });
      await legacyCustomer.save();
    } catch (e) {
      // Ignored if duplicate
    }

    console.log('[Seed] Seeded verified demo accounts:');
    console.log(`       Admin:    ${DEMO_ACCOUNTS.ADMIN.email} / ${DEMO_ACCOUNTS.ADMIN.password}`);
    console.log(`       Customer: ${DEMO_ACCOUNTS.CUSTOMER.email} / ${DEMO_ACCOUNTS.CUSTOMER.password}`);

    // 4. Seed Coupons
    const seededCoupons = await Coupon.insertMany(couponsData);
    console.log(`[Seed] Seeded ${seededCoupons.length} promotional coupons.`);

    // 5. Seed Realistic Orders
    const sampleOrders = [
      {
        orderNumber: 'RLJ-20261012-78412',
        user: customerUser._id,
        customerDetails: {
          name: customerUser.name,
          email: customerUser.email,
          phone: customerUser.phone
        },
        shippingAddress: customerUser.addresses[0],
        items: [
          {
            product: seededProducts[1]._id,
            name: seededProducts[1].name,
            sku: seededProducts[1].sku,
            image: seededProducts[1].images[0],
            price: seededProducts[1].price,
            quantity: 1,
            selectedSize: '14',
            metal: seededProducts[1].metal,
            purity: seededProducts[1].purity,
            grossWeight: seededProducts[1].grossWeight
          }
        ],
        subtotal: seededProducts[1].price,
        tax: Math.round(seededProducts[1].price * 0.03),
        discount: 15000,
        couponApplied: 'RISHILAL10',
        shippingCharges: 0,
        totalAmount: seededProducts[1].price + Math.round(seededProducts[1].price * 0.03) - 15000,
        paymentMethod: 'card',
        paymentStatus: 'completed',
        orderStatus: 'shipped',
        estimatedDelivery: 'Tomorrow by 2:00 PM IST',
        trackingNumber: 'IND-EXP-4891230',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000)
      },
      {
        orderNumber: 'RLJ-20261010-34981',
        user: customerUser._id,
        customerDetails: {
          name: customerUser.name,
          email: customerUser.email,
          phone: customerUser.phone
        },
        shippingAddress: customerUser.addresses[0],
        items: [
          {
            product: seededProducts[2]._id,
            name: seededProducts[2].name,
            sku: seededProducts[2].sku,
            image: seededProducts[2].images[0],
            price: seededProducts[2].price,
            quantity: 1,
            selectedSize: 'Standard',
            metal: seededProducts[2].metal,
            purity: seededProducts[2].purity,
            grossWeight: seededProducts[2].grossWeight
          }
        ],
        subtotal: seededProducts[2].price,
        tax: Math.round(seededProducts[2].price * 0.03),
        discount: 0,
        shippingCharges: 0,
        totalAmount: seededProducts[2].price + Math.round(seededProducts[2].price * 0.03),
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        trackingNumber: 'IND-EXP-1120498',
        createdAt: new Date(Date.now() - 96 * 3600 * 1000)
      },
      {
        orderNumber: 'RLJ-20261013-91204',
        user: null, // Guest checkout
        customerDetails: {
          name: 'Rajesh Singhania',
          email: 'rajesh.singhania@heritage.in',
          phone: '+91 99887 76655'
        },
        shippingAddress: {
          fullName: 'Rajesh Singhania',
          phone: '+91 99887 76655',
          street: '18 Malabar Hill Crescent',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400006',
          country: 'India'
        },
        items: [
          {
            product: seededProducts[0]._id,
            name: seededProducts[0].name,
            sku: seededProducts[0].sku,
            image: seededProducts[0].images[0],
            price: seededProducts[0].price,
            quantity: 1,
            selectedSize: 'Adjustable Dori',
            metal: seededProducts[0].metal,
            purity: seededProducts[0].purity,
            grossWeight: seededProducts[0].grossWeight
          }
        ],
        subtotal: seededProducts[0].price,
        tax: Math.round(seededProducts[0].price * 0.03),
        discount: 5000,
        couponApplied: 'BRIDAL5000',
        shippingCharges: 0,
        totalAmount: seededProducts[0].price + Math.round(seededProducts[0].price * 0.03) - 5000,
        paymentMethod: 'netbanking',
        paymentStatus: 'completed',
        orderStatus: 'confirmed',
        estimatedDelivery: '3 to 5 Business Days',
        trackingNumber: 'IND-EXP-9943210',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000)
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`[Seed] Seeded ${sampleOrders.length} realistic historical and active orders.`);

    console.log('[Seed] ✨ Database successfully seeded with luxury collections!');
    return true;
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    throw err;
  }
}

// If run directly via `node src/seeds/seed.js`
if (require.main === module) {
  connectDB()
    .then(seedDatabase)
    .then(() => {
      console.log('[Seed] Finished. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;

