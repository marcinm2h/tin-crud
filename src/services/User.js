const omit = require('lodash/omit');
const { User } = require('../models/User');
const { DbService } = require('./Database');

class DataNotFoundError extends Error {}

class AuthError extends Error {}

const errors = {
  USER_NOT_EXIST: login => `Nie znaleziono użytkownika ${login}.`,
  INVALID_PASSWORD: login => `Nieprawidłowe hasło.`,
};

class UserService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  login({ login, password }) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.find(User, { login })
        .then(a => {
          if (a.password !== password) {
            reject(new AuthError(errors.INVALID_PASSWORD()));
          }
          resolve(new User(a));
        })
        .catch(() => {
          reject(new DataNotFoundError(errors.USER_NOT_EXIST(login)));
        });
    });
  }

  list() {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const users = await db
          .list(User)
          .then(data => data.map(u => new User(u)))
          .then(users => users.map(user => omit(user, ['password'])))
          .catch(reject);
        if (this.autoClose) {
          db.close();
        }
        resolve(users);
      });
    });
  }

  details(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const user = await db
          .details(User, id)
          .then(u => u && new User(u))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(user);
      });
    });
  }

  add(values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const user = await db
          .add(User, omit(values, ['passwordConfirm']))
          .then(u => u && new User(u))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(user);
      });
    });
  }

  edit(id, values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const user = await db
          .edit(User, id, values)
          .then(a => a && new User(a))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(user);
      });
    });
  }

  remove(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.remove(User, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }

  find(...args) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const item = await db.find(User, ...args).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(item);
      });
    });
  }
}

module.exports = {
  UserService,
};
