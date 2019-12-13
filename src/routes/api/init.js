const { Router } = require('express');
const { init } = require('../../controllers/init');

const router = Router();

router.get('/init', init);

module.exports = { init: router };
