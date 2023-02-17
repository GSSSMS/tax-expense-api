import prisma from '../prisma';
import createHttpError from 'http-errors';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces/auth.interfaces';
class authorizationMiddleware {
  resource;
  constructor(resource: ModelName) {
    this.resource = resource;
  }

  public async authorize(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const { id } = req.params;
      if (req.method === 'PUT' || req.method == 'DELETE') {
        const item = await prisma[this.resource].findUnique({
          where: { id: Number(id) },
        });
        console.log('item', item);
        if (item && item.userId !== user.id) {
          throw createHttpError(401, 'Not Authorized');
        }
        console.log(req.body);
        next(req);
      }
    } catch (error) {
      next(error);
    }
  }
}

type ModelName = 'business';

export default authorizationMiddleware;
