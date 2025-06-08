import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = cookies();
        
        // Hapus cookie token
        (await
            // Hapus cookie token
            cookieStore).delete('token');

        return NextResponse.json(
            { message: 'Logged out successfully' },
            { 
                status: 200,
                headers: {
                    'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
                }
            }
        );
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Failed to logout' },
            { status: 500 }
        );
    }
} 