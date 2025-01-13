import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Adicionar ou atualizar usuários
  const user1 = await prisma.user.upsert({
    where: { code_name: 'ABCD1234' },
    update: { name: 'John Doe' },
    create: {
      code_name: 'ABCD1234',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { code_name: 'EFGH5678' },
    update: { name: 'Jane Doe' },
    create: {
      code_name: 'EFGH5678',
      name: 'Jane Doe',
    },
  });

  // Adicionar sessões de trabalho
  await prisma.workSession.createMany({
    data: [
      {
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        end_time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        user_id: user1.id,
      },
      {
        start_time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        end_time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
        user_id: user2.id,
      },
    ],
  });

  console.log('Seed completo!');
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
