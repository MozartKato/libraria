import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.errors.map((err) => err.message) },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/auth/register-user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}