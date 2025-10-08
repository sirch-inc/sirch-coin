import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';

const reactConfig = {
  version: '18.2',
  jsx: true
};

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  {
    // JS/JSX config
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'security': security
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020
      }
    },
    settings: {
      react: reactConfig
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      ...security.configs.recommended.rules,
      // Customize security rules for React apps
      'security/detect-object-injection': 'off', // Too many false positives in React
      'security/detect-non-literal-fs-filename': 'off', // Not relevant for frontend
      'security/detect-non-literal-require': 'off' // Not relevant for frontend
    }
  },
  {
    // TS/TSX config
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'security': security
    },
    settings: {
      react: reactConfig
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/prop-types': 'off',  // Disable prop-types for TypeScript files
      ...security.configs.recommended.rules,
      // Customize security rules for React/TypeScript
      'security/detect-object-injection': 'off', // Too many false positives in React
      'security/detect-non-literal-fs-filename': 'off', // Not relevant for frontend
      'security/detect-non-literal-require': 'off' // Not relevant for frontend
    }
  },
  {
    // .d.ts config
    files: ['**/*.d.ts'],
    extends: [
      ...tseslint.configs.recommended
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: null  // Disable project requirement for .d.ts files
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    }
  }
);