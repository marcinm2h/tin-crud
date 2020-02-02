const { errors } = require('./errors');

const validateString = value => {
  return /^[A-Za-z ]+$/.test(value) ? null : errors.STRING();
};

module.exports = {
  validateString,
};
