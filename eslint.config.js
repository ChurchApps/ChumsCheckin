const eslint = require('@eslint/js');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  eslint.configs.recommended,
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
      '@typescript-eslint': typescriptPlugin,
      'react-hooks': reactHooksPlugin,
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
      'no-multiple-empty-lines': 'off',
      'no-useless-escape': 0,
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles this
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];