const LanguageDetector = require('i18next-browser-languagedetector/dist/cjs/i18nextBrowserLanguageDetector')
const path = require('path')

module.exports = {
  i18n: {
    localeDetection: false,
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
    serializeConfig: false,
    use: [LanguageDetector],
    detection: ['localStorage', 'navigator'],
    localePath: path.resolve('./public/locales'),
  },
}
