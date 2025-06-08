"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/app/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;secure;samesite=strict`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login gagal');
            }

            if (!data.token) {
                throw new Error('Token tidak diterima dari server');
            }

            // Simpan token dengan pengaturan yang lebih aman
            setCookie('token', data.token, 7); // Token berlaku 7 hari

            // Verifikasi token dengan mencoba mengakses endpoint yang membutuhkan autentikasi
            const verifyResponse = await fetch(`${baseUrl}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!verifyResponse.ok) {
                throw new Error('Verifikasi token gagal');
            }

            // Redirect ke dashboard
            router.push('/pages/dashboard');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login');
            // Hapus cookie jika login gagal
            setCookie('token', '', -1);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card variant="elevated" className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Masuk ke Akun Anda</CardTitle>
                    <CardDescription className="text-center">
                        {searchParams.get('registered') ? (
                            <span className="text-green-600">
                                Registrasi berhasil! Silakan masuk dengan akun Anda.
                            </span>
                        ) : (
                            'Masuk untuk mengakses semua fitur Libraria'
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Masuk
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                        Belum punya akun?{' '}
                        <Link href="/pages/auth/register" className="text-blue-600 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}