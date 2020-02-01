const { GroupService } = require('../services/Group');
const { GroupRepository } = require('../services/repositories/memory/Group');
const { UserRepository } = require('../services/repositories/memory/User');
const {
  validateSchema,
  validateLength,
  validateString,
  validateStringOrNumber,
} = require('../validators');

const list = (req, res, next) => {
  const groupService = new GroupService();
  groupService
    .list()
    .then(groups => {
      res.json({
        data: {
          groups,
        },
      });
    })
    .catch(next);
};

const details = async (req, res, next) => {
  try {
    const groupService = new GroupService();
    let group = await groupService.details(req.params.id);
    const groupUsers = await groupService.users(group.id);
    const groupPosts = await groupService.posts(group.id);
    group.users = groupUsers;
    group.posts = groupPosts;

    res.json({
      data: {
        group,
      },
    });
  } catch (e) {
    next(e);
  }
};

const add = (req, res, next) => {
  const { errors, data } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }
  const groupService = new GroupService();
  groupService
    .add(
      {
        ...data,
        owner: req.session.userId,
      },
      req.session.userId,
    )
    .then(id => {
      res.json({
        data: {
          id,
        },
      });
    })
    .catch(next);
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

const edit = (req, res, next) => {
  const { errors, data } = validateSchema(edit.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const groupService = new GroupService();
  groupService
    .edit(req.params.id, data)
    .then(group => {
      res.json({
        data: {
          group,
        },
      });
    })
    .catch(next);
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

const remove = (req, res, next) => {
  const groupService = new GroupService();
  groupService
    .remove(req.params.id)
    .then(group => {
      res.json({
        data: {
          group,
        },
      });
    })
    .catch(next);
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
