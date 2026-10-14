import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { type BuildFailure, build, type Plugin } from 'esbuild';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// chart.js is an optional peer of @gravionlabs/helix-ui (#924): an app that does not install it must still build.
// Needs the built package with its chart entry (`pnpm build:ui:ensure` or `ng build ui`); the CI build runs before
// the tests, so a missing build fails there and is only skipped, with a warning, on a developer machine.
const ROOT = resolve(__dirname, '../..');
const DIST = resolve(ROOT, 'dist/ui');
const built = existsSync(resolve(DIST, 'package.json')) && existsSync(resolve(DIST, 'chart'));
if (!built) {
  const message =
    'dist/ui is missing or stale (no dist/ui/chart): run `ng build ui` before the consumer-without-chartjs tests';
  if (process.env.CI) throw new Error(message);
  process.stderr.write(`Skipped: ${message}\n`);
}

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
  const nodePath = process.env.NODE_PATH;

  // An app outside the workspace with only helix-ui in its node_modules, so chart.js cannot be resolved.
  beforeAll(() => {
    delete process.env.NODE_PATH;
    app = mkdtempSync(join(tmpdir(), 'helix-ui-consumer-'));
    const pkg = join(app, 'node_modules/@gravionlabs/helix-ui');
    mkdirSync(pkg, { recursive: true });
    cpSync(DIST, pkg, { recursive: true });
  });

  afterAll(() => {
    rmSync(app, { recursive: true, force: true });
    if (nodePath !== undefined) process.env.NODE_PATH = nodePath;
  });

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

  const chartEntry =
    "import { HxChart } from '@gravionlabs/helix-ui/chart';\nconsole.log(HxChart);\n";

  it('bundles the root entry, without chart.js', async () => {
    const result = await bundle(
      "import { HxButton } from '@gravionlabs/helix-ui';\nconsole.log(HxButton);\n",
    );
    expect(result.errors).toEqual([]);
    const out = result.outputFiles[0].text;
    expect(out).toContain('HxButton');
    expect(out).not.toContain('chart.js');
  });

  it('fails to bundle the chart entry while chart.js is missing', async () => {
    const failure = (await bundle(chartEntry).catch((e: BuildFailure) => e)) as BuildFailure;
    expect(failure.errors).toHaveLength(1);
    expect(failure.errors[0].text).toContain('chart.js/auto');
  });

  it('bundles the chart and chart.js once chart.js is installed', async () => {
    const result = await bundle(chartEntry, [resolve(ROOT, 'node_modules')]);
    expect(result.errors).toEqual([]);
    const out = result.outputFiles[0].text;
    expect(out).toContain('HxChart');
    expect(out).toContain('registerables'); // the chart.js export that chart.js/auto registers
  });
});
