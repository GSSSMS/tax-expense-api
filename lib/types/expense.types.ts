import { Expense } from '@prisma/client';
export type createExpenseDto = Omit<Expense, 'id'>;
