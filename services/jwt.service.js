const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

module.exports = { signToken };
