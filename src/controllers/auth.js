const { SESSION_NAME } = require('../env');
const { UserRepository } = require('../services/repositories/memory/User');
const {
  validateData,
  validateLength,
  validateStringOrNumber,
} = require('../validators');
const { AdminService } = require('../services/Admin');

const login = (req, res) => {
  const { schema } = login;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const userRepository = new UserRepository();
  const user = userRepository.login(data);

  req.session.userId = user.id;
  req.session.login = user.login;
  req.session.loggedIn = true;

  return res.json({
    data: {
      user,
    },
  });
};

login.schema = {
  login: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 20 }),
      validateStringOrNumber,
    ],
  },
  password: {
    required: true,
    validators: [value => validateLength(value, { minLength: 2 })],
  },
};

const loginAdmin = (req, res, next) => {
  const { schema } = loginAdmin;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const adminService = new AdminService();
  adminService
    .login(data)
    .then(admin => {
      req.session.userId = admin.id;
      req.session.login = admin.login;
      req.session.loggedIn = true;
      req.session.admin = true;

      res.json({
        data: {
          admin,
        },
      });
    })
    .catch(next);
};

loginAdmin.schema = {
  login: {
    required: true,
    validators: [
      value => validateLength(value, { minLength: 3, maxLength: 20 }),
      validateStringOrNumber,
    ],
  },
  password: {
    required: true,
    validators: [value => validateLength(value, { minLength: 2 })],
  },
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(SESSION_NAME);

    res.json({
      data: {},
    });
  });
};

module.exports = { login, loginAdmin, logout };
