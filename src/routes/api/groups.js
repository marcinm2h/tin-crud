const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
} = require('../../controllers/groups');
const { auth } = require('../auth');

const router = Router();

router.get('/groups', auth.required, list);

router.get('/groups/:id', auth.required, details);

router.post('/groups', auth.required, add);

router.put('/groups/:id', auth.required, edit);

router.delete('/groups/:id', auth.required, remove);

module.exports = { groups: router };
