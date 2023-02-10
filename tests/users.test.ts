import { PrismaClient } from '@prisma/client';
import app from '../lib/app';
import request from 'supertest';
import { truncate } from './test-utils/truncate';
import { createUserDto } from '../lib/dtos/users.dto';
const mockUser: createUserDto = {
  email: 'test@test1.com',
  password: '123456',
};

beforeEach(async () => {
  await truncate(['User'], new PrismaClient());
});

describe('user-login-routes', () => {
  it('#POST creates a user', async () => {
    const res = await request(app).post('/users').send(mockUser);
    const { email } = mockUser;

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      email,
    });
  });
});
