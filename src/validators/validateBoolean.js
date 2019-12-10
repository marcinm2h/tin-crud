const { errors } = require('./errors');

const validateBoolean = value => {
  if (typeof value !== 'boolean') {
    return errors.INVALID_DATA_TYPE();
  }

  return null;
};

module.exports = {
  validateBoolean,
};
