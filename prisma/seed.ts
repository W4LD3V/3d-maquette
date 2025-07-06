import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

const user = await prisma.user.create({
    data: {
        email: 'test@maquette.dev',
        password: 'test1234',
    },
    });
      
  const [pla, petg] = await Promise.all([
    prisma.plasticType.create({ data: { name: 'PLA' } }),
    prisma.plasticType.create({ data: { name: 'PETG' } }),
  ]);

  const [black, white] = await Promise.all([
    prisma.color.create({ data: { name: 'Black', hex: '#000000' } }),
    prisma.color.create({ data: { name: 'White', hex: '#FFFFFF' } }),
  ]);

  await prisma.plasticColorAvailability.createMany({
    data: [
      { plasticTypeId: pla.id, colorId: black.id, inStock: true },
      { plasticTypeId: pla.id, colorId: white.id, inStock: true },

      { plasticTypeId: petg.id, colorId: black.id, inStock: true },
      { plasticTypeId: petg.id, colorId: white.id, inStock: false },
    ],
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
