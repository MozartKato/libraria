'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In client components, we need to use document.cookie instead of next/headers
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    
    if (token) {
      router.push('/pages/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Selamat Datang di Libraria
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistem manajemen perpustakaan modern untuk mengelola koleksi buku dan peminjaman dengan mudah dan efisien.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <CardTitle>Katalog Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Akses ribuan buku dalam format digital dengan mudah dan cepat.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <CardTitle>Peminjaman Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pinjam dan kembalikan buku secara online dengan sistem yang terintegrasi.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <CardTitle>Keamanan Terjamin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sistem keamanan modern untuk melindungi data dan privasi pengguna.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/pages/auth/login')}
          >
            Mulai Sekarang
          </Button>
        </div>
      </main>
    </div>
  );
}
