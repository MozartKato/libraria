export const i18n = {
  defaultLocale: 'id',
  locales: ['id', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const defaultNS = 'common';

export function getOptions(lng = i18n.defaultLocale, ns = defaultNS) {
  return {
    supportedLngs: i18n.locales,
    fallbackLng: i18n.defaultLocale,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
} 