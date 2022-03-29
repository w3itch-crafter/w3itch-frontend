module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  ignorePatterns: ['.*.js', '*.config.js', 'public'],
}
