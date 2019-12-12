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

router.get('/admins', auth.admin, list);

router.get('/admins/:id', auth.admin, details);

router.post('/admins', auth.admin, add);

router.put('/admins/:id', auth.admin, edit);

router.delete('/admins/:id', auth.admin, remove);

module.exports = { admins: router };
