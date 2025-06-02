import { NextRequest, NextResponse } from 'next/server';
import { protect, getUserFromRequest } from '@/libs/auth';
import { prisma } from '@/libs/prisma';

export async function GET(req: NextRequest) {
  const protectionError = protect(req);
  if (protectionError) return protectionError;

  const payload = getUserFromRequest(req);
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const books = await prisma.book.findMany();

  return NextResponse.json({
    message: "success",
    data: books
  })
}