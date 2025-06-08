'use client';

import { useEffect } from 'react';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card variant="elevated" className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.
            </p>
            {error.message && (
              <p className="text-sm text-gray-500 mb-4">
                {error.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              variant="primary"
              onClick={() => reset()}
            >
              Coba Lagi
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Kembali ke Beranda
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 