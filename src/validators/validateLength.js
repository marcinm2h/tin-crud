const { errors } = require('./errors');

const validateLength = (value, { minLength, maxLength } = {}) => {
  if (minLength && value.length < minLength) {
    return errors.MIN_LENGTH(minLength);
  }
  if (maxLength && value.length > maxLength) {
    return errors.MAX_LENGTH(maxLength);
  }

  return null;
};

module.exports = {
  validateLength,
};
