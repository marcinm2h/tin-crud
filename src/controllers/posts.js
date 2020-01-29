const { Post } = require('../models/Post');
const { PostRepository } = require('../repositories/memory/Post');
const { GroupRepository } = require('../repositories/memory/Group');
const { UserRepository } = require('../repositories/memory/User');
const { CommentRepository } = require('../repositories/memory/Comment');
const {
  validateSchema,
  validateLength,
  validateNumber,
  validateUrl,
} = require('../validators');

const list = (req, res) => {
  const postRepository = new PostRepository();
  const posts = postRepository.list();
  postRepository.save();

  return res.json({
    data: posts,
  });
};

const details = (req, res) => {
  const id = parseInt(req.params.id);
  const postRepository = new PostRepository();
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const commentRepository = new CommentRepository();

  const post = postRepository.find(id);
  post.group = groupRepository.find(post.group);
  post.author = userRepository.find(post.author);
  post.comments = post.comments.map(postId => commentRepository.find(postId));
  post.comments = post.comments.map(comment => {
    comment.author = userRepository.find(comment.author).login;
    return comment;
  });

  return res.json({
    data: { post },
  });
};

const add = (req, res) => {
  const {
    errors,
    data: { groupId, ...data },
  } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const postRepository = new PostRepository();
  const userRepository = new UserRepository();
  const groupRepository = new GroupRepository();

  const user = userRepository.find(req.session.userId);
  const group = groupRepository.find(parseInt(groupId));
  const post = new Post(data);
  if (!post.url.includes('//')) {
    post.url = `//${[post.url]}`;
  }

  post.author = user.id;
  user.posts.push(post.id);

  post.group = group.id;
  group.posts.push(post.id);

  postRepository.add(post);

  userRepository.save();
  groupRepository.save();
  postRepository.save();

  return res.json({
    data: {
      post,
    },
  });
};

add.schema = {
  url: {
    required: true,
    validators: [
      validateUrl,
      value => validateLength(value, { minLength: 4, maxLength: 50 }),
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
  groupId: {
    required: true,
    validators: [validateNumber],
  },
};

const edit = (req, res) => {
  const { errors, data } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const id = parseInt(req.params.id);
  const postRepository = new PostRepository();
  postRepository.edit(id, data);

  postRepository.save();

  return res.json({
    data: {},
  });
};

edit.schema = {
  url: {
    required: true,
    validators: [
      validateUrl,
      value => validateLength(value, { minLength: 4, maxLength: 50 }),
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
};

const remove = (req, res) => {
  const id = parseInt(req.params.id);
  const postRepository = new PostRepository();
  const userRepository = new UserRepository();
  const groupRepository = new GroupRepository();
  const commentRepository = new CommentRepository();

  const post = postRepository.find(id);
  const user = userRepository.find(post.author);
  const group = groupRepository.find(post.group);

  userRepository.edit(user.id, {
    posts: user.posts.filter(postId => postId !== post.id),
  });
  groupRepository.edit(group.id, {
    posts: group.posts.filter(postId => postId !== post.id),
  });

  post.comments.forEach(commentId => {
    commentRepository.remove(commentId);
  });

  postRepository.remove(id);

  commentRepository.save();
  userRepository.save();
  groupRepository.save();
  postRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };
