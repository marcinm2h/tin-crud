const { errors } = require('./errors');

const validatePostalCode = value => {
  const postalCodeRegex = /\d{2}-\d{3}/;

  return postalCodeRegex.test(value) ? null : errors.POSTAL_CODE();
};

module.exports = {
  validatePostalCode,
};
