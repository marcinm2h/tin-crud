const { errors } = require('./errors');

const validateRequired = value => {
  if (value === null || value === undefined || value === '') {
    return errors.REQUIRED();
  }

  return null;
};

module.exports = {
  validateRequired,
};
