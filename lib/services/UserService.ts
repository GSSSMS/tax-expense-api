import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import prisma from '../prisma';
import { createUserDto } from '../dtos/users.dto';
import createError, { HttpError } from 'http-errors';
import { UserSelect } from '../interfaces/users.interfaces';
const JWT_SECRET =
  typeof process.env.JWT_SECRET === 'string' ? process.env.JWT_SECRET : '';
export default class UserService {
  static async signUpUser({
    email,
    password,
  }: createUserDto): Promise<[UserSelect, string]> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw createError(409, 'Email already exists');
    const passwordHash = await hash(password, Number(process.env.SALT_ROUNDS));
    const user = await prisma.user.create({
      data: { email, password: passwordHash },
      select: { id: true, email: true },
    });
    const token = sign(user, JWT_SECRET, { expiresIn: '1 day' });
    return [user, token];
  }
}
