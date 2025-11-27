// @ts-check
import js from '@eslint/js';

const baseGlobals = js.configs.recommended.languageOptions?.globals ?? {};

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: 'module',
      globals: {
        ...baseGlobals,
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        $: 'readonly',
        jQuery: 'readonly'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      'prefer-const': 'warn',
      'no-console': 'off'
    }
  }
];
