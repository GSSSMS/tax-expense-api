import prisma from '../prisma';
import createHttpError from 'http-errors';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces/auth.interfaces';

type ResourceName = 'business';
const authorize = (resourceName: ResourceName) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { id } = req.params;
      if (req.method === 'PUT' || req.method == 'DELETE') {
        const item = await prisma[resourceName].findUnique({
          where: { id: Number(id) },
        });

        if (item && item.userId !== user.id) {
          throw createHttpError(401, 'Not Authorized');
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
