const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { errorHandler } = require('../utils/errorHandler');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const { status, body } = errorHandler.unauthorized('No token provided');
    return res.status(status).json(body);
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const { status, body } = errorHandler.unauthorized('Token expired. Please log in again');
      return res.status(status).json(body);
    }
    const { status, body } = errorHandler.unauthorized('Invalid or malformed token');
    return res.status(status).json(body);
  }
};

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const { status, body } = errorHandler.unauthorized('Not authenticated');
      return res.status(status).json(body);
    }
    if (!allowedRoles.includes(req.user.role)) {
      const { status, body } = errorHandler.forbidden('Insufficient permissions for this resource');
      return res.status(status).json(body);
    }
    next();
  };
};

module.exports = { auth, roleCheck };
