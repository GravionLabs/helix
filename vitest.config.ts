import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@helix-ui/shell': resolve(__dirname, 'projects/shell/src/public-api.ts'),
      '@helix-ui/zod': resolve(__dirname, 'projects/zod/src/public-api.ts'),
      '@helix-ui/ag-grid': resolve(__dirname, 'projects/ag-grid/src/public-api.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.spec.ts'],
  },
});
