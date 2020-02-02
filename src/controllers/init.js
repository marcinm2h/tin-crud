const { GroupService } = require('../services/Group');
const { UserGroupService } = require('../services/UserGroup');

const TOP_GROUPS_COUNT = 5;

const init = async (req, res, next) => {
  try {
    if (req.session.loggedIn && !req.session.admin) {
      const userGroupService = new UserGroupService();
      const userGroup = await userGroupService.find({
        userId: req.session.userId,
      });
      const groupIds = userGroup.map(({ groupId }) => groupId);
      if (groupIds.length > 0) {
        const groupService = new GroupService();
        const groups = await groupService.find(groupIds);
        return res.json({
          data: {
            groups,
          },
        });
      }
    }

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
  } catch (e) {
    next(e);
  }
};

module.exports = {
  init,
};
