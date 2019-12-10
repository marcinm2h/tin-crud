const { errors } = require('./errors');

const validateStringOrNumber = value => {
  return /^[A-Za-z|\d]+$/.test(value) ? null : errors.STRING_OR_NUMBER();
};

module.exports = {
  validateStringOrNumber,
};
