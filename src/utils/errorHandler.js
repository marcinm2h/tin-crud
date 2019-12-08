const errorHandler = () => (error, req, res) => {
  console.log(`[ERROR] ${req.url}`, error);
  return res.json({ error: error.message });
};

module.exports = { errorHandler };
