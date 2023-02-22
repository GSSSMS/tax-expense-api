import { verify } from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { COOKIE_NAME, JWT_SECRET } from '../config';
import { UserSelect } from '../types/users.interfaces';
import createHttpError from 'http-errors';
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookie = req.cookies && req.cookies[COOKIE_NAME];
    if (!cookie) throw createHttpError(404, 'Must be signed in to continue');

    const user = verify(cookie, JWT_SECRET) as UserSelect;
    if (!user) throw createHttpError(403, 'Invalid token');
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
