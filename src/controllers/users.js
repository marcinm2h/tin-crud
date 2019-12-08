import { NextFunction, Response } from 'express';
import { getRepository } from 'typeorm';
import { Request } from '../routes/auth';
import { User } from '../models/User';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRepository = getRepository(User);
    const user = new User();

    const response = await userRepository.save(user);

    return res.json({
      data: response,
    });
  } catch (e) {
    next(e);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRepository = getRepository(User);

    const response = await userRepository.find();

    return res.json({
      data: response,
    });
  } catch (e) {
    next(e);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const userRepository = getRepository(User);

    const response = await userRepository.findOne(userId);

    return res.json({
      data: response,
    });
  } catch (e) {
    next(e);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params;
    const { login } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);
    user.login = login;

    const response = await userRepository.save(user);

    return res.json({
      data: response,
    });
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params;
    const userRepository = getRepository(User);
    const response = await userRepository.remove(userId);

    return res.json({
      data: response,
    });
  } catch (e) {
    next(e);
  }
};
