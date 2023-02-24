import { body, ValidationChain } from 'express-validator';
import prisma from '../prisma';

export const createUserValidation: ValidationChain[] = [
  body('email').isEmail().withMessage('Email is not valid'),
  body('email').custom((value) => {
    return prisma.user.findUnique({ where: { email: value } }).then((user) => {
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    });
  }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
