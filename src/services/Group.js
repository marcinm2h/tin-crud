const { Group } = require('../models/Group');
const { DbService } = require('./Database');
const { UserGroupService } = require('./UserGroup');
const { UserService } = require('./User');
const { PostService } = require('./Post');

class GroupService {
  constructor({
    deps = { DbService, UserGroupService, PostService },
    autoClose = true,
  } = {}) {
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

  async users(id) {
    const { UserGroupService } = this.deps;
    const userGroupService = new UserGroupService();
    const userGroup = await userGroupService.find({ groupId: id });
    const userIds = userGroup.map(({ loggedId }) => loggedId);
    const userService = new UserService();
    const users = await userService.find({ id: userIds });

    return users;
  }

  async posts(id) {
    const { PostService } = this.deps;
    const postService = new PostService();
    const posts = await postService.find({ group: id });

    return posts;
  }
}

module.exports = {
  GroupService,
};
