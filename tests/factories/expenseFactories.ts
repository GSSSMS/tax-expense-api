import { faker } from '@faker-js/faker';
import { Category, Frequency } from '@prisma/client';
import { userInfo } from 'os';

interface MockBusiness {
  businessId: number;
  userId: number;
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
const generateMockExpense = (mockBusiness: MockBusiness) => {
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

  return { ...data, ...mockBusiness };
};

export { generateMockExpense };
