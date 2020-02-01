const { PostService } = require('../services/Post');
const { GroupService } = require('../services/Group');

const posts = async (req, res, next) => {
  try {
    const postService = new PostService();
    const posts = await postService.list();
    const groupIds = posts.map(({ group }) => group);
    const groupService = new GroupService();
    const groups = await groupService.find(groupIds);

    const allPosts = posts.map(post => ({
      ...post,
      group: groups.find(({ id }) => id === post.group),
    }));

    const filteredPosts = allPosts.filter(post => !post.group.isHidden);
    const sortedPosts = filteredPosts.reverse();

    res.json({
      data: {
        posts: sortedPosts,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  posts,
};
