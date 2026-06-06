require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  nodeEnv,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  useMockDB: process.env.USE_MOCK_DB === 'true',
  fallbackToMock: process.env.FALLBACK_TO_MOCK === 'true'
};
