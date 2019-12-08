import { Router } from 'express';
import * as users from '../../controllers/users';
import { auth } from '../auth';

const router = Router();

router.post('/users/', auth.required, users.create);

router.get('/users', auth.required, users.getAll);

router.get('/users/:id', auth.required, users.get);

router.put('/users/:id', auth.required, users.update);

router.delete('/users/:id', auth.required, users.remove);

export { router as users };
