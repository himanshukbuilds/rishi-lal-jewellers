const mongoose = require('mongoose');
const { MONGODB_URI } = require('./constants');

let memoryServerInstance = null;

const maskUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
};

const connectDB = async () => {
  const isCloudDb = Boolean(MONGODB_URI && MONGODB_URI.includes('mongodb+srv'));
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    // Attempt standard connection to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: isCloudDb ? 15000 : 5000,
      connectTimeoutMS: isCloudDb ? 15000 : 5000,
    });
    console.log(`[Database] Connected to MongoDB successfully: ${maskUri(MONGODB_URI)}`);
  } catch (primaryErr) {
    // In production or cloud environments, never fallback to in-memory database to prevent data loss
    if (isProduction || isCloudDb) {
      console.error(`[Database] FATAL: Connection to cloud MongoDB failed (${primaryErr.message}).`);
      console.error('[Database] In-memory fallback is disabled for cloud/production to prevent data loss.');
      throw primaryErr;
    }

    console.warn(`[Database] Local MongoDB connection failed (${primaryErr.message}). Launching local in-memory demonstration instance...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'rishi_lal_jewellers'
        }
      });
      const memoryUri = memoryServerInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to embedded in-memory MongoDB demonstration instance: ${memoryUri}`);
    } catch (fallbackErr) {
      console.error('[Database] Fatal: Unable to initialize embedded database:', fallbackErr);
      throw fallbackErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };

