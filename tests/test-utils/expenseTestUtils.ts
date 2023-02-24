import { faker } from '@faker-js/faker';
import { Category, Frequency } from '@prisma/client';

interface MockBusiness {
  userId: number;
  businessId: number;
  date?: Date;
  description?: string;
  payee?: string;
  amount?: number;
  memo?: string;
  frequency?: Frequency;
  category?: Category;
  currency?: string;
  amortized?: boolean;
  imageUrl?: string | null;
}
const generateMockExpense = (mockBusiness: MockBusiness) => {
  const data = {
    date: faker.date.past(),
    description: faker.random.words(5),
    payee: faker.company.name(),
    amount: Number(faker.commerce.price()),
    memo: faker.random.words(10),
    frequency: Frequency.ONETIME,
    category: Category.GENERAL,
    currency: 'USD',
    amortized: false,
    imageUrl: null,
  };

  return { ...data, ...mockBusiness };
};

export { generateMockExpense };
