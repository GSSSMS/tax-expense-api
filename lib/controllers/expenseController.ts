import { Router, Request, Response, NextFunction } from 'express';
import authenticate from '../middleware/authenticate';
import ExpenseService from '../services/ExpenseService';

export default Router().post(
  '/',
  [authenticate],
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
);
