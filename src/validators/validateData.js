const { validateRequired } = require('./validateRequired');

const parseErrors = errors => {
  if (!errors) {
    return null;
  }
  if (!Array.isArray(errors)) {
    errors = [errors];
  }
  if (errors.filter(Boolean).length === 0) {
    return null;
  }
  return errors.filter(Boolean);
};

const validateData = schema => data => {
  const errors = {};

  for (let [key, { required = false, validators = [] }] of Object.entries(
    schema,
  )) {
    const value = data[key];
    if (!required && !value) {
      continue;
    }
    const fieldErrors = parseErrors(
      (required && validateRequired(value)) ||
        validators.map(validator => validator(value, data)),
    );
    if (fieldErrors) {
      errors[key] = fieldErrors;
    }
  }

  if (Object.keys(errors).length === 0) {
    return null;
  }

  return errors;
};

validateData.parse = schema => (requestData = {}) => {
  const allowedKeys = Object.keys(schema);
  const data = {};
  for (let [key, value] of Object.entries(requestData)) {
    if (allowedKeys.includes(key)) {
      data[key] = value;
    }
  }
  return data;
};

const validateSchema = schema => requestData => {
  const data = validateData.parse(schema)(requestData);
  const errors = validateData(schema)(data);
  return { errors, data };
};

module.exports = {
  validateData,
  validateSchema,
};
