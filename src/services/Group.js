const { Group } = require('../models/Group');
const { DbService } = require('./Database');
const { UserGroupService } = require('./UserGroup');
const { UserService } = require('./User');
const { PostService } = require('./Post');
const { errors } = require('../validators/errors');

class GroupService {
  constructor({
    deps = { DbService, UserGroupService, PostService, UserService },
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
          .then(g => {
            if (!g) {
              throw new Error(errors.DATA_NOT_FOUND());
            }
            return new Group(g);
          })
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(group);
      });
    });
  }

  async add(values) {
    const { DbService } = this.deps;
    const db = new DbService();

    const groupId = await new Promise((resolve, reject) => {
      db.serialize(async () => {
        const groupId = await db.add(Group, values).catch(e => {
          throw new Error(e);
        });

        if (this.autoClose) {
          db.close();
        }

        resolve(groupId);
      });
    });
    const { UserGroupService } = this.deps;
    const userGroupService = new UserGroupService();
    await userGroupService.add({ groupId, userId: values.owner });

    return groupId;
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

  async remove(id) {
    const { PostService, UserGroupService } = this.deps;
    const users = await this.users(id);
    const userId = users.map(({ id }) => id);
    const userGroupService = new UserGroupService();
    const userGroups = await userGroupService.find({ userId, groupId: id });

    for (let userGroup of userGroups) {
      const userGroupService = new UserGroupService();
      await userGroupService.remove(userGroup.id);
    }

    const postService = new PostService();
    const posts = await postService.find({ group: id });

    for (let post of posts) {
      await postService.remove(post.id);
    }

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
    const { UserGroupService, UserService } = this.deps;
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

  join(id, userId) {
    const { UserGroupService } = this.deps;
    const userGroupService = new UserGroupService();

    return userGroupService.add({ userId, groupId: id });
  }

  async leave(id, userId) {
    const { UserGroupService } = this.deps;
    const userGroupService = new UserGroupService();
    const userGroups = await userGroupService.find({ userId, groupId: id });

    for (let userGroup of userGroups) {
      const userGroupService = new UserGroupService();
      await userGroupService.remove(userGroup.id);
    }
  }
}

module.exports = {
  GroupService,
};
