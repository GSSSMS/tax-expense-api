import { User } from '@prisma/client';
import { createBusinessWithUserDto } from '../../lib/types/business.dto';
import { faker } from '@faker-js/faker';
function generateMockBusinesses(
  number: number,
  users: User[],
  currencies: string[] = ['USD']
): createBusinessWithUserDto[] {
  const businesses = [...Array(number)].map(() => {
    const userId: number =
      currencies.length > 1
        ? users[Math.floor(Math.random() * users.length)].id
        : users[0].id;

    const currency: string =
      currencies.length > 1
        ? currencies[Math.floor(Math.random() * currencies.length)]
        : currencies[0];

    return generateMockBusiness(userId, currency);
  });

  return businesses;
}

const generateMockBusiness = (
  userId: number,
  currency = 'USD'
): createBusinessWithUserDto => {
  const name = faker.company.name();
  console.log(userId);

  return {
    name,
    userId,
    currency,
  };
};

function addIdsToDataArray(dataArray: any[]): any[] {
  return dataArray.map((obj) => ({ id: expect.any(Number), ...obj }));
}

export { generateMockBusinesses, addIdsToDataArray, generateMockBusiness };
