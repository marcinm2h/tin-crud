const { User } = require('../models/User');
const { UserRepository } = require('../repositories/memory/User');
const { CommentRepository } = require('../repositories/memory/Comment');
const { GroupRepository } = require('../repositories/memory/Group');
const { PostRepository } = require('../repositories/memory/Post');

const list = (req, res) => {
  const userRepository = new UserRepository();
  const users = userRepository.list();
  userRepository.save();

  return res.json({
    data: users,
  });
};

const details = (req, res) => {
  const id = parseInt(req.params.id);
  const userRepository = new UserRepository();
  const user = userRepository.find(id);

  const commentRepository = new CommentRepository();
  user.comments = user.comments.map(id => commentRepository.find(id));

  const groupRepository = new GroupRepository();
  user.groupsCreated = user.groupsCreated.map(id => groupRepository.find(id));
  user.groupsIn = user.groupsIn.map(id => groupRepository.find(id));

  const postRepository = new PostRepository();
  user.posts = user.posts.map(id => postRepository.find(id));

  return res.json({
    data: user,
  });
};

const add = (req, res) => {
  const userRepository = new UserRepository();
  // FIXME: validate req.body.data
  const user = new User(req.body.data);
  userRepository.add(user);
  userRepository.save();

  return res.json({
    data: user,
  });
};

const edit = (req, res) => {
  const id = parseInt(req.params.id);
  const userRepository = new UserRepository();
  userRepository.edit(id, req.body.data);
  userRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const userRepository = new UserRepository();
  userRepository.remove(id);
  userRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
