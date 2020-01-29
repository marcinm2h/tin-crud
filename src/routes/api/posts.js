const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
  vote,
} = require('../../controllers/posts');
const { auth } = require('../auth');

const router = Router();

router.get('/posts', auth.required, list);

router.get('/posts/:id', auth.required, details);

router.post('/posts', auth.required, add);

router.post('/posts/vote/:id', auth.required, vote);

router.put('/posts/:id', auth.admin, edit);

router.delete('/posts/:id', auth.admin, remove);

module.exports = { posts: router };
