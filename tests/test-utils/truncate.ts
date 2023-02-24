import { PrismaClient } from '@prisma/client';

export const truncate = async (
  tableNames: string[],
  prisma: PrismaClient
): Promise<void> => {
  const tables = tableNames.map((tableName) => `"${tableName}"`).join(', ');
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.error({ error });
  }
};
