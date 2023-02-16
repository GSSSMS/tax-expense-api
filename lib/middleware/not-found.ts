import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
};
