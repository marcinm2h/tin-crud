import omit from 'lodash/omit';
const { Repository, DataNotFoundError } = require('./');

const errors = {
  ADMIN_NOT_EXIST: login => `Nie znaleziono administratora ${login}.`,
  INVALID_PASSWORD: login => `Nieprawidłowe hasło.`,
};

class AuthError extends Error {}

class AdminRepository extends Repository {
  login = ({ login, password }) => {
    const user = this.instances.find(user => user.login === login);
    if (!user) {
      throw new DataNotFoundError(errors.ADMIN_NOT_EXIST(login));
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

module.exports = { AdminRepository, AuthError };
