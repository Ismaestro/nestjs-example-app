import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.hero.deleteMany();

  console.log('Seeding...');

  await prisma.user.create({
    data: {
      email: 'maverick@topgun.com',
      firstname: 'Pete',
      language: 'en',
      password: '$2b$10$yjh4MYBO/eNJKxcpODqbt.dQ/0u80wV.bR5uFRv7n27bmHI0glw1G', // Secret42
      heroes: {
        createMany: {
          data: [
            {
              realName: 'Peter Parker',
              alterEgo: 'Spiderman',
              public: true,
              image: 'https://i.ibb.co/5G7jfdg/spiderman.jpg',
            },
            {
              realName: 'Tsubasa Ōzora',
              alterEgo: 'Oliver Atton',
              public: true,
              image: 'https://i.ibb.co/kh3ytZg/oliver.jpg',
            },
            {
              realName: 'Kakarotto',
              alterEgo: 'Goku',
              public: true,
              image: 'https://i.ibb.co/s5bd4BX/goku.png',
            },
            {
              realName: 'Bruce Wayne',
              alterEgo: 'Batman',
              public: true,
              image: 'https://i.ibb.co/HP55tkv/batman.jpg',
            },
            {
              realName: 'Clark Joseph Kent',
              alterEgo: 'Superman',
              public: true,
              image: 'https://i.ibb.co/TqvdYyJ/superman.jpg',
            },
          ],
        },
      },
    },
  });

  console.log('Data loaded!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
