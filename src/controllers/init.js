const { GroupRepository } = require('../services/repositories/memory/Group');

const init = (req, res) => {
  const groupRepository = new GroupRepository();
  const allGroups = groupRepository.list();
  const topGropus = allGroups.slice(0, 2);

  return res.json({
    data: {
      groups: topGropus,
    },
  });
};

module.exports = {
  init,
};
