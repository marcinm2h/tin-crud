const { Router } = require('express');
const { login, loginAdmin, logout } = require('../../controllers/auth');

const router = Router();

router.post('/login-admin', loginAdmin);

router.post('/login', login);

router.post('/logout', logout);

module.exports = { auth: router };
