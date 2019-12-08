const { Router } = require('express');
const { list, details, add, edit, remove } = require('../../controllers/users');
const { auth } = require('../auth');

const router = Router();

router.get('/users', auth.required, list);

router.get('/users/:id', auth.required, details);

router.post('/users', auth.required, add);

router.put('/users/:id', auth.required, edit);

router.delete('/users/:id', auth.required, remove);

module.exports = { users: router };
