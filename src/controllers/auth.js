const { SESSION_NAME } = require('../env');
const { AdminRepository } = require('../repositories/memory/Admin');
const { UserRepository } = require('../repositories/memory/User');
const {
  validateData,
  validateLength,
  validateStringOrNumber,
} = require('../validators');

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

const loginAdmin = (req, res) => {
  const { schema } = loginAdmin;
  const data = validateData.parse(schema)(req.body.data);
  const errors = validateData(schema)(data);
  if (errors) {
    return res.json({
      errors,
    });
  }

  const adminRepository = new AdminRepository();
  const admin = adminRepository.login(data);

  req.session.userId = admin.id;
  req.session.login = admin.login;
  req.session.loggedIn = true;
  req.session.admin = true;

  return res.json({
    data: {},
  });
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

    return res.json({
      data: {},
    });
  });
};

module.exports = { login, loginAdmin, logout };
