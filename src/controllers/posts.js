const { Post } = require('../models/Post');
const { PostRepository } = require('../repositories/memory/Post');

const list = (req, res) => {
  const postRepository = new PostRepository();
  const posts = postRepository.list();
  postRepository.save();

  return res.json({
    data: posts,
  });
};

const details = (req, res) => {
  const postRepository = new PostRepository();
  const post = postRepository.find(req.params.id);
  postRepository.save();

  return res.json({
    data: post,
  });
};

const add = (req, res) => {
  const postRepository = new PostRepository();
  // FIXME: validate req.body.data
  const post = new Post(req.body.data);
  postRepository.add(post);
  postRepository.save();

  return res.json({
    data: post,
  });
};

const edit = (req, res) => {
  const postRepository = new PostRepository();
  postRepository.edit(req.params.id, req.body.data);
  postRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const postRepository = new PostRepository();
  postRepository.remove(req.params.id);
  postRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
