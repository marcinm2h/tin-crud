const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
  leave,
  join,
} = require('../../controllers/groups');
const { auth } = require('../auth');

const router = Router();

router.get('/groups', list);

router.get('/groups/:id', details);

router.post('/groups', auth.required, add);

router.put('/groups/:id', auth.admin, edit);

router.delete('/groups/:id', auth.admin, remove);

router.post('/groups/join/:id', auth.required, join);

router.post('/groups/leave/:id', auth.required, leave);

module.exports = { groups: router };
