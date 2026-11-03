require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');

const products = [
  ['Traditional Gold Jhumka Earrings', 'RLJ-ERR-G-001', 'traditional-gold-jhumka-earrings', 24999, 'Gold', 'Traditional Jhumka', '/images/earrings/gold-traditional-jhumka-01.png'],
  ['Bridal Heavy Gold Earrings', 'RLJ-ERR-G-002', 'bridal-heavy-gold-earrings', 64999, 'Gold', 'Bridal', '/images/earrings/gold-bridal-heavy-01.png'],
  ['Lightweight Daily Wear Gold Studs', 'RLJ-ERR-G-003', 'lightweight-daily-wear-gold-studs', 8999, 'Gold', 'Daily Wear Studs', '/images/earrings/gold-dailywear-studs-01.png'],
  ['Gold Hoop Earrings', 'RLJ-ERR-G-004', 'gold-hoop-earrings', 14999, 'Gold', 'Hoops', '/images/earrings/gold-hoop-01.png'],
  ['Gold Drop Earrings', 'RLJ-ERR-G-005', 'gold-drop-earrings', 19999, 'Gold', 'Drops', '/images/earrings/gold-drop-01.png'],
  ['Temple Design Gold Earrings', 'RLJ-ERR-G-006', 'temple-design-gold-earrings', 34999, 'Gold', 'Temple', '/images/earrings/gold-temple-01.png'],
  ['Antique Gold Earrings', 'RLJ-ERR-G-007', 'antique-gold-earrings', 27999, 'Gold', 'Antique', '/images/earrings/gold-antique-01.png'],
  ['Diamond Stud Earrings', 'RLJ-ERR-D-001', 'diamond-stud-earrings-concept', 29999, 'Diamond', 'Studs', '/images/earrings/diamond-stud-01.png'],
  ['Solitaire Diamond Earrings', 'RLJ-ERR-D-002', 'solitaire-diamond-earrings-concept', 49999, 'Diamond', 'Solitaire', '/images/earrings/diamond-solitaire-01.png'],
  ['Diamond Drop Earrings', 'RLJ-ERR-D-003', 'diamond-drop-earrings-concept', 54999, 'Diamond', 'Drops', '/images/earrings/diamond-drop-01.png'],
  ['Diamond Hoop Earrings', 'RLJ-ERR-D-004', 'diamond-hoop-earrings-concept', 39999, 'Diamond', 'Hoops', '/images/earrings/diamond-hoop-01.png'],
  ['Floral Diamond Earrings', 'RLJ-ERR-D-005', 'floral-diamond-earrings-concept', 44999, 'Diamond', 'Floral', '/images/earrings/diamond-floral-01.png'],
  ['Traditional Silver Jhumka Earrings', 'RLJ-ERR-S-001', 'traditional-silver-jhumka-earrings', 3999, 'Silver', 'Traditional Jhumka', '/images/earrings/silver-traditional-jhumka-01.png'],
  ['Oxidised Silver Earrings', 'RLJ-ERR-S-002', 'oxidised-silver-earrings', 2499, 'Silver', 'Oxidised', '/images/earrings/silver-oxidised-01.png'],
  ['Silver Hoop Earrings', 'RLJ-ERR-S-003', 'silver-hoop-earrings', 1999, 'Silver', 'Hoops', '/images/earrings/silver-hoop-01.png'],
  ['Silver Stud Earrings', 'RLJ-ERR-S-004', 'silver-stud-earrings', 1499, 'Silver', 'Studs', '/images/earrings/silver-stud-01.png'],
  ['Pearl Drop Earrings', 'RLJ-ERR-P-001', 'pearl-drop-earrings-concept', 5999, 'Gold', 'Pearl Drops', '/images/earrings/pearl-drop-01.png'],
  ['Kundan Bridal Earrings', 'RLJ-ERR-K-001', 'kundan-bridal-earrings-concept', 18999, 'Gold', 'Kundan Bridal', '/images/earrings/kundan-bridal-01.png'],
  ['Polki Designer Earrings', 'RLJ-ERR-P-002', 'polki-designer-earrings-concept', 34999, 'Diamond', 'Polki Designer', '/images/earrings/polki-designer-01.png'],
  ['Rose Gold Designer Earrings', 'RLJ-ERR-R-001', 'rose-gold-designer-earrings-concept', 16999, 'Gold', 'Rose Gold Designer', '/images/earrings/rose-gold-designer-01.png'],
].map(([name, sku, slug, price, metalType, subcategory, image]) => ({
  name, sku, slug, price,
  category: 'Earrings', categorySlug: 'earrings',
  description: `${name} is an AI-generated illustrative design concept. It is not confirmed physical inventory. Material details, purity, weight, stone specifications, final approved price and availability must be verified by Rishi Lal Jewellers before any order is accepted.`,
  craftsmanshipStory: 'Illustrative AI-generated jewellery design concept. This record does not claim a stocked or manufactured item.',
  metalType,
  metal: subcategory === 'Rose Gold Designer' ? 'Rose Gold concept — material and purity not verified' : subcategory === 'Pearl Drops' ? 'Gold-tone concept — actual setting material not verified' : `${metalType} concept — material and purity not verified`,
  purity: 'Not verified — AI concept only', grossWeight: 0, stock: 0,
  images: [image], imageType: 'AI-Generated Concept Image',
  imageSource: 'Original AI-generated concept image created for the Rishi Lal Jewellers earrings catalogue.',
  imageRights: 'AI-generated illustrative concept; not a real product photograph or proof of stocked inventory.',
  pricingType: 'indicative', availability: 'design-enquiry',
  certification: 'No hallmark or certification verified — concept only.',
  subcategory,
  tags: ['earring', 'earrings', metalType.toLowerCase(), subcategory.toLowerCase().replaceAll(' ', '-'), 'ai-concept'],
  isPublished: true, isNewArrival: true, isBridal: /bridal/i.test(subcategory),
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
  // Keep the previously inserted Pearl Drops concept aligned with its gold-tone
  // generated design, while explicitly leaving the actual setting material unverified.
  const pearlRecord = await Product.findOne({ sku: 'RLJ-ERR-P-001', imageType: 'AI-Generated Concept Image' }).select('metalType metal').lean();
  const pearlCorrection = pearlRecord && (pearlRecord.metalType !== 'Gold' || pearlRecord.metal !== 'Gold-tone concept — actual setting material not verified')
    ? await Product.updateOne(
      { sku: 'RLJ-ERR-P-001', imageType: 'AI-Generated Concept Image' },
      { $set: { metalType: 'Gold', metal: 'Gold-tone concept — actual setting material not verified' } },
      { runValidators: true }
    )
    : { modifiedCount: 0 };
  let inserted = 0;
  let alreadyPresent = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { $or: [{ sku: product.sku }, { slug: product.slug }] },
      { $setOnInsert: product },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
    else alreadyPresent += 1;
  }
  const verified = await Product.find({ sku: { $in: products.map((product) => product.sku) } })
    .select('name sku slug price pricingType availability stock images imageType metalType isPublished')
    .lean();
  const bySku = new Map(verified.map((product) => [product.sku, product]));
  const invalid = products.filter((seed) => {
    const record = bySku.get(seed.sku);
    return !record || record.slug !== seed.slug || record.images?.[0] !== seed.images[0] || record.price !== seed.price || record.pricingType !== 'indicative' || record.availability !== 'design-enquiry' || record.stock !== 0 || record.imageType !== 'AI-Generated Concept Image' || !record.isPublished || (seed.sku === 'RLJ-ERR-P-001' && record.metalType !== 'Gold');
  });
  if (invalid.length) throw new Error(`Verification failed for SKUs: ${invalid.map((p) => p.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, inserted, alreadyPresent, metadataAdjusted: pearlCorrection.modifiedCount, verified: verified.length, invalid: 0 }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
