require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/constants');
const Product = require('../models/Product');

const priceUpdates = [
  { sku: 'RLJ-NCK-G-001', slug: 'heritage-filigree-traditional-gold-necklace-concept', price: 89999 },
  { sku: 'RLJ-NCK-G-002', slug: 'rajwada-bridal-gold-necklace-concept', price: 249999 },
  { sku: 'RLJ-NCK-G-003', slug: 'lakshmi-temple-gold-necklace-concept', price: 149999 },
  { sku: 'RLJ-NCK-G-004', slug: 'saanjh-lightweight-dailywear-gold-necklace-concept', price: 39999 },
  { sku: 'RLJ-NCK-G-005', slug: 'antique-engraved-gold-necklace-concept', price: 74999 },
  { sku: 'RLJ-NCK-D-001', slug: 'noor-diamond-necklace-concept', price: 129999 },
  { sku: 'RLJ-NCK-D-002', slug: 'aarohi-solitaire-necklace-concept', price: 89999 },
  { sku: 'RLJ-NCK-D-003', slug: 'meher-diamond-pendant-necklace-concept', price: 34999 },
  { sku: 'RLJ-NCK-S-001', slug: 'chandrika-traditional-silver-necklace-concept', price: 8999 },
  { sku: 'RLJ-NCK-S-002', slug: 'ruh-oxidised-silver-necklace-concept', price: 4999 },
];

async function main() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 12000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') {
    throw new Error(`Refusing to write: connected database is "${mongoose.connection.name}", expected "rishi_lal_jewellers".`);
  }

  const existing = await Product.find({ sku: { $in: priceUpdates.map((item) => item.sku) } })
    .select('sku slug imageType price pricingType availability stock images')
    .lean();
  const bySku = new Map(existing.map((product) => [product.sku, product]));
  const mismatches = priceUpdates.filter((item) => {
    const product = bySku.get(item.sku);
    return !product || product.slug !== item.slug || product.imageType !== 'AI-Generated Concept Image';
  });
  if (mismatches.length) throw new Error(`Refusing update; missing or non-concept SKUs: ${mismatches.map((item) => item.sku).join(', ')}`);

  const result = await Product.bulkWrite(priceUpdates.map(({ sku, slug, price }) => ({
    updateOne: {
      filter: {
        sku,
        slug,
        imageType: 'AI-Generated Concept Image',
        $or: [
          { price: { $ne: price } },
          { pricingType: { $ne: 'indicative' } },
          { availability: { $ne: 'design-enquiry' } },
        ],
      },
      update: { $set: { price, pricingType: 'indicative', availability: 'design-enquiry' } },
    },
  })), { ordered: true });

  const necklaceCatalogQuery = {
    isPublished: { $ne: false },
    $or: [
      { categorySlug: 'necklaces' },
      { category: /necklace/i },
      { tags: { $in: ['necklace', 'choker', 'haar', 'mangalsutra'] } },
    ],
  };
  const otherNecklaces = await Product.find({
    ...necklaceCatalogQuery,
    sku: { $nin: priceUpdates.map((item) => item.sku) },
  }).select('sku stock availability').lean();
  const availabilityUpdates = otherNecklaces.filter((product) => product.availability !== (product.stock > 0 ? 'in-stock' : 'contact-for-availability'));
  if (availabilityUpdates.length) {
    await Product.bulkWrite(availabilityUpdates.map((product) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: { availability: product.stock > 0 ? 'in-stock' : 'contact-for-availability' } },
      },
    })), { ordered: true });
  }

  const verified = await Product.find({ sku: { $in: priceUpdates.map((item) => item.sku) } })
    .select('name slug sku price pricingType availability stock images imageType')
    .sort({ sku: 1 })
    .lean();
  if (verified.length !== priceUpdates.length) throw new Error(`Verification failed: found ${verified.length}/${priceUpdates.length} records.`);
  for (const expected of priceUpdates) {
    const product = bySku.get(expected.sku);
    const saved = verified.find((item) => item.sku === expected.sku);
    if (!saved || saved.price !== expected.price || saved.pricingType !== 'indicative' || saved.availability !== 'design-enquiry' || saved.stock !== product.stock || saved.images[0] !== product.images[0]) {
      throw new Error(`Verification failed or protected fields changed for ${expected.sku}.`);
    }
  }
  const allNecklaces = await Product.find(necklaceCatalogQuery)
    .select('name sku price pricingType availability stock imageType images')
    .lean();
  const invalidNecklaces = allNecklaces.filter((product) => !(Number(product.price) > 0) || !product.availability);
  if (invalidNecklaces.length) throw new Error(`Final catalogue verification failed for: ${invalidNecklaces.map((item) => item.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, priceRecordsMatched: result.matchedCount, priceRecordsModified: result.modifiedCount, conceptRecordsVerified: verified.length, otherAvailabilityUpdated: availabilityUpdates.length, allPublishedNecklacesVerified: allNecklaces.length, records: verified }, null, 2));
}

main().catch((error) => {
  console.error(`[necklace-prices] ${error.message}`);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect().catch(() => {});
});
