import { faker } from '@faker-js/faker';
import { Frequency, Category } from '@prisma/client';
import { createExpenseDto } from '../../lib/types/expense.types';
const generateMockExpense = (
  userId: number,
  businessId: number,
  frequency = Frequency.ONETIME,
  category = Category.GENERAL,
  currency: string | null | undefined = 'USD',
  amortized = false
) => {
  const date = faker.date.past();
  const description = faker.random.words(5);
  const payee = faker.company.name();
  const amount = Number(faker.commerce.price());
  const memo = faker.random.words(10);

  return {
    userId,
    businessId,
    frequency,
    description,
    category,
    currency,
    amortized,
    date,
    memo,
    payee,
    amount,
    imageUrl: null,
  };
};

export { generateMockExpense };
