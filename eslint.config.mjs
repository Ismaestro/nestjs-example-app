import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintComments from 'eslint-plugin-eslint-comments';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginPromise from 'eslint-plugin-promise';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default tsEslint.config(
  {
    files: ['src/**/*.ts', 'prisma/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: false,
      },
    },
    extends: [
      eslint.configs.all,
      ...tsEslint.configs.all,
      eslintPluginUnicorn.configs['flat/all'],
      pluginPromise.configs['flat/recommended'],
    ],
    plugins: {
      typescriptEslint,
      'eslint-comments': eslintComments,
    },
    rules: {
      complexity: [
        'error',
        {
          max: 5,
        },
      ],
      'max-len': [
        'error',
        {
          code: 300,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 30,
        },
      ],
      'max-params': [
        'error',
        {
          max: 2,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      'promise/no-multiple-resolved': 'error',
      'promise/spec-only': 'error',
      'eslint-comments/no-use': [
        'error',
        { 'allow': ['eslint-disable-next-line', 'eslint-disable', 'eslint-enable'] },
      ],

      // Off
      'sort-keys': 'off',
      'no-underscore-dangle': 'off',
      'sort-imports': 'off',
      'new-cap': 'off',
      'strict': 'off',
      'one-var': 'off',
      'no-undefined': 'off',
      'no-inline-comments': 'off',
      'no-void': 'off',
      'func-style': 'off',
      'no-duplicate-imports': 'off',
      'no-implicit-coercion': 'off',
      'no-ternary': 'off',
      'no-implicit-globals': 'off',
      'no-warning-comments': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/require-await': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-global-this': 'off',
    },
  },
  eslintConfigPrettier,
);
