const dotenv = require('dotenv');

dotenv.config();

const TWO_HOURS = 2 * 60 * 60 * 1000;

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE || TWO_HOURS,
  SESSION_NAME: process.env.SESSION_NAME || 'sid',
  SESSION_SECRET: process.env.SESSION_SECRET || '4a345091',
};
