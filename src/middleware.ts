import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/libs/jwt";
import { protectedApiRoutes, adminApiRoutes } from "@/src/app/config/config";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect API routes
    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
        // Ambil token dari cookies atau header Authorization
        let token = request.cookies.get("token")?.value;
        if (!token) {
            const authHeader = request.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const payload = await verifyToken(token);

            // Admin-only route protection using adminApiRoutes
            if (adminApiRoutes.some(route => pathname.startsWith(route))) {
                if (payload.role !== "admin") {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
            }

            return NextResponse.next();
        } catch (error) {
            return NextResponse.json(
                error instanceof Error ? { error: error.message } : { error: "Invalid or expired token" },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}