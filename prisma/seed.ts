import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hash } from 'bcrypt';
import { generateMockBusinesses } from '../tests/factories/businessFactories';
import { generateMockExpenses } from '../tests/factories/expenseFactories';
async function main() {
  const seed = async (email: string) => {
    const password = await hash('password', Number(process.env.SALT_ROUNDS));
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    const businesses = await prisma.business.createMany({
      data: generateMockBusinesses(10, [user], ['USD', 'CHF']),
    });

    const businessIds = await prisma.business.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    const expenses = await prisma.expense.createMany({
      data: generateMockExpenses(
        100,
        businessIds.map(({ id }) => id),
        user.id
      ),
    });

    console.log({ user, businesses, expenses });
  };
  await seed('userone@example.com');
  await seed('usertwo@example.com');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
