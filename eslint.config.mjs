import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import eslintPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: pluginReact,
      prettier: eslintPrettier,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
      'prettier', // Intégration complète de Prettier
    ],
    rules: {
      'prettier/prettier': 'error', // Intégration des règles de Prettier comme erreurs
      'react/react-in-jsx-scope': 'off', // Désactiver pour les nouvelles versions de React
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
