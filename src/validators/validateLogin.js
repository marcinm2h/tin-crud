const MIN_LOGIN_LENGTH = 3;

const validateLogin = value => {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length < MIN_LOGIN_LENGTH) {
    return false;
  }

  return true;
};

module.exports = { validateLogin };
