require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/constants');
const Product = require('../models/Product');

const conceptDescription = (name, material) =>
  `${name} is an AI-generated ${material} necklace concept created for visual exploration. This image is illustrative only and does not represent a confirmed stocked product. Actual materials, purity, weight, design, certification, availability and price must be verified with Rishi Lal Jewellers before an order can be placed.`;

const concepts = [
  { name: 'Heritage Filigree Traditional Gold Necklace Concept', slug: 'heritage-filigree-traditional-gold-necklace-concept', sku: 'RLJ-NCK-G-001', metalType: 'Gold', metal: 'Gold concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-temple-necklace.png', tag: 'traditional' },
  { name: 'Rajwada Bridal Gold Necklace Concept', slug: 'rajwada-bridal-gold-necklace-concept', sku: 'RLJ-NCK-G-002', metalType: 'Gold', metal: 'Gold concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-bridal-necklace.png', tag: 'bridal' },
  { name: 'Lakshmi Temple Gold Necklace Concept', slug: 'lakshmi-temple-gold-necklace-concept', sku: 'RLJ-NCK-G-003', metalType: 'Gold', metal: 'Gold concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-temple-necklace-detail.png', tag: 'temple' },
  { name: 'Saanjh Lightweight Daily Wear Gold Necklace Concept', slug: 'saanjh-lightweight-dailywear-gold-necklace-concept', sku: 'RLJ-NCK-G-004', metalType: 'Gold', metal: 'Gold concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-dailywear-necklace.png', tag: 'daily-wear' },
  { name: 'Antique Engraved Gold Necklace Concept', slug: 'antique-engraved-gold-necklace-concept', sku: 'RLJ-NCK-G-005', metalType: 'Gold', metal: 'Gold concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/gold-antique-01.png', tag: 'antique' },
  { name: 'Noor Diamond Necklace Concept', slug: 'noor-diamond-necklace-concept', sku: 'RLJ-NCK-D-001', metalType: 'Diamond', metal: 'Setting metal not verified — AI concept only', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-diamond-necklace.png', tag: 'diamond' },
  { name: 'Aarohi Solitaire Necklace Concept', slug: 'aarohi-solitaire-necklace-concept', sku: 'RLJ-NCK-D-002', metalType: 'Diamond', metal: 'Setting metal not verified — AI concept only', purity: 'Not verified — AI concept only', image: '/images/necklaces/diamond-solitaire-01.png', tag: 'solitaire' },
  { name: 'Meher Diamond Pendant Necklace Concept', slug: 'meher-diamond-pendant-necklace-concept', sku: 'RLJ-NCK-D-003', metalType: 'Diamond', metal: 'Setting metal not verified — AI concept only', purity: 'Not verified — AI concept only', image: '/images/necklaces/diamond-pendant-01.png', tag: 'pendant' },
  { name: 'Chandrika Traditional Silver Necklace Concept', slug: 'chandrika-traditional-silver-necklace-concept', sku: 'RLJ-NCK-S-001', metalType: 'Silver', metal: 'Silver concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/silver-traditional-01.png', tag: 'traditional' },
  { name: 'Ruh Oxidised Silver Necklace Concept', slug: 'ruh-oxidised-silver-necklace-concept', sku: 'RLJ-NCK-S-002', metalType: 'Silver', metal: 'Silver concept; metal and purity not verified', purity: 'Not verified — AI concept only', image: '/images/necklaces/ai-silver-necklace.png', tag: 'oxidised' },
];

async function main() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 12000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') {
    throw new Error(`Refusing to write: connected database is "${mongoose.connection.name}", expected "rishi_lal_jewellers".`);
  }

  let inserted = 0;
  let existing = 0;
  for (const item of concepts) {
    const { name, slug, sku, metalType, metal, purity, image, tag } = item;
    const record = {
      name,
      slug,
      sku,
      category: 'Necklaces',
      categorySlug: 'necklaces',
      price: 0,
      originalPrice: undefined,
      description: conceptDescription(name, metalType.toLowerCase()),
      metal,
      metalType,
      purity,
      grossWeight: 0,
      stock: 0,
      images: [image],
      imageType: 'AI-Generated Concept Image',
      imageSource: 'Original AI-generated image asset in frontend/public/images/necklaces/',
      imageRights: 'AI-generated illustrative concept; not a real product photograph.',
      pricingType: 'price-on-request',
      certification: 'Not applicable — concept only; no certification verified.',
      isPublished: true,
      isBestseller: false,
      isNewArrival: false,
      isFeatured: false,
      isBridal: tag === 'bridal',
      tags: ['necklace', metalType.toLowerCase(), tag, 'ai-concept', 'illustrative-only'],
    };
    const result = await Product.updateOne(
      { $or: [{ sku }, { slug }] },
      { $setOnInsert: record },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
    else existing += 1;
  }

  const verified = await Product.find({ slug: { $in: concepts.map((item) => item.slug) } })
    .select('name slug sku metalType imageType images pricingType availability stock isPublished')
    .sort({ sku: 1 })
    .lean();
  const verifiedSlugs = new Set(verified.map((product) => product.slug));
  const missing = concepts.filter((item) => !verifiedSlugs.has(item.slug));
  if (missing.length) throw new Error(`Verification failed; missing: ${missing.map((item) => item.slug).join(', ')}`);
  if (verified.some((product) => product.imageType !== 'AI-Generated Concept Image' || !['price-on-request', 'indicative'].includes(product.pricingType) || product.stock !== 0 || product.isPublished !== true || (product.pricingType === 'indicative' && product.availability !== 'design-enquiry'))) {
    throw new Error('Verification failed: a concept record has unexpected publication, price, or inventory fields.');
  }

  console.log(JSON.stringify({ database: mongoose.connection.name, requested: concepts.length, verified: verified.length, inserted, updated: 0, existingSkipped: existing, records: verified }, null, 2));
}

main().catch((error) => {
  console.error(`[necklace-concepts] ${error.message}`);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect().catch(() => {});
});
