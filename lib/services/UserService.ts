import { hash, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import prisma from '../prisma';
import { createUserDto } from '../dtos/users.dto';
import createError from 'http-errors';
import { UserSelect } from '../interfaces/users.interfaces';
import { JWT_SECRET } from '../config';
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

  static async signInUser({ email, password }: createUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(user);

    if (!user) throw createError(404, 'user not found');
    console.log(user.password, password);

    const compare = compareSync(password, user.password);
    console.log(compare);

    if (!compareSync(password, user.password)) {
      throw createError(401, 'Invalid password or username');
    }

    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1 day' }
    );
    return token;
  }
}
