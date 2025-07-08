import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

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
      args: { fileUrl: string; plasticTypeId: string; colorId: string },
      context: { req: Request }
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
  },
};
