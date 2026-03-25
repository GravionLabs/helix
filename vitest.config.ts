import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@gravion/sakai-ui': './projects/sakai-ui/src/public-api.ts',
    },
    include: ['**/*.spec.ts'],
  },
});
