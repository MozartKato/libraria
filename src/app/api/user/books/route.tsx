import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const booklist = await prisma.book.findMany();
    return NextResponse.json(booklist);
}