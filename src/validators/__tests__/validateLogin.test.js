import { validateLogin } from '../validateLogin';

test('invalid login', () => {
  [undefined, null, '', 'a', 'ab'].forEach(value =>
    expect(validateLogin(value)).toBe(false),
  );
});

test('valid login', () => {
  ['login', '123'].forEach(value => expect(validateLogin(value)).toBe(true));
});
