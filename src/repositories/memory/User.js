const omit = require('lodash/omit');
const { Repository, DataNotFoundError } = require('./');

const errors = {
  USER_NOT_EXIST: login => `Nie znaleziono użytkownika ${login}.`,
  INVALID_PASSWORD: login => `Nieprawidłowe hasło.`,
};

class AuthError extends Error {}

class UserRepository extends Repository {
  login = ({ login, password }) => {
    const user = this.instances.find(user => user.login === login);
    if (!user) {
      throw new DataNotFoundError(errors.USER_NOT_EXIST(login));
    }

    if (user.password !== password) {
      throw new AuthError(errors.INVALID_PASSWORD());
    }

    return user;
  };

  find = id => {
    const instance = Repository.prototype.find();
    return omit(instance, ['password']);
  };
}

module.exports = { UserRepository, AuthError };
