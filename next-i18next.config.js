module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'fr', 'de', 'it', 'hi', 'zh', 'ja', 'ar'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  ns: ['common', 'analytics', 'leads', 'billing'],
  defaultNS: 'common',
};