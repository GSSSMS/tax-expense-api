import app from '../lib/app';
import request from 'supertest';
import { truncate } from './test-utils/truncate';
import { createUserDto } from '../lib/types/users.dto';
import { registerAndLogin } from './test-utils/registerAndLogin';
import {
  addIdsToDataArray,
  generateMockBusiness,
} from './test-utils/businessTestUtils';
import { generateMockExpense } from './factories/expenseFactories';
import { Business, Expense } from '@prisma/client';
import prisma from '../lib/prisma';
import { UserSelect } from '../lib/types/users.interfaces';

const mockUser: createUserDto = {
  email: 'test@test1.com',
  password: '123456',
};

let agent: any;
let user: UserSelect;
let business: Business;

beforeEach(async () => {
  await truncate(['Business', 'User', 'Expense'], prisma);
  agent = request.agent(app);
  user = await registerAndLogin(mockUser, agent);
  business = await prisma.business.create({
    data: generateMockBusiness(user.id, 'USD'),
  });
});

describe('Expense CRUD', () => {
  it('#POST /expenses creates an expense', async () => {
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(200);
    expect(res.body?.userId).toBe(user.id);
    expect(res.body?.businessId).toBe(business.id);

    expect(res.body).toEqual({
      id: expect.any(Number),
      ...mockExpense,
      userId: user.id,
      date: expect.any(String),
      imageUrl: null,
    });
  });

  it('#POST /expenses returns 400 if expense is invalid', async () => {
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
      category: 'INVALID',
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(400);
  });

  it('#POST /expenses returns 400 if business does not exist', async () => {
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id + 1,
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(400);
  });

  it('#POST /expenses returns 400 if business does not belong to user', async () => {
    const user2 = await prisma.user.create({
      data: {
        email: 'user2@test.com',
        password: '123456',
      },
    });
    const mockBusiness = generateMockBusiness(user2.id, 'USD');
    const business = await prisma.business.create({
      data: mockBusiness,
    });

    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(400);
  });

  it('#POST /expenses returns 400 if ammount is invalid', async () => {
    // TODO make sure that ammounts are not negative!
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
      amount: {},
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(400);
  });

  it('#POST /expenses with no currency, adds the default business currency', async () => {
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
      currency: undefined,
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(200);
    expect(res.body?.currency).toBe(business.currency);
  });

  it('#POST /expenses with no frequency, adds the default frequency', async () => {
    const mockExpense = generateMockExpense({
      userId: user.id,
      businessId: business.id,
      frequency: undefined,
    });

    const res = await agent.post('/expenses').send(mockExpense);

    expect(res.status).toBe(200);
    expect(res.body?.frequency).toBe('ONETIME');
  });

  it('#PATCH /expenses/:id updates an expense amount', async () => {
    const mockExpense = generateMockExpense({
      businessId: business.id,
      userId: user.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent
      .patch(`/expenses/${expense.id}`)
      .send({ amount: 100 });

    expect(res.status).toBe(200);
    expect(res.body?.amount).toBe(100);
  });

  it('#PATCH /expenses/:id returns 401 if the user is not authorized to update expense', async () => {
    const user2 = await prisma.user.create({
      data: {
        email: 'user2@test.com',
        password: '123456',
      },
    });

    const business2 = await prisma.business.create({
      data: generateMockBusiness(user2.id, 'USD'),
    });

    const mockExpense = generateMockExpense({
      businessId: business2.id,
      userId: user2.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent
      .patch(`/expenses/${expense.id}`)
      .send({ amount: 100 });

    expect(res.status).toBe(401);
  });

  it(' PATCH /expenses/:id returns 400 if expense is invalid', async () => {
    const mockExpense = generateMockExpense({
      businessId: business.id,
      userId: user.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent
      .patch(`/expenses/${expense.id}`)
      .send({ category: 'INVALID' });

    expect(res.status).toBe(400);
  });

  it('#PATCH /expenses/:id returns 400 if business does not exist', async () => {
    const mockExpense = generateMockExpense({
      businessId: business.id,
      userId: user.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent
      .patch(`/expenses/${expense.id}`)
      .send({ businessId: business.id + 1 });

    expect(res.status).toBe(400);
  });

  it('#GET /expenses/:id returns an expense', async () => {
    const mockExpense = generateMockExpense({
      businessId: business.id,
      userId: user.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent.get(`/expenses/${expense.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...expense, date: expect.any(String) });
  });

  it('#GET /expenses/:id returns 401 if the user is not authorized to get expense', async () => {
    const user2 = await prisma.user.create({
      data: {
        email: 'user2@user2.com',
        password: '123456',
      },
    });

    const business2 = await prisma.business.create({
      data: generateMockBusiness(user2.id, 'USD'),
    });

    const mockExpense = generateMockExpense({
      businessId: business2.id,
      userId: user2.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent.get(`/expenses/${expense.id}`);

    expect(res.status).toBe(401);
  });

  it('#GET /expenses/user_expenses returns all expenses for a user', async () => {
    const mockExpenses = [...Array(5)].map(() =>
      generateMockExpense({ businessId: business.id, userId: user.id })
    );

    await prisma.expense.createMany({
      data: mockExpenses,
    });

    const res = await agent.get('/expenses/user_expenses');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
  });

  it('#GET /expenses/business_expenses/:id returns all expenses for a business', async () => {
    const mockExpenses = [...Array(5)].map(() =>
      generateMockExpense({ businessId: business.id, userId: user.id })
    );

    await prisma.expense.createMany({
      data: mockExpenses,
    });

    const res = await agent.get(`/expenses/business_expenses/${business.id}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    expect(
      res.body.every(({ businessId }: any) => businessId === business.id)
    ).toBe(true);
    expect(
      res.body.every(({ Business: { name } }: any) => name === business.name)
    ).toBe(true);
  });
  it('#DELETE /expenses/:id deletes an expense', async () => {
    const mockExpense = generateMockExpense({
      businessId: business.id,
      userId: user.id,
    });

    const expense = await prisma.expense.create({
      data: mockExpense,
    });

    const res = await agent.delete(`/expenses/${expense.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...expense, date: expect.any(String) });

    const deletedExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
    });

    expect(deletedExpense).toBeNull();
  });
});
