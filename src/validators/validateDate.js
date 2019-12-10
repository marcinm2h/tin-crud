const { errors } = require('./errors');

// value: 1993-02-23
const validateDate = (value, { minDate, maxDate } = {}) => {
  if (minDate && new Date(value).getTime() < minDate.getTime()) {
    return errors.MIN_DATE(minDate);
  }
  if (maxDate && new Date(value).getTime() > maxDate.getTime()) {
    return errors.MAX_DATE(maxDate);
  }

  return null;
};

module.exports = {
  validateDate,
};
