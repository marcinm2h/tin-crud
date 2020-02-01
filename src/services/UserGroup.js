const { DbService } = require('./Database');

const TABLE_NAME = 'Logged_Group';

class UserGroupService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  list() {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const items = await db.list(TABLE_NAME).catch(reject);
        if (this.autoClose) {
          db.close();
        }
        resolve(items);
      });
    });
  }

  find({ userId: loggedId, groupId }) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const item = await db
          .find(TABLE_NAME, loggedId ? { loggedId } : { groupId })
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(item);
      });
    });
  }

  add({ userId: loggedId, groupId }) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.add(TABLE_NAME, { loggedId, groupId }).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }

  remove(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.remove(TABLE_NAME, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }
}

module.exports = {
  UserGroupService,
};
