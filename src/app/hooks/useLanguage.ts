import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { i18n, Locale } from '../config/i18n';

export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>(i18n.defaultLocale);

  useEffect(() => {
    // Get locale from pathname
    const locale = pathname.split('/')[1] as Locale;
    if (i18n.locales.includes(locale)) {
      setCurrentLocale(locale);
      localStorage.setItem('preferredLocale', locale);
    }
  }, [pathname]);

  const changeLanguage = (newLocale: Locale) => {
    if (!i18n.locales.includes(newLocale)) return;

    // Update pathname with new locale
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(newPathname);
    
    // Save preference
    localStorage.setItem('preferredLocale', newLocale);
    setCurrentLocale(newLocale);
  };

  return {
    currentLocale,
    changeLanguage,
    availableLocales: i18n.locales,
  };
} 