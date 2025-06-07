import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, protect } from "@/libs/auth";
import { prisma } from "@/libs/prisma";

export async function GET(request: NextRequest) {
    try {
        // cek dan protect route
        const protectionError = protect(request);
        if (protectionError) return protectionError;

        const payload = getUserFromRequest(request);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(payload.userId) },
            include: { borrowedBooks: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // exclude password
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;


        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
