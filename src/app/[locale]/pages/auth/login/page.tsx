"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/app/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/app/components/ui/Card';
import { LanguageSwitcher } from '@/src/app/components/LanguageSwitcher';
import { useLanguage } from '@/src/app/hooks/useLanguage';
import commonId from '@/src/app/locales/id/common.json';
import commonEn from '@/src/app/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentLocale } = useLanguage();
    const t = translations[currentLocale].auth.login;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/api/config');
                const data = await response.json();
                setBaseUrl(data.baseUrl);
            } catch (error) {
                console.error('Error fetching config:', error);
                setBaseUrl('http://localhost:3000');
            }
        };
        fetchConfig();
    }, []);

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
        if (!baseUrl) return;
        
        setIsLoading(true);
        setError('');

        try {
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
                throw new Error(data.error || data.message || translations[currentLocale].common.error);
            }

            if (!data.token) {
                throw new Error('Token tidak diterima dari server');
            }

            setCookie('token', data.token, 7);
            router.push(`/${currentLocale}/pages/dashboard`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : translations[currentLocale].common.error);
            setCookie('token', '', -1);
        } finally {
            setIsLoading(false);
        }
    };

    if (!baseUrl) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{translations[currentLocale].common.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card variant="elevated" className="w-full max-w-md">
                <div className="absolute top-4 right-4">
                    <LanguageSwitcher />
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{t.title}</CardTitle>
                    <CardDescription className="text-center">
                        {searchParams.get('registered') ? (
                            <span className="text-green-600">
                                {translations[currentLocale].auth.register.success}
                            </span>
                        ) : (
                            t.description
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
                                {t.email}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                                placeholder={t.emailPlaceholder}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.password}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                                placeholder={t.passwordPlaceholder}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {t.submit}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                        {t.noAccount}{' '}
                        <Link href={`/${currentLocale}/pages/auth/register`} className="text-blue-600 hover:underline">
                            {t.register}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}