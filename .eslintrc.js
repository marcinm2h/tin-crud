module.exports = {
  env: {
    jest: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': [2, { vars: 'all', args: 'none' }],
  },
};
