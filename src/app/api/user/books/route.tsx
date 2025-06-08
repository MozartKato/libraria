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

  // Ambil ID dari URL parameter
  const id = req.nextUrl.searchParams.get('id');
  
  if (!id) {
    // Jika tidak ada ID, kembalikan semua buku
    const books = await prisma.book.findMany();
    return NextResponse.json({
      message: "success",
      data: books
    });
  }

  // Jika ada ID, cari buku spesifik
  const book = await prisma.book.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json({
    message: "success",
    data: book
  });
}