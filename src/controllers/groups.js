const { Group } = require('../models/Group');
const { GroupRepository } = require('../repositories/memory/Group');
const { UserRepository } = require('../repositories/memory/User');
const {
  validateData,
  validateLength,
  validateString,
  validateStringOrNumber,
} = require('../validators');

const list = (req, res) => {
  const groupRepository = new GroupRepository();
  const groups = groupRepository.list();
  groupRepository.save();

  return res.json({
    data: groups,
  });
};

const details = (req, res) => {
  const groupRepository = new GroupRepository();
  const group = groupRepository.find(req.params.id);
  groupRepository.save();

  return res.json({
    data: group,
  });
};

const add = (req, res) => {
  const { schema } = add;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
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
    data: group,
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
  desctiption: {
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
  const { schema } = edit;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const groupRepository = new GroupRepository();
  groupRepository.edit(req.params.id, data);
  groupRepository.save();

  return res.json({
    data: {},
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
  desctiption: {
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
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const id = parseInt(req.params.id);
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

  // TODO: remove postst, remove posts comments, remove posts owners, remove posts comments owners

  groupRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
