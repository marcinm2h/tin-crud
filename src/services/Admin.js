const { Admin } = require('../models/Admin');
const { DbService } = require('./Database');
const { errors } = require('../validators/errors');

class AdminService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  login({ login, password }) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.findOne(Admin, { login })
        .then(a => {
          if (a.password !== password) {
            reject(new Error(errors.INVALID_PASSWORD()));
          }
          resolve(new Admin(a));
        })
        .catch(() => {
          reject(new Error(errors.ADMIN_NOT_EXIST(login)));
        });
    });
  }

  list() {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const admins = await db
          .list(Admin)
          .then(data => data.map(a => new Admin(a)))
          .catch(reject);
        if (this.autoClose) {
          db.close();
        }
        resolve(admins);
      });
    });
  }

  details(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const admin = await db
          .details(Admin, id)
          .then(a => {
            if (!a) {
              throw new Error(errors.DATA_NOT_FOUND());
            }
            return new Admin(a);
          })
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(admin);
      });
    });
  }

  add(values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const lastId = await db.add(Admin, values).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(lastId);
      });
    });
  }

  edit(id, values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const admin = await db
          .edit(Admin, id, values)
          .then(a => a && new Admin(a))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(admin);
      });
    });
  }

  remove(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.remove(Admin, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }
}

module.exports = {
  AdminService,
};
