import { Router, Response, NextFunction, Request } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validate from '../middleware/validate';
import prisma from '../prisma';
import BusinessService from '../services/BusinessService';
import {
  createBusinessValidation,
  createManyBusinessesValidation,
  updateBusinessValidation,
} from '../validators/businessValidation';

export default Router()
  .post(
    '/',
    [authenticate, validate(createBusinessValidation)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
        const business = await BusinessService.createBusiness({
          userId: Number(user?.id),
          ...req.body,
        });
        res.json(business);
      } catch (error) {
        next(error);
      }
    }
  )
  .post(
    '/many',
    [authenticate, validate(createManyBusinessesValidation)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
        const businesses = await BusinessService.createManyBusinesses(
          Number(user?.id),
          req.body
        );
        res.json(businesses);
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
              equals: user?.id,
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
    [authenticate, authorize('business'), validate(updateBusinessValidation)],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const data = req.body;

        console.log(data);

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
