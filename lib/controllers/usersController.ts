import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import prisma from '../prisma';
import UserService from '../services/UserService';
import { COOKIE_NAME } from '../config';
import { Prisma } from '@prisma/client';
import createHttpError from 'http-errors';
import authenticate from '../middleware/authenticate';
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 60;
export default Router()
  .post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [user, token] = await UserService.signUpUser(req.body);
      res
        .cookie(COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json(user);
    } catch (error) {
      next(error);
    }
  })
  .get(
    '/:id',
    authenticate as RequestHandler,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
          where: {
            id: Number(id),
          },
          select: selectUser,
        });

        if (!user) throw createHttpError(404, 'user not Found');
        res.json(user);
      } catch (error) {
        next(error);
      }
    }
  )
  .post(
    '/sessions',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const [user, token] = await UserService.signInUser(req.body);

        res
          .cookie(COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .json(user);
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(
    '/sessions',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res
          .clearCookie(COOKIE_NAME)
          .json({ success: true, message: 'Sign out successful' });
      } catch (error) {
        next(error);
      }
    }
  );

const selectUser: Prisma.UserSelect = { id: true, email: true };
