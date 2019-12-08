const { Router } = require('express');
const users = require('../../controllers/users');
const { auth } = require('../auth');

const router = Router();

router.post('/users/', auth.required, users.create);

router.get('/users', auth.required, users.getAll);

router.get('/users/:id', auth.required, users.get);

router.put('/users/:id', auth.required, users.update);

router.delete('/users/:id', auth.required, users.remove);

module.exports = { users: router };
