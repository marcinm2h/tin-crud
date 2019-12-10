const { __DEV__ } = require('../../env');
const { Router } = require('express');
const { admins } = require('./admins');
const { posts } = require('./posts');
const { users } = require('./users');

if (__DEV__) {
  require('../../repositories/memory/mock').initData();
}

const router = Router();

router.use(admins);
router.use(posts);
router.use(users);

module.exports = { api: router };
