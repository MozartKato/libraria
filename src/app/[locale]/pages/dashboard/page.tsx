"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { LanguageSwitcher } from '@/src/app/components/LanguageSwitcher';
import { useLanguage } from '@/src/app/hooks/useLanguage';
import commonId from '@/src/app/locales/id/common.json';
import commonEn from '@/src/app/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  quantity: number;
  available: number;
}

interface Borrow {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnedAt: string | null;
  fine: number;
  status: 'borrowed' | 'returned' | 'overdue';
  book?: {
    data?: {
      title: string;
    };
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  borrows: Borrow[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { currentLocale } = useLanguage();
  const t = translations[currentLocale].dashboard;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    if (!token) {
      router.push(`/${currentLocale}/pages/auth/login?redirectTo=/${currentLocale}/pages/dashboard`);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(translations[currentLocale].common.error);
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : translations[currentLocale].common.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, currentLocale]);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push(`/${currentLocale}/pages/auth/login`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{translations[currentLocale].common.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="primary"
            onClick={() => router.push(`/${currentLocale}/pages/auth/login`)}
            className="mt-4"
          >
            {translations[currentLocale].auth.login.title}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={`/${currentLocale}`} className="flex items-center text-blue-600 hover:text-blue-500">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="ml-2 text-2xl font-bold">Libraria</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                {translations[currentLocale].auth.logout}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* User Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t.userInfo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t.userInfo.name}</p>
                  <p className="mt-1 text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t.userInfo.email}</p>
                  <p className="mt-1 text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t.userInfo.role}</p>
                  <p className="mt-1 text-lg capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borrow History Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.borrowHistory.title}</CardTitle>
              <CardDescription>{t.borrowHistory.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {user.borrows.length === 0 ? (
                <p className="text-center text-gray-500">{t.borrowHistory.empty}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.book}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.borrowDate}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.dueDate}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.status}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.returnedAt}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t.borrowHistory.table.fine}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.borrows.map((borrow) => (
                        <tr key={borrow.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {borrow.book?.data?.title || t.borrowHistory.table.bookNotFound}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(borrow.borrowDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(borrow.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              borrow.status === 'returned' 
                                ? 'bg-green-100 text-green-800'
                                : borrow.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {t.borrowHistory.status[borrow.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {borrow.returnedAt ? new Date(borrow.returnedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {borrow.fine > 0 ? `Rp ${borrow.fine.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
