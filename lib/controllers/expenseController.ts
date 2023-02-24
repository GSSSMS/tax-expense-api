import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import validate from '../middleware/validate';
import prisma from '../prisma';
import ExpenseService from '../services/ExpenseService';
import { ModelName } from '../types/prisma.interfaces';
import {
  createExpenseValidation,
  updateExpenseValidation,
} from '../validators/expenseValidation';

export default Router()
  .post(
    '/',
    [authenticate, validate(createExpenseValidation)],
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      try {
        const expense = await ExpenseService.createExpense({
          ...req.body,
          userId: user?.id,
        });

        res.json(expense);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(
    '/user_expenses',
    [authenticate],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
        const expenses = await prisma.expense.findMany({
          where: {
            userId: {
              equals: user?.id,
            },
          },
        });

        res.json(expenses);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(
    '/business_expenses/:id',
    [authenticate],
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const { id } = req.params;

      try {
        const business = await prisma.business.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (business?.userId !== user?.id) {
          throw createHttpError(401, 'Not Authorized');
        }
        const expenses = await prisma.expense.findMany({
          where: {
            businessId: {
              equals: Number(id),
            },
          },
          include: {
            Business: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        res.json(expenses);
      } catch (error) {
        next(error);
      }
    }
  )
  .get(
    '/:id',
    [authenticate],
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const { id } = req.params;

      try {
        const existingExpense = await prisma.expense.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (existingExpense?.userId !== user?.id) {
          throw createHttpError(401, 'Not Authorized');
        }
        const expense = await prisma.expense.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.json(expense);
      } catch (error) {
        next(error);
      }
    }
  )
  .patch(
    '/:id',
    [
      authenticate,
      authorize(ModelName.EXPENSE),
      validate(updateExpenseValidation),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const { id } = req.params;
      try {
        const expense = await ExpenseService.updateExpense(Number(id), {
          ...req.body,
          userId: user?.id,
        });

        res.json(expense);
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(
    '/:id',
    [authenticate, authorize(ModelName.EXPENSE)],
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      try {
        const expense = await prisma.expense.delete({
          where: {
            id: Number(id),
          },
        });
        res.json(expense);
      } catch (error) {
        next(error);
      }
    }
  );
