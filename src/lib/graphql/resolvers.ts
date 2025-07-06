import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    getPlasticTypes: async () => {
        const types = await prisma.plasticType.findMany({
          include: {
            availableColors: {
              include: {
                color: true,
              },
            },
          },
        });
      
        return types.map((t) => ({
          ...t,
          colors: t.availableColors,
        }));
      },

    getColorsForPlastic: async (_: any, args: { plasticTypeId: string }) => {
      return prisma.plasticColorAvailability.findMany({
        where: {
          plasticTypeId: args.plasticTypeId,
        },
        include: {
          color: true,
        },
      });
    },
    getPrintRequests: async () => {
      return prisma.printRequest.findMany({
        include: {
          plasticType: true,
          color: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
  Mutation: {
    submitPrintRequest: async (
      _: any,
      args: { fileUrl: string; plasticTypeId: string; colorId: string }
    ) => {
      const user = await prisma.user.findFirst({
        where: { email: 'test@maquette.dev' },
      });
  
      if (!user) throw new Error('Seed user not found');
  
      return prisma.printRequest.create({
        data: {
          fileUrl: args.fileUrl,
          plasticTypeId: args.plasticTypeId,
          colorId: args.colorId,
          userId: user.id,
        },
        include: {
          plasticType: true,
          color: true,
        },
      });
    },
  },  
};
