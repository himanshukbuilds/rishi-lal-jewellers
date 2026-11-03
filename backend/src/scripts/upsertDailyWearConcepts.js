require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');

const concepts = [
  ['Minimal Gold Chain Necklace', 'RLJ-DWY-N-001', 'minimal-gold-chain-necklace-concept', 12999, 'Gold', 'Necklace', 'Minimal Chain', 'minimal-gold-chain-necklace.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Everyday Heart Pendant Necklace', 'RLJ-DWY-N-002', 'everyday-heart-pendant-necklace-concept', 9999, 'Gold', 'Necklace', 'Heart Pendant', 'everyday-heart-pendant-necklace.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Gold Circle Pendant Necklace', 'RLJ-DWY-N-003', 'gold-circle-pendant-necklace-concept', 11999, 'Gold', 'Necklace', 'Circle Pendant', 'gold-circle-pendant-necklace.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Minimal Diamond Pendant Necklace', 'RLJ-DWY-N-004', 'minimal-diamond-pendant-necklace-concept', 24999, 'Diamond', 'Necklace', 'Diamond Pendant', 'minimal-diamond-pendant-necklace.jpg', 'Setting metal and stone details not verified — concept only'],
  ['Layered Gold Chain Necklace', 'RLJ-DWY-N-005', 'layered-gold-chain-necklace-concept', 18999, 'Gold', 'Necklace', 'Layered Chain', 'layered-gold-chain-necklace.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Pearl Pendant Necklace', 'RLJ-DWY-N-006', 'pearl-pendant-necklace-concept', 7999, 'Gold', 'Necklace', 'Pearl Pendant', 'pearl-pendant-necklace.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Small Gold Hoop Earrings', 'RLJ-DWY-E-001', 'small-gold-hoop-earrings-concept', 6999, 'Gold', 'Earrings', 'Small Hoops', 'small-gold-hoop-earrings.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Minimal Gold Stud Earrings', 'RLJ-DWY-E-002', 'minimal-gold-stud-earrings-concept', 4999, 'Gold', 'Earrings', 'Minimal Studs', 'minimal-gold-stud-earrings.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Tiny Diamond Stud Earrings', 'RLJ-DWY-E-003', 'tiny-diamond-stud-earrings-concept', 14999, 'Diamond', 'Earrings', 'Diamond Studs', 'tiny-diamond-stud-earrings.jpg', 'Setting metal and stone details not verified — concept only'],
  ['Everyday Pearl Stud Earrings', 'RLJ-DWY-E-004', 'everyday-pearl-stud-earrings-concept', 3999, 'Gold', 'Earrings', 'Pearl Studs', 'everyday-pearl-stud-earrings.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Minimal Gold Drop Earrings', 'RLJ-DWY-E-005', 'minimal-gold-drop-earrings-concept', 8999, 'Gold', 'Earrings', 'Minimal Drops', 'minimal-gold-drop-earrings.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Small Silver Hoop Earrings', 'RLJ-DWY-E-006', 'small-silver-hoop-earrings-concept', 1999, 'Silver', 'Earrings', 'Silver Hoops', 'small-silver-hoop-earrings.jpg', 'Silver-tone concept — material and purity not verified'],
  ['Minimal Gold Band Ring', 'RLJ-DWY-R-001', 'minimal-gold-band-ring-concept', 9999, 'Gold', 'Rings', 'Minimal Band', 'minimal-gold-band-ring.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Delicate Heart Gold Ring', 'RLJ-DWY-R-002', 'delicate-heart-gold-ring-concept', 8999, 'Gold', 'Rings', 'Heart Ring', 'delicate-heart-gold-ring.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Everyday Diamond Ring', 'RLJ-DWY-R-003', 'everyday-diamond-ring-concept', 19999, 'Diamond', 'Rings', 'Diamond Ring', 'everyday-diamond-ring.jpg', 'Setting metal and stone details not verified — concept only'],
  ['Minimal Rose Gold Ring', 'RLJ-DWY-R-004', 'minimal-rose-gold-ring-concept', 7999, 'Gold', 'Rings', 'Rose Gold Ring', 'minimal-rose-gold-ring.jpg', 'Rose-gold-tone concept — actual alloy and purity not verified'],
  ['Adjustable Silver Ring', 'RLJ-DWY-R-005', 'adjustable-silver-ring-concept', 1499, 'Silver', 'Rings', 'Adjustable Ring', 'adjustable-silver-ring.jpg', 'Silver-tone concept — material and purity not verified'],
  ['Simple Stackable Gold Ring', 'RLJ-DWY-R-006', 'simple-stackable-gold-ring-concept', 6999, 'Gold', 'Rings', 'Stackable Band', 'simple-stackable-gold-ring.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Lightweight Gold Bracelet', 'RLJ-DWY-B-001', 'lightweight-gold-bracelet-concept', 14999, 'Gold', 'Bracelets', 'Lightweight Bracelet', 'lightweight-gold-bracelet.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Minimal Gold Kada', 'RLJ-DWY-B-002', 'minimal-gold-kada-concept', 19999, 'Gold', 'Bangles', 'Minimal Kada', 'minimal-gold-kada.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Everyday Gold Bangle', 'RLJ-DWY-B-003', 'everyday-gold-bangle-concept', 16999, 'Gold', 'Bangles', 'Everyday Bangle', 'everyday-gold-bangle.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Delicate Diamond Bracelet', 'RLJ-DWY-B-004', 'delicate-diamond-bracelet-concept', 29999, 'Diamond', 'Bracelets', 'Diamond Bracelet', 'delicate-diamond-bracelet.jpg', 'Setting metal and stone details not verified — concept only'],
  ['Minimal Silver Bracelet', 'RLJ-DWY-B-005', 'minimal-silver-bracelet-concept', 2999, 'Silver', 'Bracelets', 'Silver Bracelet', 'minimal-silver-bracelet.jpg', 'Silver-tone concept — material and purity not verified'],
  ['Rose Gold Chain Bracelet', 'RLJ-DWY-B-006', 'rose-gold-chain-bracelet-concept', 5999, 'Gold', 'Bracelets', 'Rose Gold Bracelet', 'rose-gold-chain-bracelet.jpg', 'Rose-gold-tone concept — actual alloy and purity not verified'],
  ['Minimal Gold Mangalsutra', 'RLJ-DWY-O-001', 'minimal-gold-mangalsutra-concept', 14999, 'Gold', 'Necklace', 'Mangalsutra', 'minimal-gold-mangalsutra.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Small Geometric Pendant', 'RLJ-DWY-O-002', 'small-geometric-pendant-concept', 6999, 'Gold', 'Necklace', 'Geometric Pendant', 'small-geometric-pendant.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Modern Pearl Drop Earrings', 'RLJ-DWY-O-003', 'modern-pearl-drop-earrings-concept', 4999, 'Gold', 'Earrings', 'Pearl Drops', 'modern-pearl-drop-earrings.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Delicate Anklet', 'RLJ-DWY-O-004', 'delicate-anklet-concept', 2499, 'Gold', 'Other', 'Anklet', 'delicate-anklet.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Minimal Gold Chain Bracelet', 'RLJ-DWY-O-005', 'minimal-gold-chain-bracelet-concept', 8999, 'Gold', 'Bracelets', 'Chain Bracelet', 'minimal-gold-chain-bracelet.jpg', 'Gold-tone concept — material and purity not verified'],
  ['Everyday Floral Pendant Set', 'RLJ-DWY-O-006', 'everyday-floral-pendant-set-concept', 16999, 'Gold', 'Other', 'Pendant Set', 'everyday-floral-pendant-set.jpg', 'Gold-tone concept — material and purity not verified'],
].map(([name, sku, slug, price, metalType, subcategory, style, image, metal]) => ({
  name, sku, slug, price,
  category: 'Daily Wear', categorySlug: 'daily-wear',
  description: `${name} is an AI-generated illustrative concept for lightweight everyday jewellery. It is not confirmed physical inventory. Material, purity, weight and any stone specifications must be verified by Rishi Lal Jewellers. This indicative catalogue price is not a supplier price, market valuation or final quotation; contact the business to confirm specifications and price before ordering.`,
  craftsmanshipStory: 'Original AI-generated daily-wear concept image; illustrative design only, not proof of a manufactured or stocked product.',
  metal, metalType, purity: 'Not verified — AI concept only', grossWeight: 0, stock: 0,
  images: [`/images/daily-wear/${image}`],
  imageType: 'AI-Generated Concept Image',
  imageSource: 'Original AI-generated illustrative concept image created for the Rishi Lal Jewellers Casual & Daily Wear catalogue.',
  imageRights: 'AI-generated illustrative concept; not a real product photograph or proof of stocked inventory.',
  pricingType: 'indicative', availability: 'design-enquiry',
  certification: 'No hallmark, metal purity, gemstone specification or certification verified — concept only.',
  subcategory, tags: ['daily-wear', 'casual-wear', 'everyday', 'ai-concept', style.toLowerCase().replaceAll(' ', '-')],
  isPublished: true, isNewArrival: true,
}));

