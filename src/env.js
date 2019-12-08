import * as dotenv from 'dotenv';

dotenv.config();

const TWO_HOURS = 2 * 60 * 60 * 1000;

export const {
  DB_PATH = 'db.sqlite',
  NODE_ENV = 'development',
  PORT = 3000,
  SESSION_MAX_AGE = TWO_HOURS,
  SESSION_NAME = 'sid',
  SESSION_SECRET = '4a345091',
} = process.env;
