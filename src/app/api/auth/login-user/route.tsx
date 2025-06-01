import { signToken } from "@/libs/jwt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
    
        const schema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        });
    
        // Validate the request body against the schema
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
        return NextResponse.json(
            { errors: parsed.error.errors.map((err) => err.message) },
            { status: 400 }
        );
        }
    
        const { email, password } = parsed.data;
    
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
        }
    
        // Verify the password
        // Note: bcrypt.compare returns a promise, so we need to await it
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        );
        }
    
        // Generate a JWT token
        const token = signToken({ userId: user.id });
    
        return NextResponse.json(
        {
            status: "success",
            message: "User logged in successfully",
            token,
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            },
        },
        { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/auth/login-user:", error);
        return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
        );
    }
}