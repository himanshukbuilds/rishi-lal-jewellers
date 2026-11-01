require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { MONGODB_URI } = require('../config/constants');

async function main() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  if (mongoose.connection.name !== 'rishi_lal_jewellers') {
    throw new Error(`Refusing to update unexpected database: ${mongoose.connection.name}`);
  }

  const indicativeFilter = { $or: [{ pricingType: 'indicative' }, { availability: 'design-enquiry' }] };
  const needsApprovalUpdate = {
    $and: [indicativeFilter, { $or: [
      { priceStatus: { $ne: 'indicative' } },
      { isOrderable: { $ne: false } },
    ] }],
  };
  const result = await Product.updateMany(needsApprovalUpdate, {
    $set: { priceStatus: 'indicative', isOrderable: false },
  });
  const remaining = await Product.countDocuments(needsApprovalUpdate);
  if (remaining !== 0) throw new Error(`${remaining} indicative products failed approval verification.`);
  console.log(JSON.stringify({
    database: mongoose.connection.name,
    collection: Product.collection.name,
    matched: result.matchedCount,
    updated: result.modifiedCount,
    verifiedUnorderable: await Product.countDocuments({ $and: [indicativeFilter, { priceStatus: 'indicative', isOrderable: false }] }),
  }, null, 2));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect().catch(() => {}); });
