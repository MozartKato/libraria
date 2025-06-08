'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { useLanguage } from '@/src/app/hooks/useLanguage';
import commonId from '@/src/app/locales/id/common.json';
import commonEn from '@/src/app/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

export default function Home() {
  const router = useRouter();
  const { currentLocale } = useLanguage();
  const t = translations[currentLocale].home;

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('token');
    
    if (token) {
      router.push(`/${currentLocale}/pages/dashboard`);
    }
  }, [router, currentLocale]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t.description}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t.features.search.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.features.search.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.features.borrow.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.features.borrow.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.features.manage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.features.manage.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/${currentLocale}/pages/auth/login`)}
          >
            {t.cta}
          </Button>
        </div>
      </main>
    </div>
  );
} 