const { ESLint } = require('eslint');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript'
  ],
  rules: {
    // Customize rules as needed
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/'
  ]
};