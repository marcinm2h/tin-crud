const { Router } = require('express');
const { posts } = require('../../controllers/home');

const router = Router();

router.get('/home', posts);

module.exports = { home: router };
