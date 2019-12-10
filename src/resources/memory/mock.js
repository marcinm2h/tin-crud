const { Admin } = require('../../models/Admin');
const { AdminRepository } = require('./Admin');
const { User } = require('../../models/User');
const { UserRepository } = require('./User');

const initData = () => {
  const adminRepository = new AdminRepository();
  [
    {
      login: 'admin',
      mail: 'admin@example.com',
      name: 'Pan Admin',
      gender: true,
    },
  ].forEach(data => adminRepository.add(new Admin(data)));

  const userRepository = new UserRepository();
  [
    {
      login: 'janusz',
      mail: 'janusz@example.com',
      name: 'Janusz Januszewicz',
      gender: true,
    },
    {
      login: 'halinka',
      mail: 'hania@example.com',
      name: 'Halina Halinowa',
      gender: false,
    },
    {
      login: 'andrzej',
      mail: 'andrzejek@example.com',
      name: 'Andrzej Andrew',
      gender: true,
    },
    {
      login: 'marcin',
      mail: 'marcin@example.com',
      name: 'Marcin M',
      gender: true,
    },
    {
      login: 's12609',
      mail: 's12609@example.com',
      name: 'Marcin Mmm',
      gender: true,
    },
  ].forEach(data => userRepository.add(new User(data)));
};

module.exports = {
  initData,
};
