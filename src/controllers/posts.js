const { Post } = require('../models/Post');
const { PostRepository } = require('../repositories/memory/Post');
const { GroupRepository } = require('../repositories/memory/Group');
const { UserRepository } = require('../repositories/memory/User');
const { CommentRepository } = require('../repositories/memory/Comment');
const {
  errors,
  validateSchema,
  validateLength,
  validateNumber,
  validateUrl,
} = require('../validators');
const { INVALID_VOTE } = errors;

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
  const { errors, data } = validateSchema(edit.schema)(req.body.data);
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

const vote = (req, res) => {
  const { errors, data } = validateSchema(vote.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const postId = parseInt(req.params.id);
  const { type } = data;

  const postRepository = new PostRepository();
  const userRepository = new UserRepository();

  const user = userRepository.find(req.session.userId);
  let post = postRepository.find(postId);

  if (post.usersVotedAgainst.includes(user.id) && type === 'against') {
    throw new Error(INVALID_VOTE());
  }

  if (post.usersVotedFor.includes(user.id) && type === 'for') {
    throw new Error(INVALID_VOTE());
  }

  if (type === 'against') {
    post = {
      ...post,
      votesAgainst: post.votesAgainst + 1,
      votesFor: post.usersVotedFor.includes(user.id)
        ? post.votesFor - 1
        : post.votesFor,
      usersVotedAgainst: post.usersVotedAgainst.concat(user.id),
      usersVotedFor: post.usersVotedFor.filter(userId => userId !== user.id),
    };
  }

  if (type === 'for') {
    post = {
      ...post,
      votesFor: post.votesFor + 1,
      votesAgainst: post.usersVotedAgainst.includes(user.id)
        ? post.votesAgainst - 1
        : post.votesAgainst,
      usersVotedFor: post.usersVotedFor.concat(user.id),
      usersVotedAgainst: post.usersVotedAgainst.filter(
        userId => userId !== user.id,
      ),
    };
  }

  postRepository.edit(post.id, post);

  postRepository.save();

  return res.json({
    data: {
      post,
    },
  });
};

vote.schema = {
  type: {
    required: true,
    validators: [
      value =>
        ['for', 'against'].includes(value) ? null : errors.INVALID_VOTE(),
    ],
  },
};

module.exports = { list, details, add, edit, remove, vote };
