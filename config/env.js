const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv !== 'production') {
  require('dotenv').config();
}

module.exports = {
  nodeEnv,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  useMockDB: process.env.USE_MOCK_DB === 'true',
  fallbackToMock: false
};
