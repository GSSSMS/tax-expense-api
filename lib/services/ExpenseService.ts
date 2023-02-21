import createHttpError from 'http-errors';
import prisma from '../prisma';
import { createExpenseDto } from '../types/expense.types';
import CurrencyService from './CurrencyService';

class ExpenseService {
  static async createExpense(expense: createExpenseDto) {
    await this.addDefaultValues(expense);
    await this.validateExpense(expense);
    const newExpense = await prisma.expense.create({
      data: expense,
    });
    return newExpense;
  }

  static async validateExpense(expense: createExpenseDto) {
    const { userId, businessId, currency } = expense;
    await this.validateBusiness(userId, businessId);
    this.validateCurrency(currency);
  }

  static async addDefaultValues(expense: createExpenseDto) {
    const { amortized, frequency, currency } = expense;
    if (!amortized) {
      expense.amortized = false;
    }
    if (!frequency) {
      expense.frequency = 'ONETIME';
    }
    if (!currency) {
      expense.currency = await this.getDefaultCurrency(expense);
    }
  }

  static validateCurrency(currency: string) {
    if (currency && !CurrencyService.isValidCurrency(currency)) {
      throw createHttpError(400, 'Invalid currency');
    }
  }

  static async getDefaultCurrency(expense: createExpenseDto) {
    const business = await prisma.business.findUnique({
      where: { id: expense.businessId },
    });
    return business?.currency || 'USD';
  }

  static async validateBusiness(userId: number, businessId: number) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) {
      throw createHttpError(400, 'Business not found');
    }
    if (business.userId !== userId) {
      throw createHttpError(400, 'Business does not belong to user');
    }
  }
}

export default ExpenseService;
