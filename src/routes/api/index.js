const { __DEV__ } = require('../../env');
const { Router } = require('express');
const { comments } = require('./comments');
const { groups } = require('./groups');
const { posts } = require('./posts');
const { users } = require('./users');

if (__DEV__) {
  require('../../repositories/memory/mock').initData();
}

const router = Router();

router.use(comments);
router.use(groups);
router.use(posts);
router.use(users);

module.exports = { api: router };
