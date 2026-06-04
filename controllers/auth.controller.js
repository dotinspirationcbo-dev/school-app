require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const mockDB = require('../mocks/db');
const { signToken } = require('../services/jwt.service');
const { errorHandler } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const useMock = process.env.USE_MOCK_DB === 'true';

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      const { status, body } = errorHandler.badRequest('fullName, email, and password are required');
      return res.status(status).json(body);
    }

    const existingUser = useMock
      ? mockDB.findUser(email)
      : await User.findOne({ email });

    if (existingUser) {
      const { status, body } = errorHandler.conflict('User with this email already exists');
      return res.status(status).json(body);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = useMock
      ? mockDB.createUser({ fullName, email, password: hashedPassword, role })
      : await User.create({ fullName, email, password: hashedPassword, role });

    const token = signToken(user);

    const { status, body } = errorHandler.created({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    }, 'User created successfully');

    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const { status, body } = errorHandler.badRequest('Email and password are required');
      return res.status(status).json(body);
    }

    const user = useMock
      ? mockDB.findUser(email)
      : await User.findOne({ email });

    if (!user) {
      const { status, body } = errorHandler.unauthorized('Invalid email or password');
      return res.status(status).json(body);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const { status, body } = errorHandler.unauthorized('Invalid email or password');
      return res.status(status).json(body);
    }

    const token = signToken(user);

    const { status, body } = errorHandler.success({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    }, 'Login successful');

    res.status(status).json(body);
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const { status, body } = errorHandler.unauthorized('No token provided');
      return res.status(status).json(body);
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    try {
      const decoded = jwt.verify(token, jwtSecret, { ignoreExpiration: false });
      const user = useMock
        ? mockDB.findUser(decoded.email || decoded.id)
        : await User.findById(decoded.id);

      if (!user) {
        const { status, body } = errorHandler.notFound('User not found');
        return res.status(status).json(body);
      }

      const newToken = signToken(user);

      const { status, body } = errorHandler.success({
        token: newToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      }, 'Token refreshed successfully');

      res.status(status).json(body);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const { status, body } = errorHandler.unauthorized('Token expired. Please log in again');
        return res.status(status).json(body);
      }
      const { status, body } = errorHandler.unauthorized('Invalid token');
      return res.status(status).json(body);
    }
  } catch (err) {
    const { status, body } = errorHandler.serverError(err.message);
    res.status(status).json(body);
  }
};
