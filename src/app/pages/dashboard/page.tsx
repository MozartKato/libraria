import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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

async function getBookDetail(token: string, id: string) {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${BASE_URL}/api/user/books?id=${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/pages/auth/login');
    }

    const data = await getData(token!);

    if (!data) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="text-red-500">Failed to load data</div>
            </div>
        );
    }

    // Ambil detail buku untuk setiap borrowedBook
    let borrowedBooksWithDetail: any[] = [];
    if (data.borrowedBook && data.borrowedBook.length > 0) {
        borrowedBooksWithDetail = await Promise.all(
            data.borrowedBook.map(async (book: any) => {
                const detail = await getBookDetail(token!, book.id);
                return {
                    ...book,
                    ...detail, // menggabungkan detail buku ke object book
                };
            })
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="mb-6">
                <span className="font-semibold">Nama:</span> {data.name}
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Buku yang Dipinjam</h2>
                {borrowedBooksWithDetail.length > 0 ? (
                    <ul className="space-y-2">
                        {borrowedBooksWithDetail.map((book: any) => (
                            <li key={book.id} className="border p-3 rounded shadow">
                                <div className="font-medium">{book.title || '-'}</div>
                                <div className="text-sm text-gray-600">Penulis: {book.author || '-'}</div>
                                <div className="text-xs text-gray-400">Tanggal Pinjam: {book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : '-'}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500">Belum ada buku yang dipinjam.</div>
                )}
            </div>
        </div>
    );
}
