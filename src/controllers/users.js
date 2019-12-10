const { User } = require('../models/User');
const { UserRepository } = require('../repositories/memory/User');
const { CommentRepository } = require('../repositories/memory/Comment');
const { GroupRepository } = require('../repositories/memory/Group');
const { PostRepository } = require('../repositories/memory/Post');
const {
  validateData,
  validateBoolean,
  validateEmail,
  validateLength,
  validateRequired,
  validateString,
  validateStringOrNumber,
} = require('../validators');

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
  const data = validateData.parse(add.schema)(req.body.data);
  const errors = validateData(add.schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const userRepository = new UserRepository();
  const user = new User(data);
  userRepository.add(user);
  userRepository.save();

  return res.json({
    data: user,
  });
};

add.schema = {
  login: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 20 }),
      validateStringOrNumber,
    ],
  },
  mail: {
    required: true,
    validators: [
      validateRequired,
      validateEmail,
      value => validateLength(value, { minLength: 5, maxLength: 50 }),
    ],
  },
  name: {
    required: true,
    validators: [
      validateRequired,
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateString,
    ],
  },
  gender: {
    required: true,
    validators: [validateBoolean],
  },
};

const edit = (req, res) => {
  const data = validateData.parse(add.schema)(req.body.data);
  const errors = validateData(add.schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const userRepository = new UserRepository();
  const id = parseInt(req.params.id);
  userRepository.edit(id, data);
  userRepository.save();

  return res.json({
    data: {},
  });
};

edit.schema = {
  mail: {
    required: false,
    validators: [
      validateEmail,
      value => validateLength(value, { minLength: 5, maxLength: 50 }),
    ],
  },
  name: {
    required: false,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateString,
    ],
  },
  gender: {
    required: false,
    validators: [validateBoolean],
  },
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
