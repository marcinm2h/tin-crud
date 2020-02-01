const { PostService } = require('../services/Post');
const {
  errors,
  validateSchema,
  validateLength,
  validateNumber,
  validateUrl,
} = require('../validators');

const list = (req, res, next) => {
  const postService = new PostService();
  postService
    .list()
    .then(posts => {
      res.json({
        data: posts,
      });
    })
    .catch(next);
};

const details = (req, res, next) => {
  // const id = parseInt(req.params.id);
  // const postRepository = new PostRepository();
  // const groupRepository = new GroupRepository();
  // const userRepository = new UserRepository();
  // const commentRepository = new CommentRepository();

  // const post = postRepository.find(id);
  // post.group = groupRepository.find(post.group);
  // post.author = userRepository.find(post.author);
  // post.comments = post.comments.map(postId => commentRepository.find(postId));
  // post.comments = post.comments.map(comment => {
  //   comment.author = userRepository.find(comment.author).login;
  //   return comment;
  // });

  // return res.json({
  //   data: { post },
  // });

  const postService = new PostService();

  postService
    .details(req.params.id)
    .then(post => {
      res.json({
        data: { post },
      });
    })
    .catch(next);
};

const add = (req, res, next) => {
  const {
    errors,
    data: { groupId, ...data },
  } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  // const postRepository = new PostRepository();
  // const userRepository = new UserRepository();
  // const groupRepository = new GroupRepository();

  // const user = userRepository.find(req.session.userId);
  // const group = groupRepository.find(parseInt(groupId));
  // const post = new Post(data);
  // if (!post.url.includes('//')) {
  //   post.url = `//${[post.url]}`;
  // }

  // post.author = user.id;
  // user.posts.push(post.id);

  // post.group = group.id;
  // group.posts.push(post.id);

  // postRepository.add(post);

  // userRepository.save();
  // groupRepository.save();
  // postRepository.save();

  // return res.json({
  //   data: {
  //     post,
  //   },
  // });

  const postService = new PostService();
  postService
    .add(data)
    .then(post => {
      res.json({
        data: {
          post,
        },
      });
    })
    .catch(next);
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

const edit = (req, res, next) => {
  const { errors, data } = validateSchema(edit.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const postService = new PostService();
  postService
    .edit(req.params.id, data)
    .then(post => {
      res.json({
        data: {
          post,
        },
      });
    })
    .catch(next);
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

const remove = (req, res, next) => {
  // const id = parseInt(req.params.id);
  // const postRepository = new PostRepository();
  // const userRepository = new UserRepository();
  // const groupRepository = new GroupRepository();
  // const commentRepository = new CommentRepository();

  // const post = postRepository.find(id);
  // const user = userRepository.find(post.author);
  // const group = groupRepository.find(post.group);

  // userRepository.edit(user.id, {
  //   posts: user.posts.filter(postId => postId !== post.id),
  // });
  // groupRepository.edit(group.id, {
  //   posts: group.posts.filter(postId => postId !== post.id),
  // });

  // post.comments.forEach(commentId => {
  //   commentRepository.remove(commentId);
  // });

  // postRepository.remove(id);

  // commentRepository.save();
  // userRepository.save();
  // groupRepository.save();
  // postRepository.save();

  // return res.json({
  //   data: {},
  // });

  const postService = new PostService();
  postService
    .remove(req.params.id)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

const vote = (req, res, next) => {
  const { errors, data } = validateSchema(vote.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const postService = new PostService();
  postService
    .details(req.params.id)
    .then(post => {
      const postService = new PostService();
      const votesAgainst =
        data.type === 'against' ? post.votesAgainst + 1 : post.votesAgainst;
      const votesFor = data.type === 'for' ? post.votesFor + 1 : post.votesFor;

      postService
        .edit(req.params.id, {
          votesAgainst,
          votesFor,
        })
        .then(post => {
          res.json({
            data: {
              post,
            },
          });
        })
        .catch(next);
    })
    .catch(next);
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
