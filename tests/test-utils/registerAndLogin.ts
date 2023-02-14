import { createUserDto } from '../../lib/dtos/users.dto';
export const registerAndLogin = async (user: createUserDto, agent: any) => {
  const res = await agent.post('/users').send(user);
  return res.body;
};
