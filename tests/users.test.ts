import prisma from '../lib/prisma';
import app from '../lib/app';
import request from 'supertest';
import { truncate } from './test-utils/truncate';
import { createUserDto } from '../lib/dtos/users.dto';
import { registerAndLogin } from './test-utils/registerAndLogin';
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
    const user = await registerAndLogin(mockUser, agent);
    const res = await agent.get(`/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it('#GET/:id returns 401 if not logged in', async () => {
    const user = await prisma.user.create({
      data: mockUser,
    });
    const res = await request(app).get(`/users/${user.id}`);
    expect(res.status).toBe(401);
  });

  it('logs in a user', async () => {
    await request(app).post('/users').send(mockUser);
    const res = await agent.post('/users/sessions').send(mockUser);
    expect(res.status).toBe(200);
  });

  it.only('#DELETE /users/sessions deletes a user session', async () => {
    const user = await registerAndLogin(mockUser, agent);
    const logout = await agent.delete('/users/sessions');
    expect(logout.status).toBe(200);
    expect(logout.body).toEqual({
      success: true,
      message: 'Sign out successful',
    });
    const res = await agent.get(`/users/${user.id}`);
    expect(res.status).toBe(401);
  });
});
