const { Admin } = require('../models/Admin');
const { DbService } = require('./Database');

class AdminService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
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
          .then(a => a && new Admin(a))
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
        const admin = await db
          .add(Admin, values)
          .then(a => a && new Admin(a))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(admin);
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
        const admin = await db.remove(Admin, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(admin);
      });
    });
  }
}

module.exports = {
  AdminService,
};
