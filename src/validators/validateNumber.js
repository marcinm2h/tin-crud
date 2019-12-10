const { errors } = require('./errors');

const validateNumber = value => {
  return /^\d+$/.test(value) ? null : errors.NUMBER();
};

module.exports = {
  validateNumber,
};
