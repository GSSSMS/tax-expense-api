import { Prisma } from '@prisma/client';
import { Router, Response, NextFunction, Request } from 'express';
import createHttpError from 'http-errors';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import prisma from '../prisma';
import BusinessService from '../services/BusinessService';

export default Router()
  .post(
    '/',
    [authenticate],
    async (req: Request, res: Response, next: NextFunction) => {
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
    [authenticate],
    async (req: Request, res: Response, next: NextFunction) => {
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
    [authenticate, authorize('business')],
    async (req: Request, res: Response, next: NextFunction) => {
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
