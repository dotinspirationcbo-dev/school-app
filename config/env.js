const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = {
  nodeEnv,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  useMockDB: false,
  fallbackToMock: false
};
