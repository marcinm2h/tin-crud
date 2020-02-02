const { Router } = require('express');
const { list, details, add, edit, remove } = require('../../controllers/users');
const { auth } = require('../auth');

const router = Router();

router.get('/users', list);

router.get('/users/:id', details);

router.post('/users', add);

router.put('/users/:id', auth.required, edit);

router.delete('/users/:id', auth.required, remove);

module.exports = { users: router };