async function main() {
  const fs = require('fs');
  const path = require('path');
  const paths = new Set();
  for (const product of concepts) {
    if (paths.has(product.images[0])) throw new Error(`Duplicate image path: ${product.images[0]}`);
    paths.add(product.images[0]);
    const file = path.resolve(__dirname, '../../../frontend/public', `.${product.images[0]}`);
    if (!fs.existsSync(file)) throw new Error(`Missing image asset: ${file}`);
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 7000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') throw new Error(`Refusing write: connected database is ${mongoose.connection.name}`);

  let inserted = 0;
  let alreadyPresent = 0;
  for (const product of concepts) {
    const result = await Product.updateOne(
      { $or: [{ sku: product.sku }, { slug: product.slug }] },
      { $setOnInsert: product },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
    else alreadyPresent += 1;
  }

  const verified = await Product.find({ sku: { $in: concepts.map((product) => product.sku) } })
    .select('name sku slug price category categorySlug metalType subcategory pricingType availability stock images imageType isPublished')
    .lean();
  const bySku = new Map(verified.map((product) => [product.sku, product]));
  const invalid = concepts.filter((seed) => {
    const product = bySku.get(seed.sku);
    return !product || product.name !== seed.name || product.slug !== seed.slug || product.images?.[0] !== seed.images[0] || product.price !== seed.price || product.category !== 'Daily Wear' || product.categorySlug !== 'daily-wear' || product.metalType !== seed.metalType || product.subcategory !== seed.subcategory || product.pricingType !== 'indicative' || product.availability !== 'design-enquiry' || product.stock !== 0 || product.imageType !== 'AI-Generated Concept Image' || !product.isPublished;
  });
  if (invalid.length) throw new Error(`Verification failed for SKUs: ${invalid.map((product) => product.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, collection: Product.collection.name, inserted, alreadyPresent, verified: verified.length, invalid: 0 }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
