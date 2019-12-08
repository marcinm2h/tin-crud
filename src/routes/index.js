const express = require('express');
const { api } = require('./api');
const { authRoutes } = require('./auth');

const router = express.Router();

router.use(authRoutes);
router.use('/api', api);

module.exports = {
  routes: router,
};
