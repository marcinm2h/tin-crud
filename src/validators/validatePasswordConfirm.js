const { errors } = require('./errors');

const validatePasswordConfirm = (value, { password }) => {
  return value === password ? null : errors.CONFIRM('hasło');
};

module.exports = {
  validatePasswordConfirm,
};
