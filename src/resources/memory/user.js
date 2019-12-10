const { Repository } = require('./');
const { User } = require('../../models/User');

const initData = () => {
  const userRepository = new UserRepository();
  [
    new User({
      login: 'janusz',
      mail: 'janusz@example.com',
      name: 'The First User',
      gender: true,
    }),
    new User({
      login: 'halinka',
      mail: 'halina@example.com',
      name: 'Halina Testowa',
      gender: false,
    }),
  ].forEach(user => userRepository.add(user));

  userRepository.save();
};

class UserRepository extends Repository {}

module.exports = { UserRepository, initData };
