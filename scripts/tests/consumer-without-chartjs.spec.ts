import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build, type Plugin } from 'esbuild';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// chart.js is an optional peer of @gravionlabs/helix-ui (#924): an app that does not install it must still build.
// Needs the built package (`pnpm build:ui:ensure` or `ng build ui`); the CI build runs before the tests.
const ROOT = resolve(__dirname, '../..');
const DIST = resolve(ROOT, 'dist/ui');
const built = existsSync(resolve(DIST, 'package.json'));

/** Leaves every bare import except helix-ui and chart.js external, as an app's bundler would resolve those itself. */
const externalExceptUiAndChartJs: Plugin = {
  name: 'external-except-ui-and-chart-js',
  setup(b) {
    b.onResolve({ filter: /^[^./]/ }, (args) =>
      /^(@gravionlabs\/helix-ui|chart\.js)(\/|$)/.test(args.path)
        ? undefined
        : { path: args.path, external: true },
    );
  },
};

describe.skipIf(!built)('a consumer of @gravionlabs/helix-ui without chart.js', () => {
  let app: string;

  // An app outside the workspace with only helix-ui in its node_modules, so chart.js cannot be resolved.
  beforeAll(() => {
    app = mkdtempSync(join(tmpdir(), 'helix-ui-consumer-'));
    const pkg = join(app, 'node_modules/@gravionlabs/helix-ui');
    mkdirSync(pkg, { recursive: true });
    cpSync(DIST, pkg, { recursive: true });
  });

  afterAll(() => rmSync(app, { recursive: true, force: true }));

  const bundle = (source: string, nodePaths: string[] = []) => {
    const entry = join(app, `main-${Math.random().toString(36).slice(2)}.ts`);
    writeFileSync(entry, source);
    return build({
      entryPoints: [entry],
      absWorkingDir: app,
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      logLevel: 'silent',
      nodePaths,
      plugins: [externalExceptUiAndChartJs],
    });
  };

  it('finds no chart.js in the root entry of the package, only in the chart entry', () => {
    const fesm = (name: string) => readFileSync(resolve(DIST, 'fesm2022', name), 'utf8');
    expect(fesm('gravionlabs-helix-ui.mjs')).not.toContain('chart.js');
    expect(fesm('gravionlabs-helix-ui-chart.mjs')).toContain('import("chart.js/auto")');
  });

  it('exports the chart entry point from the package', () => {
    const pkg = JSON.parse(readFileSync(resolve(DIST, 'package.json'), 'utf8'));
    expect(pkg.exports['./chart']).toEqual({
      types: './types/gravionlabs-helix-ui-chart.d.ts',
      default: './fesm2022/gravionlabs-helix-ui-chart.mjs',
    });
    expect(pkg.peerDependenciesMeta['chart.js']).toEqual({ optional: true });
  });

  it('bundles the root entry', async () => {
    const result = await bundle("import * as ui from '@gravionlabs/helix-ui';\nconsole.log(ui);\n");
    expect(result.errors).toEqual([]);
    expect(result.outputFiles[0].text).not.toContain('chart.js');
  });

  it('fails to bundle the chart entry, which needs chart.js', async () => {
    await expect(
      bundle("import { HxChart } from '@gravionlabs/helix-ui/chart';\nconsole.log(HxChart);\n"),
    ).rejects.toThrow(/Could not resolve "chart\.js\/auto"/);
  });

  it('bundles the chart entry once chart.js is installed', async () => {
    const result = await bundle(
      "import { HxChart } from '@gravionlabs/helix-ui/chart';\nconsole.log(HxChart);\n",
      [resolve(ROOT, 'node_modules')],
    );
    expect(result.errors).toEqual([]);
  });
});
