import { Request, Response, NextFunction } from 'express';

export const errorHandler = () => (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { url } = req;
  console.log(`[ERROR] ${url}`, error);

  return res.json({ error: error.message });
};
