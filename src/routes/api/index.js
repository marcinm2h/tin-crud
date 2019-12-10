const { __DEV__ } = require('../../env');
const { Router } = require('express');
const { users } = require('./users');
const { initData } = require('../../repositories/memory/mock');

if (__DEV__) {
  initData();
}

const router = Router();

router.use(users);

module.exports = { api: router };
