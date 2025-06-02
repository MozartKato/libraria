import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";


export function getUserFromRequest(req: NextRequest): null | (JwtPayload & { userId: string; role: string }) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) return null;

  const payload = verifyToken(token);

  if (!payload || typeof payload === "string") return null;

  return payload as JwtPayload & { userId: string; role: string };
}

export function protect(req: NextRequest, requiredRole?: 'admin' | 'user') {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (requiredRole && user.role !== requiredRole) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return null; // valid
}