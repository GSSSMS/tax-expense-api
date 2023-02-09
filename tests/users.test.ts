import { PrismaClient, User } from '@prisma/client'
import app from "../lib/app";
import request from "supertest";


const mockUser: User = {
    id: 1,
    email: 'test@test1.com',
    password: '123456'
}

beforeEach(async () => {
    await new PrismaClient().$queryRaw`DELETE FROM "User";`
})

describe('user-login-routes', () => {
    it('#POST creates a user', async () => {
        const res = await request(app).post('/users').send(mockUser);
        const { email } = mockUser;
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            id: expect.any(Number),
            email,
        })
    })
}) 

