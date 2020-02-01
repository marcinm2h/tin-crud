const { GroupService } = require('../services/Group');

const TOP_GROUPS_COUNT = 5;

const init = (req, res, next) => {
  const groupService = new GroupService();
  groupService
    .list()
    .then(groups => {
      res.json({
        data: {
          groups: groups.slice(0, TOP_GROUPS_COUNT),
        },
      });
    })
    .catch(next);
};

module.exports = {
  init,
};
