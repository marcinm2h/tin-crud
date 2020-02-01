const { GroupService } = require('../services/Group');
const { Group } = require('../models/Group');
const { GroupRepository } = require('../services/repositories/memory/Group');
const { PostRepository } = require('../services/repositories/memory/Post');
const { UserRepository } = require('../services/repositories/memory/User');
const {
  CommentRepository,
} = require('../services/repositories/memory/Comment');
const {
  validateSchema,
  validateLength,
  validateString,
  validateStringOrNumber,
} = require('../validators');

const list = (req, res, next) => {
  const groupService = new GroupService();
  groupService
    .list()
    .then(groups => {
      res.json({
        data: {
          groups,
        },
      });
    })
    .catch(next);
};

const details = (req, res, next) => {
  // const id = parseInt(req.params.id);
  // const groupRepository = new GroupRepository();
  // const group = groupRepository.find(id);

  // const postRepository = new PostRepository();
  // group.posts = group.posts.map(id => postRepository.find(id));

  // const userRepository = new UserRepository();
  // group.users = group.users.map(id => userRepository.find(id));
  const groupService = new GroupService();

  groupService
    .details(req.params.id)
    .then(post => {
      res.json({
        data: {
          post,
        },
      });
    })
    .catch(next);
};

const add = (req, res, next) => {
  const { errors, data } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  // const groupRepository = new GroupRepository();
  // const userRepository = new UserRepository();
  // const user = userRepository.find(req.session.userId);
  // const group = new Group(data);

  // group.owner = user.id;
  // group.users.push(user.id);

  // user.groupsIn.push(group.id);
  // user.groupsCreated.push(group.id);

  // groupRepository.add(group);
  const groupService = new GroupService();
  groupService
    .add(data)
    .then(group => {
      res.json({
        data: {
          group,
        },
      });
    })
    .catch(next);
};

add.schema = {
  name: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 100 }),
      validateString,
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
  tag: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateStringOrNumber,
    ],
  },
};

const edit = (req, res, next) => {
  const { errors, data } = validateSchema(edit.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  const groupService = new GroupService();
  groupService
    .edit(req.params.id, data)
    .then(group => {
      res.json({
        data: {
          group,
        },
      });
    })
    .catch(next);
};

edit.schema = {
  name: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 100 }),
      validateString,
    ],
  },
  description: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 20, maxLength: 200 }),
    ],
  },
  tag: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateStringOrNumber,
    ],
  },
};

const remove = (req, res, next) => {
  // group.users.forEach(userId => {
  //   const user = userRepository.find(userId);
  //   user.groupsIn = user.groupsIn.filter(groupId => groupId !== group.id);
  // });

  // const owner = userRepository.find(group.owner);
  // userRepository.edit(owner.id, {
  //   groupsCreated: owner.groupsCreated.filter(groupId => groupId !== group.id),
  // });

  // groupRepository.remove(id);

  // group.posts.forEach(id => {
  //   const post = postRepository.find(id);
  //   const author = userRepository.find(post.author);
  //   userRepository.edit(author.id, {
  //     posts: author.posts.filter(id => id !== post.id),
  //   });
  //   post.comments.forEach(commentId => {
  //     const comment = commentRepository.find(commentId);
  //     const author = commentRepository.find(comment.author);
  //     userRepository.edit(author.id, {
  //       comments: author.comments.filter(commentId => comment.id),
  //     });
  //     commentRepository.remove(comment.id);
  //   });
  //   postRepository.remove(post.id);
  // });

  // TODO: remove posts comments, remove posts comments owners

  const groupService = new GroupService();
  groupService
    .remove(req.params.id)
    .then(group => {
      res.json({
        data: {
          group,
        },
      });
    })
    .catch(next);
};

const join = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const group = groupRepository.find(id);
  const user = userRepository.find(req.session.userId);

  if (!group.users.contains(user.id)) {
    group.users.push(user.id);
    user.groupsIn.push(group.id);

    userRepository.save();
    groupRepository.save();
  }

  return res.json({
    data: {},
  });
};

const leave = (req, res) => {
  const id = parseInt(req.params.id);
  const groupRepository = new GroupRepository();
  const userRepository = new UserRepository();
  const group = groupRepository.find(id);
  const user = userRepository.find(req.session.userId);

  group.users.filter(userId => userId !== user.id);
  user.groupsIn.filter(groupId => groupId !== group.id);

  userRepository.save();
  groupRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove, join, leave };
