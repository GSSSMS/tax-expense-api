import { verify } from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { COOKIE_NAME, JWT_SECRET } from '../config';
import createHttpError from 'http-errors';
import { UserSelect } from '../types/users.interfaces';

export default (req: Request, res: Response, next: NextFunction) => {
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
