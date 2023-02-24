import { Frequency } from '@prisma/client';
import prisma from '../prisma';
import { createExpenseDto } from '../types/expense.types';

class ExpenseService {
  static async createExpense(expense: createExpenseDto) {
    await this.addDefaultValues(expense);
    const newExpense = await prisma.expense.create({
      data: expense,
    });
    return newExpense;
  }

  static async addDefaultValues(expense: createExpenseDto) {
    const { frequency, currency } = expense;
    if (!frequency) {
      expense.frequency = Frequency.ONETIME;
    }
    if (!currency) {
      // guarantied to have a business b/c of validation
      expense.currency = (await this.getDefaultCurrency(expense)) as string;
    }
  }

  static async updateExpense(id: number, expense: createExpenseDto) {
    const updateExpense = await prisma.expense.update({
      where: { id },
      data: expense,
    });

    return updateExpense;
  }

  static async getDefaultCurrency(expense: createExpenseDto) {
    const { businessId } = expense;
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    return business?.currency;
  }
}

export default ExpenseService;
