import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue,ts}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-prop-types': 'off',
      semi: [2, 'always'],
      'vue/valid-v-slot': ['error', {
        allowModifiers: true,
      }],
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  }
];
