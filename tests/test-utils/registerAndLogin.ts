import { User } from '@prisma/client';
import { createUserDto } from '../../lib/types/users.dto';
export const registerAndLogin = async (
  user: createUserDto,
  agent: any
): Promise<User> => {
  const res = await agent.post('/users').send(user);
  return res.body;
};
