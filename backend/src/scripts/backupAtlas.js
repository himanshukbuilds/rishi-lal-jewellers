/**
 * Rishi Lal Jewellers - MongoDB Atlas Pre-Migration Snapshot & Backup Tool
 *
 * Creates a complete JSON/BSON snapshot of all collections on MongoDB Atlas
 * before any migration or data changes are made.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

function maskUri(uri) {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

const ATLAS_URI = process.env.MONGODB_URI;

if (!ATLAS_URI) {
  console.error('[Error] MONGODB_URI is not defined in backend/.env');
  process.exit(1);
}

const COLLECTIONS = ['categories', 'products', 'users', 'coupons', 'orders'];

async function backupAtlas() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(__dirname, `../../backups/atlas_backup_${timestamp}`);

  console.log('='.repeat(70));
  console.log('MONGODB ATLAS BACKUP UTILITY');
  console.log(`Target: ${maskUri(ATLAS_URI)}`);
  console.log(`Output Directory: ${backupDir}`);
  console.log('='.repeat(70));

  let conn;
  try {
    fs.mkdirSync(backupDir, { recursive: true });

    conn = await mongoose.createConnection(ATLAS_URI, {
      serverSelectionTimeoutMS: 15000
    }).asPromise();
    console.log('✓ Connected to MongoDB Atlas successfully.\n');

    const summary = [];
    for (const colName of COLLECTIONS) {
      const docs = await conn.db.collection(colName).find({}).toArray();
      const filePath = path.join(backupDir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
      console.log(`  ✓ Backed up collection [${colName}]: ${docs.length} documents saved to ${path.basename(filePath)}`);
      summary.push({
        Collection: colName,
        'Documents Backed Up': docs.length,
        'File Size (Bytes)': fs.statSync(filePath).size,
        File: path.basename(filePath)
      });
    }

    const metadata = {
      backupTimestamp: new Date().toISOString(),
      database: conn.db.databaseName,
      collections: summary
    };
    fs.writeFileSync(path.join(backupDir, 'backup-metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');

    console.log('\n' + '='.repeat(70));
    console.table(summary);
    console.log(`✓ Atlas snapshot completed successfully. Saved to:\n  ${backupDir}`);
    console.log('='.repeat(70));
    return backupDir;
  } catch (error) {
    console.error('✗ Backup failed:', error);
    process.exit(1);
  } finally {
    if (conn) await conn.close();
  }
}

if (require.main === module) {
  backupAtlas();
}

module.exports = { backupAtlas };
