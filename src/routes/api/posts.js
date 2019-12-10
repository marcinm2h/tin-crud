const { Router } = require('express');
const { list, details, add, edit, remove } = require('../../controllers/posts');
const { auth } = require('../auth');

const router = Router();

router.get('/posts', auth.required, list);

router.get('/posts/:id', auth.required, details);

router.post('/posts', auth.required, add);

router.put('/posts/:id', auth.required, edit);

router.delete('/posts/:id', auth.required, remove);

module.exports = { posts: router };
