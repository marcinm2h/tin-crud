const { SESSION_NAME } = require('../env');
const { AdminService } = require('../services/Admin');
const { UserService } = require('../services/User');
const {
  validateData,
  validateLength,
  validateStringOrNumber,
} = require('../validators');

const login = async (req, res, next) => {
  const { schema } = login;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }
  try {
    const userService = new UserService();
    let user = await userService.login(data);
    const userGroups = userService.groups(user.id);
    user.groups = userGroups;

    req.session.userId = user.id;
    req.session.login = user.login;
    req.session.loggedIn = true;

    res.json({
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
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
