import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
