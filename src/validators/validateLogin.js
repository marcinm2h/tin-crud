const MIN_LOGIN_LENGTH = 3;

export function validateLogin(value?: string) {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length < MIN_LOGIN_LENGTH) {
    return false;
  }

  return true;
}
