const { Post } = require('../models/Post');
const { PostRepository } = require('../repositories/memory/Post');
const { GroupRepository } = require('../repositories/memory/Group');
const { UserRepository } = require('../repositories/memory/User');
const { CommentRepository } = require('../repositories/memory/Comment');

const list = (req, res) => {
  const postRepository = new PostRepository();
  const posts = postRepository.list();
  postRepository.save();

  return res.json({
    data: posts,
  });
};

const details = (req, res) => {
  const id = parseInt(req.params.id);
  const postRepository = new PostRepository();
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const commentRepository = new CommentRepository();

  const post = postRepository.find(id);
  post.group = groupRepository.find(post.group);
  post.author = userRepository.find(post.author);
  post.comments = post.comments.map(postId => commentRepository.find(postId));

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
