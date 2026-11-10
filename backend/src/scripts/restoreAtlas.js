/**
 * Rishi Lal Jewellers - MongoDB Atlas Restore Tool
 *
 * Restores a collection snapshot created by backupAtlas.js
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

async function restoreAtlas() {
  const targetDir = process.argv[2];
  if (!targetDir || !fs.existsSync(targetDir)) {
    console.error('Usage: node restoreAtlas.js <path-to-backup-directory>');
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log('MONGODB ATLAS RESTORE UTILITY');
  console.log(`Target: ${maskUri(ATLAS_URI)}`);
  console.log(`Source Directory: ${targetDir}`);
  console.log('='.repeat(70));

  let conn;
  try {
    conn = await mongoose.createConnection(ATLAS_URI, {
      serverSelectionTimeoutMS: 15000
    }).asPromise();
    console.log('✓ Connected to MongoDB Atlas successfully.\n');

    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.json') && f !== 'backup-metadata.json');
    for (const file of files) {
      const colName = path.basename(file, '.json');
      const data = JSON.parse(fs.readFileSync(path.join(targetDir, file), 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        // Convert _id strings back to ObjectId if necessary
        const docs = data.map(d => {
          if (d._id && typeof d._id === 'string') {
            d._id = new mongoose.Types.ObjectId(d._id);
          }
          return d;
        });
        await conn.db.collection(colName).deleteMany({});
        await conn.db.collection(colName).insertMany(docs);
        console.log(`  ✓ Restored [${colName}]: ${docs.length} documents restored.`);
      }
    }
    console.log('\n✓ Restore operation completed successfully.');
  } catch (error) {
    console.error('✗ Restore failed:', error);
  } finally {
    if (conn) await conn.close();
  }
}

if (require.main === module) {
  restoreAtlas();
}

module.exports = { restoreAtlas };
