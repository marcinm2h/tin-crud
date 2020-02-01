const { UserService } = require('../services/User');
const {
  validateSchema,
  validateData,
  validateBoolean,
  validateEmail,
  validateLength,
  validateString,
  validateStringOrNumber,
  validatePasswordConfirm,
} = require('../validators');

const list = (req, res, next) => {
  const userService = new UserService();
  userService
    .list()
    .then(users => {
      res.json({
        data: users,
      });
    })
    .catch(next);
};

// FIXME: posts, groups
const details = (req, res, next) => {
  const userService = new UserService();
  const id = req.params.id;

  userService
    .details(id)
    .then(user => {
      res.json({
        data: user,
      });
    })
    .catch(next);
};

const add = (req, res, next) => {
  const { data, errors } = validateSchema(add.schema)(req.body.data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const userService = new UserService();
  userService
    .add(data)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

add.schema = {
  login: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 20 }),
      validateStringOrNumber,
    ],
  },
  password: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 20 }),
      validateStringOrNumber,
    ],
  },
  passwordConfirm: {
    required: true,
    validators: [validatePasswordConfirm],
  },
  mail: {
    required: true,
    validators: [
      validateEmail,
      value => validateLength(value, { minLength: 5, maxLength: 50 }),
    ],
  },
  name: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateString,
    ],
  },
  gender: {
    required: true,
    validators: [validateBoolean],
  },
};

const edit = (req, res, next) => {
  const { schema } = edit;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const userService = new UserService();
  userService
    .edit(req.params.id, data)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);

  return res.json({
    data: {},
  });
};

edit.schema = {
  mail: {
    required: false,
    validators: [
      validateEmail,
      value => validateLength(value, { minLength: 5, maxLength: 50 }),
    ],
  },
  name: {
    required: false,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 50 }),
      validateString,
    ],
  },
  gender: {
    required: false,
    validators: [validateBoolean],
  },
};

const remove = (req, res, next) => {
  const userService = new UserService();
  userService
    .remove(req.params.id)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

module.exports = { list, details, add, edit, remove };
