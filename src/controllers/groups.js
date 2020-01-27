const { Group } = require('../models/Group');
const { GroupRepository } = require('../repositories/memory/Group');
const { PostRepository } = require('../repositories/memory/Post');
const { UserRepository } = require('../repositories/memory/User');
const {
  validateSchema,
  validateLength,
  validateString,
  validateStringOrNumber,
} = require('../validators');

const list = (req, res) => {
  const groupRepository = new GroupRepository();
  const groups = groupRepository.list();
  groupRepository.save();

  return res.json({
    data: {
      groups,
    },
  });
};

const details = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const group = groupRepository.find(id);

  const postRepository = new PostRepository();
  group.posts = group.posts.map(id => postRepository.find(id));

  const userRepository = new UserRepository();
  group.users = group.users.map(id => userRepository.find(id));

  return res.json({
    data: {
      group,
    },
  });
};

const add = (req, res) => {
  const { errors, data } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const user = userRepository.find(req.session.userId);
  const group = new Group(data);

  group.owner = user.id;
  group.users.push(user.id);

  user.groupsIn.push(group.id);
  user.groupsCreated.push(group.id);

  groupRepository.add(group);

  groupRepository.save();
  userRepository.save();

  return res.json({
    data: {
      group,
    },
  });
};

add.schema = {
  name: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 100 }),
      validateString,
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
  tag: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateStringOrNumber,
    ],
  },
};

const edit = (req, res) => {
  const { errors, data } = validateSchema(edit.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const groupRepository = new GroupRepository();
  const id = parseInt(req.params.id);
  const group = groupRepository.edit(id, data);
  groupRepository.save();

  return res.json({
    data: {
      group,
    },
  });
};

edit.schema = {
  name: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 100 }),
      validateString,
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
  tag: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateStringOrNumber,
    ],
  },
};

const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const postRepository = new PostRepository();
  const group = groupRepository.find(id);

  group.users.forEach(userId => {
    const user = userRepository.find(userId);
    user.groupsIn = user.groupsIn.filter(groupId => groupId !== group.id);
  });

  const owner = userRepository.find(group.owner);
  owner.groupsCreated = owner.groupsCreated.filter(
    groupId => groupId !== group.id,
  );

  groupRepository.remove(id);

  group.posts.forEach(id => {
    const post = postRepository.find(id);
    const author = userRepository.find(post.author);
    author.posts = author.posts.filter(id => id !== post.id);
    postRepository.remove(post.id);
  });

  // TODO: remove posts comments, remove posts comments owners

  postRepository.save();
  userRepository.save();
  groupRepository.save();

  return res.json({
    data: {},
  });
};

const join = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const group = groupRepository.find(id);
  const user = userRepository.find(req.session.userId);

  if (!group.users.contains(user.id)) {
    group.users.push(user.id);
    user.groupsIn.push(group.id);

    userRepository.save();
    groupRepository.save();
  }

  return res.json({
    data: {},
  });
};

const leave = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const group = groupRepository.find(id);
  const user = userRepository.find(req.session.userId);

  group.users.filter(userId => userId !== user.id);
  user.groupsIn.filter(groupId => groupId !== group.id);

  userRepository.save();
  groupRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove, join, leave };
