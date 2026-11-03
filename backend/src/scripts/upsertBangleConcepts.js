require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');

const products = [
  ['Traditional Gold Bangles', 'RLJ-BNG-G-001', 'traditional-gold-bangles', 54999, 'Gold', 'Traditional', '/images/bangles/gold-traditional-bangles.png'],
  ['Bridal Heavy Gold Bangles', 'RLJ-BNG-G-002', 'bridal-heavy-gold-bangles', 149999, 'Gold', 'Bridal', '/images/bangles/gold-bridal-bangles.png'],
  ['Lightweight Daily Wear Gold Bangles', 'RLJ-BNG-G-003', 'lightweight-daily-wear-gold-bangles', 29999, 'Gold', 'Daily Wear', '/images/bangles/gold-dailywear-bangles.png'],
  ['Temple Gold Bangles', 'RLJ-BNG-G-004', 'temple-gold-bangles', 89999, 'Gold', 'Temple', '/images/bangles/gold-temple-bangles.png'],
  ['Antique Gold Bangles', 'RLJ-BNG-G-005', 'antique-gold-bangles', 69999, 'Gold', 'Antique', '/images/bangles/gold-antique-bangles.png'],
  ['Gold Kada Bangles', 'RLJ-BNG-G-006', 'gold-kada-bangles', 74999, 'Gold', 'Kada', '/images/bangles/gold-kada-bangles.png'],
  ['Designer Gold Bangles', 'RLJ-BNG-G-007', 'designer-gold-bangles', 99999, 'Gold', 'Designer', '/images/bangles/gold-designer-bangles.png'],
  ['Diamond Gold Bangles', 'RLJ-BNG-D-001', 'diamond-gold-bangles', 119999, 'Diamond', 'Diamond', '/images/bangles/diamond-gold-bangles.png'],
  ['Diamond Studded Bangles', 'RLJ-BNG-D-002', 'diamond-studded-bangles', 179999, 'Diamond', 'Diamond', '/images/bangles/diamond-studded-bangles.png'],
  ['Minimal Diamond Bangles', 'RLJ-BNG-D-003', 'minimal-diamond-bangles', 64999, 'Diamond', 'Daily Wear', '/images/bangles/diamond-minimal-bangles.png'],
  ['Solitaire Diamond Bangles', 'RLJ-BNG-D-004', 'solitaire-diamond-bangles', 139999, 'Diamond', 'Diamond', '/images/bangles/diamond-solitaire-bangles.png'],
  ['Traditional Silver Bangles', 'RLJ-BNG-S-001', 'traditional-silver-bangles', 4999, 'Silver', 'Traditional', '/images/bangles/silver-traditional-bangles.png'],
  ['Oxidised Silver Bangles', 'RLJ-BNG-S-002', 'oxidised-silver-bangles', 3499, 'Silver', 'Oxidised', '/images/bangles/silver-oxidised-bangles.png'],
  ['Designer Silver Bangles', 'RLJ-BNG-S-003', 'designer-silver-bangles', 6999, 'Silver', 'Designer', '/images/bangles/silver-designer-bangles.png'],
  ['Silver Kada Bangles', 'RLJ-BNG-S-004', 'silver-kada-bangles', 8999, 'Silver', 'Kada', '/images/bangles/silver-kada-bangles.png'],
].map(([name, sku, slug, price, metalType, subcategory, image]) => ({
  name, sku, slug, price,
  category: 'Bangles', categorySlug: 'bangles',
  description: `${name} is an AI-generated illustrative design concept. The pictured item is not confirmed physical inventory. Materials, purity, weight, stone specifications, final approved price and availability must be verified by Rishi Lal Jewellers before any order is accepted.`,
  craftsmanshipStory: 'Illustrative AI-generated jewellery design concept. This record is not a claim of a stocked or manufactured item.',
  metalType, metal: `${metalType} concept — material not verified`, purity: 'Not verified — AI concept only',
  grossWeight: 0, stock: 0, images: [image], imageType: 'AI-Generated Concept Image',
  imageSource: 'Original AI-generated concept image created for Rishi Lal Jewellers catalogue.',
  imageRights: 'AI-generated illustrative concept; not a real product photograph or proof of stocked inventory.',
  pricingType: 'indicative', availability: 'design-enquiry', certification: 'No hallmark or certification verified — concept only.',
  subcategory, tags: ['bangle', 'bangles', metalType.toLowerCase(), subcategory.toLowerCase(), 'ai-concept'],
  isPublished: true, isBridal: subcategory === 'Bridal', isNewArrival: true,
}));

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 7000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') throw new Error(`Refusing write: connected database is ${mongoose.connection.name}`);
  const fs = require('fs');
  const path = require('path');
  for (const product of products) {
    const file = path.resolve(__dirname, '../../../frontend/public', `.${product.images[0]}`);
    if (!fs.existsSync(file)) throw new Error(`Missing image asset: ${file}`);
  }
  let inserted = 0;
  let existing = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { $or: [{ sku: product.sku }, { slug: product.slug }] },
      { $setOnInsert: product },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
    else existing += 1;
  }
  const verified = await Product.find({ sku: { $in: products.map((product) => product.sku) } })
    .select('name sku slug price pricingType availability stock images imageType isPublished')
    .lean();
  const bySku = new Map(verified.map((product) => [product.sku, product]));
  const invalid = products.filter((seed) => {
    const record = bySku.get(seed.sku);
    return !record || record.slug !== seed.slug || record.images?.[0] !== seed.images[0] || record.price !== seed.price || record.pricingType !== 'indicative' || record.availability !== 'design-enquiry' || record.stock !== 0 || record.imageType !== 'AI-Generated Concept Image' || !record.isPublished;
  });
  if (invalid.length) throw new Error(`Verification failed for SKUs: ${invalid.map((p) => p.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, inserted, alreadyPresent: existing, verified: verified.length, invalid: 0 }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
