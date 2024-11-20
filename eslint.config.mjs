/** @type {import('eslint').Linter.Config} */
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  plugins: [ '@typescript-eslint', 'import', 'prettier' ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'max-len': [ 'error', { code: 80, tabWidth: 2, ignoreComments: true } ],
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        groups: [ [ 'builtin', 'external', 'internal' ] ],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: [ '*.ts', '*.tsx' ], // Обработка TypeScript файлов
      parser: '@typescript-eslint/parser',
      rules: {
        // Добавляйте специфические правила для TS, если нужно
      },
    },
  ],
};
