const express = require('express');
const { NODE_ENV } = require('../env');

const auth = {
  required: (req, res, next) => {
    if (NODE_ENV === 'development') {
      return next();
    }
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  },
};

const router = express.Router();

module.exports = { auth, authRoutes: router };
