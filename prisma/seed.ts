import { Language, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  // eslint-disable-next-line no-console
  console.log('Seeding...');

  await prisma.user.create({
    data: {
      email: 'maverick@topgun.com',
      name: 'Pete',
      language: Language.EN_US,
      password: '$2b$10$yjh4MYBO/eNJKxcpODqbt.dQ/0u80wV.bR5uFRv7n27bmHI0glw1G', // Secret42
      favouritePokemonId: 25,
      terms: true,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Data loaded!');
}

// eslint-disable-next-line promise/catch-or-return
main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
