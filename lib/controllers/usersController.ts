import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import UserService from '../services/UserService';
import { COOKIE_NAME } from '../config';
import { Prisma } from '@prisma/client';
import createHttpError from 'http-errors';
import authenticate from '../middleware/authenticate';
import validate from '../middleware/validate';
import { createUserValidation } from '../validators/userValidation';
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 60;
export default Router()
  .post(
    '/',
    [validate(createUserValidation)],
    async (req: Request, res: Response, next: NextFunction) => {
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
  .get('/me', authenticate, async (req: Request, res: Response) => {
    res.json(req.user);
  })
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
