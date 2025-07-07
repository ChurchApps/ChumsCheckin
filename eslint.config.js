const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.expo/**', 'android/**', 'ios/**'],
  },
  ...compat.extends('@react-native-community', 'eslint-config-expo'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'comma-dangle': 'off',
      'radix': 0,
      'eol-last': ['warn', 'always'],
      'quote-props': ['error', 'as-needed'],
      'quotes': [2, 'double', { avoidEscape: true }],
      'no-trailing-spaces': 'warn',
      'no-var': 'error',
      'operator-linebreak': ['warn', 'before'],
      'multiline-ternary': ['warn', 'always-multiline'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'arrow-body-style': ['warn', 'as-needed'],
      'react/jsx-tag-spacing': ['warn', { beforeSelfClosing: 'always', beforeClosing: 'never' }],
      'no-multiple-empty-lines': 'off',
      'no-useless-escape': 0,
      'jsx-quotes': ['warn', 'prefer-double'],
      '@typescript-eslint/no-unused-vars': 'off',
      'react-native/no-inline-styles': 0,
      'prettier/prettier': 'off',
    },
  },
];