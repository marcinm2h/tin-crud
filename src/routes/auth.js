const express = require('express');
const { NODE_ENV, NO_AUTH } = require('../env');

const auth = {
  admin: (req, res, next) => {
    if (NODE_ENV === 'development' && NO_AUTH) {
      return next();
    }
    if (!req.session.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  },
  required: (req, res, next) => {
    if (NODE_ENV === 'development' && NO_AUTH) {
      return next();
    }
    if (!req.session.loggedIn) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  },
};

const router = express.Router();

module.exports = { auth, authRoutes: router };
