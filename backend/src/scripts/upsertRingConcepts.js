require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');

const concepts = [
  ['Classic 22K Gold Ring', 'RLJ-RNG-G-001', 'classic-22k-gold-ring-concept', 24999, 'Gold', 'Classic', 'gold-classic-22k-ring.png', 'Gold concept — purity and alloy not verified'],
  ['Traditional Gold Ring', 'RLJ-RNG-G-002', 'traditional-gold-ring-concept', 19999, 'Gold', 'Traditional', 'gold-traditional-ring.png', 'Gold concept — purity and alloy not verified'],
  ["Men's Gold Band Ring", 'RLJ-RNG-G-003', 'mens-gold-band-ring-concept', 34999, 'Gold', "Men's Band", 'gold-mens-band-ring.png', 'Gold concept — purity and alloy not verified'],
  ["Women's Daily Wear Gold Ring", 'RLJ-RNG-G-004', 'womens-daily-wear-gold-ring-concept', 12999, 'Gold', 'Daily Wear', 'gold-dailywear-womens-ring.png', 'Gold concept — purity and alloy not verified'],
  ['Floral Gold Ring', 'RLJ-RNG-G-005', 'floral-gold-ring-concept', 22999, 'Gold', 'Floral', 'gold-floral-ring.png', 'Gold concept — purity and alloy not verified'],
  ['Antique Gold Ring', 'RLJ-RNG-G-006', 'antique-gold-ring-concept', 29999, 'Gold', 'Antique', 'gold-antique-ring.png', 'Gold concept — purity and alloy not verified'],
  ['Gold Solitaire Ring', 'RLJ-RNG-G-007', 'gold-solitaire-ring-concept', 39999, 'Gold', 'Solitaire', 'gold-solitaire-ring.png', 'Gold concept — purity and alloy not verified'],
  ['Classic Diamond Engagement Ring', 'RLJ-RNG-D-001', 'classic-diamond-engagement-ring-concept', 49999, 'Diamond', 'Engagement', 'diamond-engagement-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Solitaire Diamond Ring', 'RLJ-RNG-D-002', 'solitaire-diamond-ring-concept', 69999, 'Diamond', 'Solitaire', 'diamond-solitaire-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Princess Cut Diamond Ring', 'RLJ-RNG-D-003', 'princess-cut-diamond-ring-concept', 59999, 'Diamond', 'Princess Cut', 'diamond-princess-cut-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Oval Diamond Ring', 'RLJ-RNG-D-004', 'oval-diamond-ring-concept', 64999, 'Diamond', 'Oval', 'diamond-oval-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Halo Diamond Ring', 'RLJ-RNG-D-005', 'halo-diamond-ring-concept', 74999, 'Diamond', 'Halo', 'diamond-halo-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Three-Stone Diamond Ring', 'RLJ-RNG-D-006', 'three-stone-diamond-ring-concept', 79999, 'Diamond', 'Three Stone', 'diamond-three-stone-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Diamond Wedding Ring', 'RLJ-RNG-D-007', 'diamond-wedding-ring-concept', 54999, 'Diamond', 'Wedding Band', 'diamond-wedding-ring.png', 'Setting metal and stone details not verified — concept only'],
  ['Traditional Silver Ring', 'RLJ-RNG-S-001', 'traditional-silver-ring-concept', 2999, 'Silver', 'Traditional', 'silver-traditional-ring.png', 'Silver concept — purity and alloy not verified'],
  ['Minimal Silver Band Ring', 'RLJ-RNG-S-002', 'minimal-silver-band-ring-concept', 1999, 'Silver', 'Minimal Band', 'silver-minimal-band-ring.png', 'Silver concept — purity and alloy not verified'],
  ['Oxidised Silver Ring', 'RLJ-RNG-S-003', 'oxidised-silver-ring-concept', 1499, 'Silver', 'Oxidised', 'silver-oxidised-ring.png', 'Silver concept — purity and alloy not verified'],
  ['Designer Silver Ring', 'RLJ-RNG-S-004', 'designer-silver-ring-concept', 3999, 'Silver', 'Designer', 'silver-designer-ring.png', 'Silver concept — purity and alloy not verified'],
  ['Rose Gold Couple Ring', 'RLJ-RNG-R-001', 'rose-gold-couple-ring-concept', 14999, 'Gold', 'Rose Gold Couple', 'rose-gold-couple-ring.png', 'Rose-gold-tone concept — actual alloy and purity not verified'],
  ['Platinum Finish Designer Ring', 'RLJ-RNG-P-001', 'platinum-finish-designer-ring-concept', 9999, 'Gold', 'Platinum Finish', 'platinum-finish-designer-ring.png', 'Platinum-finish concept — actual metal and purity not verified'],
].map(([name, sku, slug, price, metalType, subcategory, image, metal]) => ({
  name, sku, slug, price,
  category: 'Rings', categorySlug: 'rings',
  description: `${name} is an AI-generated illustrative jewellery concept. It is not confirmed physical inventory. The actual material, purity, weight, gemstone identity and specifications must be verified. This indicative catalogue price is not a supplier quote or final quotation; contact Rishi Lal Jewellers to confirm details before placing an order.`,
  craftsmanshipStory: 'Original AI-generated concept image; illustrative design only, not proof of a manufactured or stocked product.',
  metal, metalType,
  purity: 'Not verified — AI concept only', grossWeight: 0, stock: 0,
  images: [`/images/rings/${image}`],
  imageType: 'AI-Generated Concept Image',
  imageSource: 'Original AI-generated illustrative ring concept created for the Rishi Lal Jewellers catalogue.',
  imageRights: 'AI-generated illustrative concept; not a real product photograph or proof of stocked inventory.',
  pricingType: 'indicative', availability: 'design-enquiry',
  certification: 'No hallmark, gemstone specification or certification verified — concept only.',
  subcategory,
  tags: ['ring', 'rings', metalType.toLowerCase(), subcategory.toLowerCase().replaceAll(' ', '-'), 'ai-concept'],
  isPublished: true, isNewArrival: true,
}));

async function main() {
  const fs = require('fs');
  const path = require('path');
  for (const product of concepts) {
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
    .select('name sku slug price pricingType availability stock images imageType metalType isPublished')
    .lean();
  const bySku = new Map(verified.map((product) => [product.sku, product]));
  const invalid = concepts.filter((seed) => {
    const product = bySku.get(seed.sku);
    return !product || product.slug !== seed.slug || product.images?.[0] !== seed.images[0] || product.price !== seed.price || product.pricingType !== 'indicative' || product.availability !== 'design-enquiry' || product.stock !== 0 || product.imageType !== 'AI-Generated Concept Image' || !product.isPublished;
  });
  if (invalid.length) throw new Error(`Verification failed for SKUs: ${invalid.map((product) => product.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, collection: Product.collection.name, inserted, alreadyPresent, verified: verified.length, invalid: 0 }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
