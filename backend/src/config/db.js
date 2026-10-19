const mongoose = require('mongoose');
const { MONGODB_URI } = require('./constants');

let memoryServerInstance = null;

const connectDB = async () => {
  try {
    // Attempt standard connection to MongoDB with a short timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to external MongoDB successfully: ${MONGODB_URI}`);
  } catch (primaryErr) {
    console.warn(`[Database] External MongoDB connection failed (${primaryErr.message}). Launching high-reliability embedded demonstration Mongo...`);
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

