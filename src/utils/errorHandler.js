const errorHandler = () => (error, req, res, _) => {
  console.log(`[ERROR] ${req.url}`, error);
  return res.json({ error: error.message });
};

module.exports = { errorHandler };
