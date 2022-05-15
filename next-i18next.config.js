const LanguageDetector = require('i18next-browser-languagedetector/dist/cjs/i18nextBrowserLanguageDetector');

module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
    serializeConfig: false,
    use: [LanguageDetector],
    detection: ['localStorage', 'navigator']
  },
};
