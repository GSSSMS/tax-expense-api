import request from 'supertest';
import { truncate } from './test-utils/truncate';
import prisma from './test-utils/testPrisma';
import app from '../lib/app';
import { createUserDto } from '../lib/types/users.dto';
import { registerAndLogin } from './test-utils/registerAndLogin';
import { createBusinessDto } from '../lib/types/business.dto';
import {
  generateMockBusiness,
  generateMockBusinesses,
  addIdsToDataArray,
} from './test-utils/businessTestUtils';
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

let agent: any;
beforeEach(async () => {
  await truncate(['Business', 'User'], prisma);
  agent = request.agent(app);
});

describe('business-routes', () => {
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

  it('creates multiple businesses', async () => {
    const user = await registerAndLogin(mockUser, agent);

    const mockBusinesses = generateMockBusinesses(5, [user]);

    const res = await agent.post('/businesses').send(mockBusinesses);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);

    const businessesRes = await agent.get('/businesses/user_businesses');

    const mockBusinessesWithIds = addIdsToDataArray(mockBusinesses);

    expect(businessesRes.body).toEqual(
      expect.arrayContaining(mockBusinessesWithIds)
    );
  });

  it('#GET /businesses/user_business returns all of a users businesses', async () => {
    const user2 = await registerAndLogin(mockUser2, agent);
    const user1 = await registerAndLogin(mockUser, agent);

    const data = generateMockBusinesses(10, [user1, user2], ['USD', 'CHF']);

    await prisma.business.createMany({ data });

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

  it('UPDATE /business/:id should update a business', async () => {
    const user = await registerAndLogin(mockUser, agent);

    const newBusiness = generateMockBusiness(user.id, 'USD');

    const business = await prisma.business.create({ data: newBusiness });

    const res = await agent.put(`/businesses/${business.id}`).send({
      name: 'New Business',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...business, name: 'New Business' });
  });

  it('UPDATE /business/:id should only update a users business', async () => {
    const secondaryUser = await registerAndLogin(mockUser, agent);

    const secondaryBusiness = await prisma.business.create({
      data: generateMockBusiness(secondaryUser.id),
    });

    await registerAndLogin(mockUser2, agent);

    const res = await agent
      .put(`/businesses/${secondaryBusiness.id}`)
      .send({ name: 'Not my business' });
    expect(res.status).toBe(401);
  });
});
