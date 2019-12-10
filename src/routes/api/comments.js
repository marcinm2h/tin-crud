const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
} = require('../../controllers/comments');
const { auth } = require('../auth');

const router = Router();

router.get('/comments', auth.required, list);

router.get('/comments/:id', auth.required, details);

router.post('/comments', auth.required, add);

router.put('/comments/:id', auth.required, edit);

router.delete('/comments/:id', auth.required, remove);

module.exports = { comments: router };
