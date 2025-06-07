import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

// create a new borrow record
export async function POST(request: NextRequest) {
    const body = await request.json();
    const borrowSchema = z.object({
        userId: z.number().int().min(1, "User ID must be a positive integer"),
        bookId: z.number().int().min(1, "Book ID must be a positive integer"),
        dueDate: z.date().optional(), // optional, will default to 7 days from now
    });

    const validation = borrowSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({
            error: "Validation failed",
            issues: validation.error.issues
        }, { status: 400 });
    }

    const { userId, bookId } = validation.data;

    try {
        const now = new Date();
        const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // default due date: 7 days from now

        const newBorrow = await prisma.borrow.create({
            data: {
                userId,
                bookId,
                dueDate: due,
            },
        });

        return NextResponse.json({
            message: "Book borrowed successfully",
            data: newBorrow
        }, { status: 201 });

    } catch (error) {
        console.error("Error borrowing book:", error);
        return NextResponse.json({ error: "Failed to borrow book" }, { status: 500 });
    }
}