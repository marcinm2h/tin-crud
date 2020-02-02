const { Post } = require('../models/Post');
const { DbService } = require('./Database');
// const { GroupService } = require('./Group');
const { CommentService } = require('./Comment');
// const { UserService } = require('./User');
const { errors } = require('../validators/errors');

class PostService {
  constructor({
    deps = {
      DbService,
      CommentService,
      GroupService: require('./Group').GroupService,
      UserService: require('./User').UserService,
    },
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

  async details(id) {
    const { DbService, CommentService, GroupService, UserService } = this.deps;
    const db = new DbService();

    let post = await new Promise((resolve, reject) => {
      db.serialize(async () => {
        const post = await db
          .details(Post, id)
          .then(p => {
            if (!p) {
              throw new Error(errors.DATA_NOT_FOUND());
            }
            return new Post(p);
          })
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(post);
      });
    });

    const groupService = new GroupService();
    post.group = await groupService.details(post.group);

    const comments = [];
    for (let commentId of post.comments) {
      const commentService = new CommentService();
      const comment = await commentService.details(commentId);
      comments.push(comment);
    }

    const userService = new UserService();
    const author = await userService.details(post.author);
    post.author = author;

    return post;
  }

  add(values) {
    const { DbService } = this.deps;
    const db = new DbService();
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const post = await db
          .add(Post, values)
          .then(id => new Post({ ...values, id }))
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

  find(...args) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const item = await db.find(Post, ...args).catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(item);
      });
    });
  }
}

module.exports = {
  PostService,
};
