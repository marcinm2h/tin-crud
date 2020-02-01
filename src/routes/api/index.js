const { __DEV__ } = require('../../env');
const { Router } = require('express');
const { auth } = require('./auth');
const { admins } = require('./admins');
const { comments } = require('./comments');
const { groups } = require('./groups');
const { home } = require('./home');
const { init } = require('./init');
const { posts } = require('./posts');
const { users } = require('./users');

if (__DEV__) {
  require('../../services/repositories/memory/mock').initData();
}

const router = Router();

router.use(auth);
router.use(admins);
router.use(comments);
router.use(groups);
router.use(home);
router.use(init);
router.use(posts);
router.use(users);

module.exports = { api: router };
