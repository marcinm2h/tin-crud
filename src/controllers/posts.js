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

const add = async (req, res, next) => {
  const {
    errors,
    data: { groupId, ...data },
  } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  try {
    const postService = new PostService();
    const post = await postService.add({
      ...data,
      group: groupId,
      url: data.url.includes('//') ? data.url : `//${[data.url]}`,
      author: req.session.userId,
    });

    res.json({
      data: {
        post,
      },
    });
  } catch (e) {
    next(e);
  }
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
      value => validateLength(value, { minLength: 8, maxLength: 200 }),
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

const vote = async (req, res, next) => {
  const { errors, data } = validateSchema(vote.schema)(req.body.data);
  if (errors) {
    return res.json({ errors });
  }

  try {
    const post = await new PostService().details(req.params.id);
    const votesAgainst =
      data.type === 'against' ? post.votesAgainst + 1 : post.votesAgainst;
    const votesFor = data.type === 'for' ? post.votesFor + 1 : post.votesFor;
    await new PostService().edit(req.params.id, {
      votesAgainst,
      votesFor,
    });

    res.json({
      data: {
        post: {
          ...post,
          votesAgainst,
          votesFor,
        },
      },
    });
  } catch (e) {
    next(e);
  }
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
