import { NextRequest, NextResponse } from "next/server";
import { protect, getUserFromRequest } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function POST(req: NextRequest){
  const protectionError = protect(req,"admin");

  if (protectionError) return protectionError;

  const payload = getUserFromRequest(req);
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {title,author,year,code} = body;

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    year: z.number().int().min(1000, "Year must be a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
    code: z.string().min(1, "Code is required"),
  })

  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({
      error: "Validation failed",
      issues: validation.error.issues
    }, { status: 400 });
  }

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year,
        code,
      },
    });

    return NextResponse.json({
      message: "Book created successfully",
      data: newBook
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create book",
      details: error instanceof Error ? error.message : error
    }, { status: 500 });
  }
}