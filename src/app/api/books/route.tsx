import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function GET() {
    const books = await prisma.book.findMany();
    return NextResponse.json({
        message: "success",
        data: books
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const schema = z.object({
            title: z.string().min(1, "Title is required"),
            author: z.string().min(1, "Author is required"),
            published: z.number().int().gte(1000).lte(new Date().getFullYear(), "Published year must be a valid year"),
            isbn: z.string().min(1, "ISBN is required")
        });

        const result = schema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: result.error.errors },
                { status: 400 }
            );
        }

        const { title, author, published, isbn } = result.data;

        const book = await prisma.book.create({
            data: {
                title,
                author,
                published,
                isbn
            }
        });

        return NextResponse.json({
            message: "success",
            data: book
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: (error as Error).message },
            { status: 500 }
        );
    }
}