const { Comment } = require('../models/Comment');
const { CommentRepository } = require('../repositories/memory/Comment');

const list = (req, res) => {
  const commentRepository = new CommentRepository();
  const comments = commentRepository.list();
  commentRepository.save();

  return res.json({
    data: comments,
  });
};

const details = (req, res) => {
  const commentRepository = new CommentRepository();
  const comment = commentRepository.find(req.params.id);
  commentRepository.save();

  return res.json({
    data: comment,
  });
};

const add = (req, res) => {
  const commentRepository = new CommentRepository();
  // FIXME: validate req.body.data
  const comment = new Comment(req.body.data);
  commentRepository.add(comment);
  commentRepository.save();

  return res.json({
    data: comment,
  });
};

const edit = (req, res) => {
  const commentRepository = new CommentRepository();
  commentRepository.edit(req.params.id, req.body.data);
  commentRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const commentRepository = new CommentRepository();
  commentRepository.remove(req.params.id);
  commentRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
