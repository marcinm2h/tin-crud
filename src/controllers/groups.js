const { Group } = require('../models/Group');
const { GroupRepository } = require('../repositories/memory/Group');

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
  const groupRepository = new GroupRepository();
  // FIXME: validate req.body.data
  const group = new Group(req.body.data);
  groupRepository.add(group);
  groupRepository.save();

  return res.json({
    data: group,
  });
};

const edit = (req, res) => {
  const groupRepository = new GroupRepository();
  groupRepository.edit(req.params.id, req.body.data);
  groupRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const groupRepository = new GroupRepository();
  groupRepository.remove(req.params.id);
  groupRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
