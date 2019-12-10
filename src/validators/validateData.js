const parseErrors = errors => {
  if (!errors) {
    return null;
  }
  if (errors.filter(Boolean).length === 0) {
    return null;
  }
  return errors.filter(Boolean);
};

const validateData = schema => data => {
  const errors = {};

  for (let [key, value] of Object.entries(data)) {
    const { required = false, validators = [] } = schema[key] || {};
    if (!required && !value) {
      continue;
    }
    const fieldErrors = parseErrors(
      validators.map(validator => validator(value)),
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

validateData.parse = schema => requestData => {
  const allowedKeys = Object.keys(schema);
  const data = {};
  for (let [key, value] of Object.entries(requestData)) {
    if (allowedKeys.includes(key)) {
      data[key] = value;
    }
  }
  return data;
};

module.exports = {
  validateData,
};
