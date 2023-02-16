import request from 'supertest';
import { truncate } from './test-utils/truncate';
import prisma from '../lib/prisma';
import app from '../lib/app';
import { createUserDto } from '../lib/dtos/users.dto';
import { registerAndLogin } from './test-utils/registerAndLogin';
import { createBusinessDto } from '../lib/dtos/business.dto';
import { faker } from '@faker-js/faker';

const mockUser: createUserDto = {
  email: 'test@test1.com',
  password: '123456',
};
const mockUser2: createUserDto = {
  email: 'test@test2.com',
  password: '123456',
};

const mockBusiness: createBusinessDto = {
  name: 'Ski-School',
  currency: 'CHF',
};

beforeEach(async () => {
  await truncate(['Business', 'User'], prisma);
  // await truncate([], prisma);
});

describe('business-routes', () => {
  const agent = request.agent(app);

  it('#POST creates a new business', async () => {
    const user = await registerAndLogin(mockUser, agent);

    const res = await agent.post('/businesses').send(mockBusiness);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      userId: user.id,
      ...mockBusiness,
    });
  });

  it('#POST returns a 403 if currency is invalid', async () => {
    await registerAndLogin(mockUser, agent);

    const res = await agent.post('/businesses').send({
      name: 'Test biz',
      currency: 'ABC',
    });

    expect(res.status).toBe(403);
  });

  it('#GET /businesses/user_business returns all of a users businesses', async () => {
    const user2 = await registerAndLogin(mockUser2, agent);
    const user1 = await registerAndLogin(mockUser, agent);

    const currencies = ['CHF', 'USD'];
    const data = [...Array(10)].map((_, i) => {
      return {
        userId: i % 2 === 0 ? user1.id : user2.id,
        name: faker.internet.userName(),
        currency: currencies[Math.floor(Math.random() * currencies.length)],
      };
    });
    await prisma.business.createMany({
      data,
    });

    const res = await agent.get('/businesses/user_businesses');

    const user1Businesses = data
      .filter((business) => business.userId === user1.id)
      .map((business) => ({ ...business, id: expect.any(Number) }));
    const user2Business = data
      .filter((business) => business.userId === user2.id)
      .map((business) => ({ ...business, id: expect.any(Number) }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(user1Businesses));
    expect(res.body).toEqual(expect.not.arrayContaining(user2Business));
  });
});
