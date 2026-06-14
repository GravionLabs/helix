import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@gravionlabs/helix': './projects/helix/src/public-api.ts',
    },
    include: ['**/*.spec.ts'],
  },
});
