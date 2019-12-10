const { User } = require('../models/User');
const { UserRepository } = require('../repositories/memory/User');

const list = (req, res) => {
  const userRepository = new UserRepository();
  const users = userRepository.list();
  userRepository.save();

  return res.json({
    data: users,
  });
};

const details = (req, res) => {
  const userRepository = new UserRepository();
  const user = userRepository.details(req.params.id);
  userRepository.save();

  return res.json({
    data: user,
  });
};

const add = (req, res) => {
  const userRepository = new UserRepository();
  // FIXME: validate req.body.data
  const user = new User(req.body.data);
  userRepository.add(user);
  userRepository.save();

  return res.json({
    data: user,
  });
};

const edit = (req, res) => {
  const userRepository = new UserRepository();
  userRepository.edit(req.params.id, req.body.data);
  userRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const userRepository = new UserRepository();
  userRepository.remove(req.params.id);
  userRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
