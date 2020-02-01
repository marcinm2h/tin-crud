const { PostRepository } = require('../services/repositories/memory/Post');
const { GroupRepository } = require('../services/repositories/memory/Group');

const posts = (req, res) => {
  const postRepository = new PostRepository();
  const groupRepository = new GroupRepository();
  const allPosts = postRepository.list().map(post => ({
    ...post,
    group: groupRepository.find(post.group),
  }));
  const filteredPosts = allPosts.filter(post => !post.group.isHidden);
  const sortedPosts = filteredPosts.reverse();

  return res.json({
    data: {
      posts: sortedPosts,
    },
  });
};

module.exports = {
  posts,
};
