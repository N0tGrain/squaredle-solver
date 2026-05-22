import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import tsparser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import vue from "@vitejs/plugin-vue";

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-console': 'off',
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
    ]
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
])
