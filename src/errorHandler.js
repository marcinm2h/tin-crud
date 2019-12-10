const { __DEV__ } = require('./env');

const errorHandler = () => (error, req, res, next) => {
  console.log(`[ERROR] ${req.url}`, __DEV__ && error);
  return res.json(
    Object.assign({ errors: error.message }, __DEV__ && { stack: error.stack }),
  );
};

module.exports = { errorHandler };
