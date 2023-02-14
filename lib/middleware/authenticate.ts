import { verify } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { COOKIE_NAME, JWT_SECRET } from '../config';
import createHttpError from 'http-errors';
import { AuthRequest } from '../interfaces/auth.interfaces';
import { UserSelect } from '../interfaces/users.interfaces';

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cookie = req.cookies && req.cookies[COOKIE_NAME];
    if (!cookie) createHttpError(404, 'Must be signed in to continue');

    const user = verify(cookie, JWT_SECRET) as UserSelect;

    req.user = user;

    next();
  } catch (error) {
    throw createHttpError(401, 'Authentication failed');
  }
};
