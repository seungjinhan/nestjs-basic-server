import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// npx prisma db seed

async function main() {
  for (let index = 0; index < 77; index++) {
    await prisma.user.create({
      data: {
        email: `han_${index}@test.com`,
        name: `good_${index}`,
        password: '1234',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
