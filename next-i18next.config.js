// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'], // ✅ Hebrew added
    localeDetection: false, // Disable auto-detection
  },
  fallbackLng: {
    'he': ['he', 'en'],
    'default': ['en']
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  }
};
