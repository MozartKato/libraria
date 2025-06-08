import { useLanguage } from '../hooks/useLanguage';

export function LanguageSwitcher() {
  const { currentLocale, changeLanguage, availableLocales } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {availableLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => changeLanguage(locale)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${
              currentLocale === locale
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
} 