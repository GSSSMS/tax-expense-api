import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationChain,
  ValidationError,
} from 'express-validator';
import createHttpError from 'http-errors';

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req).formatWith(errorFormatter);

    if (errors.isEmpty()) {
      return next();
    }

    const error = createHttpError(400, [...new Set(errors.array())].join(', '));
    next(error);
  };
};

const errorFormatter = ({ msg }: ValidationError) => {
  return msg;
};
export default validate;
