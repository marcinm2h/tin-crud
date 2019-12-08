import * as express from 'express';
import { NextFunction, Response } from 'express';
import { NODE_ENV } from '../env';

export interface Request extends express.Request {
  sessionID: string;
  session: {
    userId: number,
    login: string,
    destroy: (onFinish: (error: any) => void) => void,
  };
}

export const auth = {
  required: (req: Request, res: Response, next: NextFunction) => {
    if (NODE_ENV === 'development') {
      return next();
    }
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  },
};

const router = express.Router();

export { router as authRoutes };
