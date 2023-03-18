import { faker } from '@faker-js/faker';
import { Category, Frequency } from '@prisma/client';
import { createBusinessWithUserDto } from '../../lib/types/expense.types';

interface MockBusiness {
  businessId: number;
  userId?: number;
  date?: any;
  description?: any;
  payee?: any;
  amount?: any;
  memo?: any;
  frequency?: any;
  category?: any;
  currency?: any;
  amortized?: any;
  imageUrl?: any;
}
const generateMockExpense = (
  mockBusiness: MockBusiness
): createBusinessWithUserDto => {
  const data = {
    date: new Date(faker.date.past()),
    description: faker.random.words(5),
    payee: faker.company.name(),
    amount: Number(faker.commerce.price()),
    memo: faker.random.words(10),
    frequency: Frequency.ONETIME,
    category: Category.GENERAL,
    currency: 'USD',
    amortized: false,
    imageUrl: undefined,
    userId: undefined,
  };

  return { ...data, ...mockBusiness } as createBusinessWithUserDto;
};

const generateMockExpenses = (
  number: number,
  mockBusinessId: number[],
  userId: number
) => {
  const expenses = [...Array(number)].map(() => {
    const businessId: number =
      mockBusinessId.length > 1
        ? mockBusinessId[Math.floor(Math.random() * mockBusinessId.length)]
        : mockBusinessId[0];

    return generateMockExpense({ businessId, userId });
  });

  return expenses;
};

export { generateMockExpense, generateMockExpenses };
