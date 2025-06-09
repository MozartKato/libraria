"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { LanguageSwitcher } from '@/src/app/components/LanguageSwitcher';
import { useLanguage } from '@/src/app/hooks/useLanguage';
import { useUserProfile } from '@/src/app/hooks/useUserProfile';
import { BorrowHistoryTable } from '@/src/app/components/features/BorrowHistoryTable';
import { config } from '@/src/app/config';
import commonId from '@/src/app/locales/id/common.json';
import commonEn from '@/src/app/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentLocale } = useLanguage();
  const { user, isLoading, error } = useUserProfile();
  const t = translations[currentLocale].dashboard;

  const handleLogout = () => {
    document.cookie = `${config.auth.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
              <BorrowHistoryTable borrows={user.borrowedBooks} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
