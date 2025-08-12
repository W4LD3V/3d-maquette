import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test1234', 10);

  await prisma.user.upsert({
    where: { email: 'test@maquette.dev' },
    update: { password: hashedPassword },
    create: { email: 'test@maquette.dev', password: hashedPassword },
  });

  const pla = await prisma.plasticType.upsert({
    where: { name: 'PLA' },
    update: {},
    create: { name: 'PLA' },
  });
  const petg = await prisma.plasticType.upsert({
    where: { name: 'PETG' },
    update: {},
    create: { name: 'PETG' },
  });

  const black = await prisma.color.upsert({
    where: { name: 'Black' },
    update: { hex: '#000000' },
    create: { name: 'Black', hex: '#000000' },
  });
  const white = await prisma.color.upsert({
    where: { name: 'White' },
    update: { hex: '#FFFFFF' },
    create: { name: 'White', hex: '#FFFFFF' },
  });

  
  await prisma.plasticColorAvailability.upsert({
    where: { plasticTypeId_colorId: { plasticTypeId: pla.id, colorId: black.id } },
    update: { inStock: true },
    create: { plasticTypeId: pla.id, colorId: black.id, inStock: true },
  });
  await prisma.plasticColorAvailability.upsert({
    where: { plasticTypeId_colorId: { plasticTypeId: pla.id, colorId: white.id } },
    update: { inStock: true },
    create: { plasticTypeId: pla.id, colorId: white.id, inStock: true },
  });
  await prisma.plasticColorAvailability.upsert({
    where: { plasticTypeId_colorId: { plasticTypeId: petg.id, colorId: black.id } },
    update: { inStock: true },
    create: { plasticTypeId: petg.id, colorId: black.id, inStock: true },
  });
  await prisma.plasticColorAvailability.upsert({
    where: { plasticTypeId_colorId: { plasticTypeId: petg.id, colorId: white.id } },
    update: { inStock: false },
    create: { plasticTypeId: petg.id, colorId: white.id, inStock: false },
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
