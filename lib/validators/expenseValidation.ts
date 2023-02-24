import { ValidationChain, body } from 'express-validator';
import { Frequency, Category } from '@prisma/client';
import { currencyCodes } from '../data/currency';
import { resourceBelongsToUser, resourceExists } from './generalValidation';
import { ModelName } from '../types/prisma.interfaces';
export const createExpenseValidation: ValidationChain[] = [
  body('date')
    //TODO proper date format
    .isString()
    .withMessage('Date must be a date'),
  body('frequency')
    .optional()
    .isIn(Object.values(Frequency))
    .withMessage('Must be a valid frequency'),
  body('description').isString().withMessage('Description must be a string'),
  body('payee').isString().withMessage('Payee must be a string'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('memo').optional().isString().withMessage('Memo must be a string'),
  body('category')
    .optional()
    .isIn(Object.values(Category))
    .withMessage('Must be a valid category'),
  body('amortized').isBoolean().withMessage('Amortized must be a boolean'),
  body('currency').optional().isIn(currencyCodes),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  resourceExists(ModelName.BUSINESS, 'businessId'),
  resourceBelongsToUser(ModelName.BUSINESS, 'businessId'),
];

export const updateExpenseValidation: ValidationChain[] = [
  body('date')
    .optional() //TODO proper date format
    .isString()
    .withMessage('Date must be a date'),
  body('frequency')
    .optional()
    .optional()
    .isIn(Object.values(Frequency))
    .withMessage('Must be a valid frequency'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('payee').optional().isString().withMessage('Payee must be a string'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('memo')
    .optional()
    .optional()
    .isString()
    .withMessage('Memo must be a string'),
  body('category')
    .optional()
    .isIn(Object.values(Category))
    .withMessage('Must be a valid category'),
  body('amortized')
    .optional()
    .isBoolean()
    .withMessage('Amortized must be a boolean'),
  body('currency').optional().isIn(currencyCodes),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  resourceExists(ModelName.BUSINESS, 'businessId', true),
  resourceBelongsToUser(ModelName.BUSINESS, 'businessId', true),
];

// userId is validated in the auth middleware
// need to ensure that the businessId belongs to the user
