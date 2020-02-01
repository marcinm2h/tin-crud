const { Post } = require('../models/Post');
const { DbService } = require('./Database');

class PostService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  list() {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const posts = await db
          .list(Post)
          .then(data => data.map(p => new Post(p)))
          .catch(reject);
        if (this.autoClose) {
          db.close();
        }
        resolve(posts);
      });
    });
  }

  details(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const post = await db
          .details(Post, id)
          .then(p => p && new Post(p))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(post);
      });
    });
  }

  add(values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const post = await db
          .add(Post, values)
          .then(p => p && new Post(p))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(post);
      });
    });
  }

  edit(id, values) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const post = await db
          .edit(Post, id, values)
          .then(p => p && new Post(p))
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(post);
      });
    });
  }

  remove(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        await db.remove(Post, id).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve();
      });
    });
  }
}

module.exports = {
  PostService,
};
