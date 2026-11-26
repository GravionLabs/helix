import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// #1116: oxlint runs the Angular class rules through an alpha JS plugin (and helix's own plugin), the type-aware rules
// through oxlint-tsgolint, and ESLint the template rules. scripts/lint/probe/ holds deliberate violations (left out of
// `pnpm lint`); this spec lints it and expects every rule, so a tool update or a config change that silently drops a
// rule fails here instead of linting nothing.
const ROOT = resolve(__dirname, '../..');
const PROBE = 'scripts/lint/probe';

interface OxlintReport {
  diagnostics: { code: string; filename: string }[];
}

describe('lint probe', () => {
  it('oxlint reports the Angular class rules, the helix rules, the inline template and a floating promise', () => {
    const result = spawnSync(join(ROOT, 'node_modules/.bin/oxlint'), ['-f', 'json', PROBE], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    // oxlint exits 1 when it reports errors; the report is on stdout either way
    const { diagnostics } = JSON.parse(result.stdout) as OxlintReport;
    const codes = diagnostics.map((d) => `${d.filename.replace(`${PROBE}/`, '')} ${d.code}`);
    expect(codes.sort()).toEqual([
      'inline-template.ts @angular-eslint(component-max-inline-declarations)',
      'probe.ts @angular-eslint(component-selector)',
      'probe.ts @angular-eslint(no-empty-lifecycle-method)',
      'probe.ts @angular-eslint(no-output-native)',
      'probe.ts @angular-eslint(no-output-on-prefix)',
      'probe.ts @angular-eslint(prefer-inject)',
      'probe.ts @angular-eslint(prefer-on-push-component-change-detection)',
      'probe.ts @angular-eslint(prefer-standalone)',
      'probe.ts helix(no-decorator-api)',
      'probe.ts helix(no-decorator-api)',
      'probe.ts helix(no-decorator-api)',
      'probe.ts typescript(no-floating-promises)',
    ]);
  });

  it('ESLint reports the template rules', async () => {
    const eslint = new ESLint({ cwd: ROOT, ignore: false });
    const [result] = await eslint.lintFiles([`${PROBE}/probe.html`]);
    expect(result.messages.map((m) => m.ruleId ?? '').sort()).toEqual([
      '@angular-eslint/template/alt-text',
      '@angular-eslint/template/banana-in-box',
      '@angular-eslint/template/click-events-have-key-events',
      '@angular-eslint/template/interactive-supports-focus',
      '@angular-eslint/template/prefer-control-flow',
      'helix/no-raw-control',
      'helix/no-raw-control',
    ]);
    // probe.html has a raw <input> too, so the raw <button> of the probe is asserted by its message
    expect(result.messages.map((m) => m.message)).toContainEqual(
      expect.stringContaining('Raw `<button>`'),
    );
  });
});
