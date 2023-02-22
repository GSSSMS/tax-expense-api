import { check, ValidationChain } from 'express-validator';

export const createUserValidation: ValidationChain[] = [
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
