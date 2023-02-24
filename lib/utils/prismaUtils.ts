import prisma from '../prisma';
import { ModelName } from '../types/prisma.interfaces';
export const findUniqueById = async (
  modelName: ModelName,
  id: string | number | undefined | null
): Promise<any> => {
  if (!id) throw new Error('No id provided');
  switch (modelName) {
    case 'business':
      return prisma.business.findUnique({ where: { id: Number(id) } });
    case 'expense':
      return prisma.expense.findUnique({ where: { id: Number(id) } });
    case 'user':
      return prisma.user.findUnique({ where: { id: Number(id) } });
    default:
      return Promise.reject('Invalid model');
  }
};
