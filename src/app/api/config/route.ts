import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    });
} 