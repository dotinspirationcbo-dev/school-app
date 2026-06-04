require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  nodeEnv,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_db',
  jwtSecret: process.env.JWT_SECRET || 'SECRET_KEY',
  useMockDB: process.env.USE_MOCK_DB === 'true',
  fallbackToMock: nodeEnv === 'production' ? false : process.env.FALLBACK_TO_MOCK === 'true'
};
