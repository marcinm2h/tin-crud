const requestLogger = (logFn = console.log) => (req, res, next) => {
  const { method, body, params, url } = req;
  logFn(
    `[REQUEST] ${url}`,
    JSON.stringify({
      method,
      body,
      params,
    }),
  );

  next();
};

module.exports = { requestLogger };
