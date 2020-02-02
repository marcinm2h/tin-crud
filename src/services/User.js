const omit = require('lodash/omit');
const { User } = require('../models/User');
const { DbService } = require('./Database');
const { GroupService } = require('./Group');
const { PostService } = require('./Post');
const { UserGroupService } = require('./UserGroup');
const { errors } = require('../validators/errors');

class UserService {
  constructor({
    deps = { DbService, GroupService, PostService, UserGroupService },
    autoClose = true,
  } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  login({ login, password }) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.findOne(User, { login })
        .then(a => {
          if (a.password !== password) {
            reject(new Error(errors.INVALID_PASSWORD()));
          }
          resolve(new User(a));
        })
        .catch(() => {
          reject(new Error(errors.USER_NOT_EXIST(login)));
        });
    });
  }

  async groups(id) {
    const { GroupService, UserGroupService } = this.deps;
    const userGroupService = new UserGroupService();
    const userGroups = await userGroupService.find({ userId: id });
    const userGroupsIds = userGroups.map(({ groupId }) => groupId);
    const groups = [];
    for (let userGroup of userGroupsIds) {
      const groupService = new GroupService();
      const group = await groupService.details(userGroup);
      groups.push(group);
    }

    return groups;
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
          .then(u => {
            if (!u) {
              throw new Error(errors.DATA_NOT_FOUND());
            }
            return new User(u);
          })
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

  async posts(id) {
    const { PostService } = this.deps;
    const postService = new PostService();
    const posts = await postService.find({ author: id });

    return posts;
  }
}

module.exports = {
  UserService,
};
