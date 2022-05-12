// i18next-parser.config.js

module.exports = {
  defaultNamespace: 'common',
  keySeparator: false,
  locales: ['en', 'zh'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  input: 'pages/**/*.{ts,tsx}',
  useKeysAsDefaultValue: true,
}
