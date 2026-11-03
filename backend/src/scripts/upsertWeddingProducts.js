require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');
const products = require('../data/weddingProducts.json');

async function main() {
  if (products.length !== 50) throw new Error(`Expected 50 catalogue records, found ${products.length}`);
  if (new Set(products.map((p) => p.sku)).size !== 50 || new Set(products.map((p) => p.slug)).size !== 50 || new Set(products.map((p) => p.image)).size !== 50) {
    throw new Error('Catalogue SKUs, slugs, and image paths must be unique.');
  }
  for (const p of products) {
    const localImage = path.resolve(__dirname, '../../../frontend/public', `.${p.image}`);
    if (!fs.existsSync(localImage)) throw new Error(`Missing product image: ${p.image}`);
    p.images = [p.image];
    delete p.sourceImage;
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') throw new Error(`Refusing write to unexpected database: ${mongoose.connection.name}`);

  let inserted = 0;
  let alreadyPresent = 0;
  for (const product of products) {
    const conflicts = await Product.find({ $or: [{ sku: product.sku }, { slug: product.slug }] }).select('sku slug').lean();
    if (conflicts.some((item) => item.sku !== product.sku || item.slug !== product.slug)) {
      throw new Error(`Refusing to overwrite a record that conflicts with ${product.sku} / ${product.slug}`);
    }
    const result = await Product.updateOne(
      { $or: [{ sku: product.sku }, { slug: product.slug }] },
      { $setOnInsert: product },
      { upsert: true, runValidators: true }
    );
    if (result.upsertedCount) inserted += 1;
    else alreadyPresent += 1;
  }

  const verified = await Product.find({ sku: { $in: products.map((p) => p.sku) } })
    .select('name sku slug category categorySlug subcategory price pricingType availability stock images imageType isPublished')
    .lean();
  const bySku = new Map(verified.map((item) => [item.sku, item]));
  const invalid = products.filter((seed) => {
    const item = bySku.get(seed.sku);
    return !item || item.slug !== seed.slug || item.category !== 'Wedding' || item.categorySlug !== 'bridal' || item.subcategory !== seed.subcategory || item.price !== seed.price || item.images?.[0] !== seed.image || item.pricingType !== 'indicative' || item.availability !== 'design-enquiry' || item.stock !== 0 || item.imageType !== 'AI-Generated Concept Image' || !item.isPublished;
  });
  if (invalid.length !== 0) throw new Error(`Post-write verification failed for ${invalid.map((item) => item.sku).join(', ')}`);
  console.log(JSON.stringify({ database: mongoose.connection.name, collection: Product.collection.name, inserted, alreadyPresent, verified: verified.length, invalid: invalid.length }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
