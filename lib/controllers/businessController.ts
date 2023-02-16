import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { AuthRequest } from '../interfaces/auth.interfaces';
import authenticate from '../middleware/authenticate';
import prisma from '../prisma';
import BusinessService from '../services/BusinessService';
export default Router()
  .post(
    '/',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [authenticate],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      console.log(req.body);

      try {
        const user = req.user;
        const business = await BusinessService.createBusiness({
          userId: Number(user.id),
          ...req.body,
        });
        res.json(business);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(
    '/user_businesses',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [authenticate],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
        const businesses = await prisma.business.findMany({
          where: {
            userId: {
              equals: user.id,
            },
          },
        });
        res.json(businesses);
      } catch (error) {
        next(error);
      }
    }
  );
