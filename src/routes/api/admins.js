const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
} = require('../../controllers/admins');
const { auth } = require('../auth');

const router = Router();

router.get('/admins', auth.required, list);

router.get('/admins/:id', auth.required, details);

router.post('/admins', auth.required, add);

router.put('/admins/:id', auth.required, edit);

router.delete('/admins/:id', auth.required, remove);

module.exports = { admins: router };
