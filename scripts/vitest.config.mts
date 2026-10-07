import { defineConfig } from 'vitest/config';

// Tests of the workspace scripts (`scripts/*.mjs`) run in Node, outside the Angular projects.
export default defineConfig({
  test: { globals: true, environment: 'node', include: ['scripts/tests/**/*.spec.ts'] },
});
