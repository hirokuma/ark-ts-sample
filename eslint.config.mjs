// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // グローバルに無視するファイル/ディレクトリ
  {
    ignores: ['dist/', 'node_modules/'],
  },

  // ESLintの推奨設定
  eslint.configs.recommended,

  // TypeScript ESLintの型チェック付き推奨設定
  ...tseslint.configs.recommendedTypeChecked,

  // 型チェック付きルール用のパーサーオプション
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // eslint-plugin-importの設定
  {
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // Prettierとの競合ルールを無効化（必ず最後に配置）
  prettierConfig,
);