const { __DEV__ } = require('../../env');
const { Router } = require('express');
const { admins } = require('./admins');
const { users } = require('./users');

if (__DEV__) {
  require('../../repositories/memory/mock').initData();
}

const router = Router();

router.use(users);
router.use(admins);

module.exports = { api: router };
