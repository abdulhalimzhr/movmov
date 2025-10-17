import { defineVitestConfig } from '@nuxt/test-utils/config';
import { resolve } from 'path';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/tests/e2e/**'
    ],
    include: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
    watch: false
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.')
    }
  }
});
