import { Expense } from '@prisma/client';
export type createExpenseDto = Omit<Expense, 'id'>;

export interface createBusinessWithUserDto extends createExpenseDto {
  userId: number;
}
