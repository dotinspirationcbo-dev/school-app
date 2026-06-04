const mongoose = require('mongoose');
const mockDB = require('../mocks/db');
const env = require('./env');

const connectDB = async () => {
  if (env.useMockDB) {
    console.log('⚠️ Using MOCK DB (no MongoDB connection)');
    return mockDB.connect();
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);

    if (env.fallbackToMock) {
      console.log('⚠️ Falling back to MOCK DB');
      return mockDB.connect();
    }

    if (env.nodeEnv === 'production') {
      console.error('❌ Production mode: no fallback to mock DB. Exiting.');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
