const { PostRepository } = require('../repositories/memory/Post');
const { GroupRepository } = require('../repositories/memory/Group');

const posts = (req, res) => {
  const postRepository = new PostRepository();
  const groupRepository = new GroupRepository();
  const allPosts = postRepository.list().map(post => ({
    ...post,
    group: groupRepository.find(post.group),
  }));
  const filteredPosts = allPosts.filter(post => !post.group.isHidden);

  return res.json({
    data: {
      posts: filteredPosts,
    },
  });
};

module.exports = {
  posts,
};
