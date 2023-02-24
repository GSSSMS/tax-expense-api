import createHttpError from 'http-errors';
import { Response, NextFunction, Request } from 'express';
import { ModelName } from '../types/prisma.interfaces';
import { findUniqueById } from '../utils/prismaUtils';

const authorize = (modelName: ModelName) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { id } = req.params;
      if (
        req.method === 'PUT' ||
        req.method === 'PATCH' ||
        req.method == 'DELETE'
      ) {
        if (!user) throw createHttpError(401, 'Must be logged in');
        const item = await findUniqueById(modelName, id);
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
