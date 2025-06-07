import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getData(token: string) {
    try {
        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${BASE_URL}/api/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const data = await getData(token);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {data ? (
                <div className="grid gap-4">
                    {/* Replace this with your actual data display logic */}
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            ) : (
                <div className="text-red-500">Failed to load data</div>
            )}
        </div>
    );
}