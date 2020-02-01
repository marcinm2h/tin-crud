const { Group } = require('../models/Group');
const { DbService } = require('./Database');

class GroupService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  list() {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const groups = await db
          .list(Group)
          .then(data => data.map(g => new Group(g)))
          .catch(reject);
        if (this.autoClose) {
          db.close();
        }
        resolve(groups);
      });
    });
  }

  details(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const group = await db
          .details(Group, id)
          .then(g => g && new Group(g))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(group);
      });
    });
  }

  add(values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const group = await db
          .add(Group, values)
          .then(g => g && new Group(g))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(group);
      });
    });
  }

  edit(id, values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const group = await db
          .edit(Group, id, values)
          .then(g => g && new Group(g))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(group);
      });
    });
  }

  remove(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.remove(Group, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }
}

module.exports = {
  GroupService,
};
