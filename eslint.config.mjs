import config from "eslint-config-standard";

/** @type {import('eslint').Linter.Config} */
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Используем стандарт ES2020
    sourceType: 'module', // Разрешаем использование модулей ECMAScript
  },
  env: {
    node: true, // Подключаем окружение Node.js
    es6: true,
  },
  plugins: [ '@typescript-eslint', 'import', 'prettier' ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Правила для TypeScript
    'plugin:prettier/recommended', // Интеграция с Prettier
  ],
  rules: {
    'prettier/prettier': 'error', // Сообщать об ошибках форматирования от Prettier
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
    'no-console': 'warn', // Легкие предупреждения для console.log
    'no-var': 'error', // Не допускаем использование var
    'prefer-const': 'error', // Предпочтение const
  },
};