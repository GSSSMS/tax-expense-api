import prisma from './test-utils/testPrisma';
import app from '../lib/app';
import request from 'supertest';
import { truncate } from './test-utils/truncate';
import { createUserDto } from '../lib/types/users.dto';
import { registerAndLogin } from './test-utils/registerAndLogin';
import { generateMockBusiness } from './test-utils/businessTestUtils';
import { generateMockExpense } from './test-utils/expenseTestUtils';
import { Expense } from '@prisma/client';

const mockUser: createUserDto = {
  email: 'test@test1.com',
  password: '123456',
};

// f
let agent: any;
beforeEach(async () => {
  await truncate(['Business', 'User', 'Expense'], prisma);
  agent = request.agent(app);
});

describe('Expense CRUD', () => {
  it('#POST /expenses creates an expense', async () => {
    const user = await registerAndLogin(mockUser, agent);

    const mockBusiness = generateMockBusiness(user.id, 'USD');
    const business = await prisma.business.create({
      data: mockBusiness,
    });

    const mockExpense = generateMockExpense(
      user.id,
      business.id,
      'ONETIME',
      'GENERAL',
      'USD',
      false
    );

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(200);
    expect(res.body?.userId).toBe(user.id);
    expect(res.body?.businessId).toBe(business.id);

    expect(res.body).toEqual({
      id: expect.any(Number),
      ...mockExpense,
      date: expect.any(String),
    });
  });

  it('#POST /expenses with no currency, adds the default business currency', async () => {
    const user = await registerAndLogin(mockUser, agent);

    const mockBusiness = generateMockBusiness(user.id, 'USD');
    const business = await prisma.business.create({
      data: mockBusiness,
    });

    const mockExpense = generateMockExpense(
      user.id,
      business.id,
      'ONETIME',
      'GENERAL',
      undefined,
      false
    );

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(200);
    expect(res.body?.currency).toBe(business.currency);
  });
});
