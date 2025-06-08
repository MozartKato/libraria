'use client';

import Link from 'next/link';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card variant="elevated" className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-gray-900">Halaman Tidak Ditemukan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Maaf, halaman yang Anda cari tidak dapat ditemukan.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              variant="primary"
              asChild
            >
              <Link href="/">
                Kembali ke Beranda
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Kembali
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 