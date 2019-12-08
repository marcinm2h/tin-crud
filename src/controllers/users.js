const { User } = require('../models/User');

let users = [
  new User({ login: 'admin', mail: 'mail@mail.com ' }),
  new User({ login: 'admin1', mail: 'mai1l@mail.com ' }),
  new User({ login: 'admin2', mail: 'mai2l@mail.com ' }),
  new User({ login: 'admin3', mail: 'mai3l@mail.com ' }),
];

const list = (req, res, _) => {
  return res.json({
    data: users,
  });
};

const details = (req, res) => {
  const { id: userId } = req.params;
  const user = users.find(user => user.id === userId);

  return res.json({
    data: user,
  });
};

const add = (req, res) => {
  const user = new User(); // TODO: req.data
  users.push(user);

  return res.json({
    data: user,
  });
};

const edit = (req, res) => {
  const { id: userId } = req.params;
  const { login } = req.body;
  const user = users.find(user => user.id === userId);
  user.login = login;

  return res.json({
    data: user,
  });
};

const remove = (req, res) => {
  const { id: userId } = req.params;
  users = users.filter(user => user.id !== userId);

  return res.json({
    data: users,
  });
};

module.exports = { list, details, add, edit, remove };
