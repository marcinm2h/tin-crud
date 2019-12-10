const { errors } = require('./errors');

const validateUrl = value => {
  const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  return urlRegex.test(value) ? null : errors.URL();
};

module.exports = {
  validateUrl,
};
