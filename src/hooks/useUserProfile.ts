import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './useLanguage';
import { userService } from '@/services/api';
import { UserProfile } from '@/types';
import { config } from '@/config';
import commonId from '@/locales/id/common.json';
import commonEn from '@/locales/en/common.json';

const translations = {
  id: commonId,
  en: commonEn,
};

export const useUserProfile = () => {
  const router = useRouter();
  const { currentLocale } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data) {
          throw new Error(translations[currentLocale].common.error);
        }

        setUser(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : translations[currentLocale].common.error;
        
        setError(errorMessage);
        
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          router.push(`${config.auth.redirectPath}?redirectTo=/${currentLocale}/pages/dashboard`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, currentLocale]);

  return { user, isLoading, error };
}; 