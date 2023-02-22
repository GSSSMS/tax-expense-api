import { ValidationChain, body } from 'express-validator';
import { currencyCodes } from '../data/currency';
export const createBusinessValidation: ValidationChain[] = [
  body('name').isString().withMessage('Name must be a string'),
  body('name').not().isEmpty().withMessage('Name cannot be empty'),
  body('currency').isIn(currencyCodes).withMessage('Invalid Currency'),
];

export const createManyBusinessesValidation: ValidationChain[] = [
  body().isArray().withMessage('Must be an array'),
  body('*.name').isString().withMessage('Name must be a string'),
  body('*.name').not().isEmpty().withMessage('Name cannot be empty'),
  body('*.currency').isIn(currencyCodes).withMessage('Invalid Currency'),
];

export const updateBusinessValidation: ValidationChain[] = [
  body('name').optional().isString().withMessage('Name must be a string'),
  body('name').optional().not().isEmpty().withMessage('Name cannot be empty'),
  body('currency')
    .optional()
    .isIn(currencyCodes)
    .withMessage('Invalid Currency'),
];
