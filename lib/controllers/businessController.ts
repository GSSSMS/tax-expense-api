import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { AuthRequest } from '../interfaces/auth.interfaces';
import authenticate from '../middleware/authenticate';
import BusinessService from '../services/BusinessService';
export default Router().post(
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
);
