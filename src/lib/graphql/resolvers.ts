import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { GraphQLContext } from './context';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const prisma = new PrismaClient();

function getUserIdFromHeader(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.userId as string;
  } catch {
    return null;
  }
}

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

    getColorsForPlastic: async (_: unknown, args: { plasticTypeId: string }) => {
      return prisma.plasticColorAvailability.findMany({
        where: {
          plasticTypeId: args.plasticTypeId,
        },
        include: {
          color: true,
        },
      });
    },

    getPrintRequests: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const userId = getUserIdFromHeader(context.req);
      if (!userId) throw new Error('Unauthorized');

      const requests = await prisma.printRequest.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        include: {
          plasticType: true,
          color: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }));
    },
  },

  Mutation: {
    submitPrintRequest: async (
      _: unknown,
      args: { fileUrl: string; plasticTypeId: string; colorId: string },
      context: GraphQLContext
    ) => {
      const userId = getUserIdFromHeader(context.req);
      if (!userId) throw new Error('Unauthorized');

      return prisma.printRequest.create({
        data: {
          fileUrl: args.fileUrl,
          plasticTypeId: args.plasticTypeId,
          colorId: args.colorId,
          userId,
        },
        include: {
          plasticType: true,
          color: true,
        },
      });
    },

    deletePrintRequest: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      const userId = getUserIdFromHeader(context.req);
      if (!userId) throw new Error('Unauthorized');

      const request = await prisma.printRequest.findUnique({
        where: { id: args.id },
      });

      if (!request || request.userId !== userId) {
        throw new Error('Not found or unauthorized');
      }

      await prisma.printRequest.update({
        where: { id: args.id },
        data: { isDeleted: true },
      });

      return true;
    },
  },
};
