import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import React from 'react';
import LogoutButton from './LogoutButton';

async function getData(token: string) {
    try {
        // Gunakan environment variable untuk BASE_URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/user/profile`, {
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
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/user/books?id=${id}`, {
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
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
                        <div className="text-red-600 bg-red-50 p-4 rounded-lg">Failed to load data</div>
                    </div>
                </div>
            </div>
        );
    }

    let borrowedBooksWithDetail: any[] = [];
    if (data.borrowedBooks && data.borrowedBooks.length > 0) {
        borrowedBooksWithDetail = await Promise.all(
            data.borrowedBooks.map(async (borrow: any) => {
                const detail = await getBookDetail(token!, borrow.bookId.toString());
                return {
                    ...borrow,
                    book: detail,
                };
            })
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="mt-2 text-gray-600">Selamat datang di dashboard perpustakaan</p>
                    </div>
                    <LogoutButton />
                </div>
                
                {/* Informasi User */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informasi Pengguna
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Nama</div>
                            <div className="font-medium text-gray-900">{data.name}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Email</div>
                            <div className="font-medium text-gray-900">{data.email}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Role</div>
                            <div className="font-medium text-gray-900 capitalize">{data.role}</div>
                        </div>
                    </div>
                </div>

                {/* Daftar Buku yang Dipinjam */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Riwayat Peminjaman
                    </h2>
                    {borrowedBooksWithDetail.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pinjaman</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Buku</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batas Kembali</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kembali</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denda</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {borrowedBooksWithDetail.map((borrow: any) => (
                                        <tr key={borrow.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{borrow.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{borrow.book?.title || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(borrow.borrowedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(borrow.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    borrow.status === 'returned' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : borrow.status === 'overdue' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {borrow.status === 'returned' ? 'Dikembalikan' :
                                                     borrow.status === 'overdue' ? 'Terlambat' :
                                                     'Dipinjam'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {borrow.returnedAt ? new Date(borrow.returnedAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {borrow.fine > 0 ? (
                                                    <span className="text-red-600 font-medium">
                                                        Rp {borrow.fine.toLocaleString()}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada riwayat peminjaman</h3>
                            <p className="mt-1 text-sm text-gray-500">Mulai pinjam buku untuk melihat riwayat peminjaman Anda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
