const { errors } = require('./errors');
const { validateData } = require('./validateData');
const { validateBoolean } = require('./validateBoolean');
const { validateEmail } = require('./validateEmail');
const { validateDate } = require('./validateDate');
const { validateLength } = require('./validateLength');
const { validateNumber } = require('./validateNumber');
const { validatePostalCode } = require('./validatePostalCode');
const { validateRequired } = require('./validateRequired');
const { validateString } = require('./validateString');
const { validateStringOrNumber } = require('./validateStringOrNumber');
const { validateUrl } = require('./validateUrl');

module.exports = {
  errors,
  validateData,
  validateBoolean,
  validateEmail,
  validateDate,
  validateLength,
  validateNumber,
  validatePostalCode,
  validateRequired,
  validateString,
  validateStringOrNumber,
  validateUrl,
};
