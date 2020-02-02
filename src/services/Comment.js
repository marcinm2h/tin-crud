const { Comment } = require('../models/Comment');
const { DbService } = require('./Database');
const { errors } = require('../validators/errors');

class CommentService {
  constructor({ deps = { DbService }, autoClose = true } = {}) {
    this.deps = deps;
    this.autoClose = autoClose;
  }

  details(id) {
    const { DbService } = this.deps;
    const db = new DbService();

    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const comment = await db
          .details(Comment, id)
          .then(c => {
            if (!c) {
              throw new Error(errors.DATA_NOT_FOUND());
            }
            return new Comment(c);
          })
          .catch(reject);

        if (this.autoClose) {
          db.close();
        }

        resolve(comment);
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
}

module.exports = {
  CommentService,
};
