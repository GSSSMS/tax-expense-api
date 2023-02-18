import { Router, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { AuthRequest } from '../interfaces/auth.interfaces';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import prisma from '../prisma';
import BusinessService from '../services/BusinessService';

export default Router()
  .post(
    '/',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [authenticate],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const user = req.user;

        if (Array.isArray(req.body)) {
          const businesses = await BusinessService.createManyBusinesses(
            Number(user.id),
            req.body
          );
          res.json(businesses);
        } else {
          const business = await BusinessService.createBusiness({
            userId: Number(user.id),
            ...req.body,
          });
          res.json(business);
        }
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
  )
  .put(
    '/:id',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [authenticate, authorize('business')],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const data = req.body;
        const user = req.user;

        const existingBusiness = await prisma.business.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (existingBusiness && existingBusiness.userId !== user.id) {
          throw createHttpError(401, 'Not Authorized');
        }

        const business = 'business';

        await prisma[business].findFirst({ where: { id: 1 } });
        const updatedBusiness = await prisma.business.update({
          where: { id: Number(id) },
          data,
        });
        res.json(updatedBusiness);
      } catch (error) {
        next(error);
      }
    }
  );
