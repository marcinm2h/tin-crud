import * as express from 'express';
import { users } from './users';

const router = express.Router();

router.use(users);

export { router as api };
