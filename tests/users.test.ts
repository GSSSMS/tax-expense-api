import prisma from '../lib/prisma';
import app from '../lib/app';
import request from 'supertest';
import { truncate } from './test-utils/truncate';
import { createUserDto } from '../lib/dtos/users.dto';
const mockUser: createUserDto = {
  email: 'test@test1.com',
  password: '123456',
};

beforeEach(async () => {
  await truncate(['User'], prisma);
});

describe('user-auth-routes', () => {
  const agent = request.agent(app);

  it('#POST creates a user', async () => {
    const res = await request(app).post('/users').send(mockUser);
    const { email } = mockUser;

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      email,
    });
  });

  it('#GET/#id returns a user', async () => {
    const user = await prisma.user.create({
      data: { ...mockUser },
      select: { id: true, email: true },
    });

    const res = await request(app).get(`/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it('#GET/:id returns 404 if no user', async () => {
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(404);
  });

  it.only('logs in a user', async () => {
    await prisma.user.create({
      data: { ...mockUser },
    });
    const res = await agent.post('/users/sessions').send(mockUser);

    expect(res.status).toBe(200);

    console.log(res);
  });
});
