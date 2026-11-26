import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ESLint, type Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs module without types
import preset, { helixAllow } from '../../projects/lint/eslint.mjs';
// @ts-expect-error plain .mjs module without types
import { FILE_UPLOAD, HELIX_CONTROLS } from '../../projects/lint/rules/no-raw-control.mjs';

// #1213: the template part of the lint preset (ADR 0009), run through the ESLint Node API on fixtures.
const ROOT = resolve(__dirname, '../..');
const FIXTURES = 'scripts/tests/fixtures/lint-preset';
const RULE = 'helix/no-raw-control';

const linter = (...entries: Linter.Config[]) =>
  new ESLint({
    cwd: ROOT,
    overrideConfigFile: true,
    overrideConfig: [...(preset as Linter.Config[]), ...entries],
  });

async function lintFixture(file: string, ...entries: Linter.Config[]) {
  const [result] = await linter(...entries).lintFiles([`${FIXTURES}/${file}`]);
  return result.messages;
}

async function lintText(code: string) {
  const [result] = await linter().lintText(code, { filePath: join(ROOT, 'sample.html') });
  return result.messages.map((m) => m.message);
}

describe('helix/no-raw-control', () => {
  it.each([
    'button-pass.html',
    'input-pass.html',
    'textarea-pass.html',
    'select-pass.html',
    'progress-pass.html',
    'hidden-and-upload-pass.html',
  ])('passes %s', async (file) => {
    expect(await lintFixture(file)).toEqual([]);
  });

  it.each([
    ['button-fail.html', ['`hx-button`', '`hx-list-row`']],
    ['input-fail.html', ['`hx-input`', '`hx-checkbox`', '`hx-radio`', '`hx-switch`']],
    ['textarea-fail.html', ['`hx-input`']],
    ['select-fail.html', ['`<hx-select>`']],
    ['progress-fail.html', ['`<hx-progress-bar>`']],
    ['file-fail.html', ['`hx-input`']],
  ])('reports %s and names the Helix replacement', async (file, names) => {
    const messages = await lintFixture(file);
    expect(messages.map((m) => [m.ruleId, m.severity])).toEqual([[RULE, 2]]);
    for (const name of names) expect(messages[0].message).toContain(name);
  });

  it('accepts a bound directive attribute', async () => {
    expect(await lintText('<button [hx-button]="kind">Save</button>')).toEqual([]);
  });

  it('reports controls inside control flow and structural directives', async () => {
    expect(
      await lintText('@if (shown) {\n  <button>a</button>\n}\n<button *appShown>b</button>\n'),
    ).toHaveLength(2);
  });

  it('allows a file input anywhere below hx-file-upload, but no other input', async () => {
    expect(
      await lintText('<hx-file-upload><div><input type="file" /></div></hx-file-upload>'),
    ).toEqual([]);
    expect(await lintText('<hx-file-upload><input type="text" /></hx-file-upload>')).toHaveLength(
      1,
    );
  });
});

describe('helixAllow', () => {
  const reason = 'Native button until the screen moves to hx-button';

  it('exempts the files of the entry and no others', async () => {
    const entry = helixAllow({ files: [`${FIXTURES}/button-*`], rules: [RULE], reason });
    expect(await lintFixture('button-fail.html', entry)).toEqual([]);
    expect(await lintFixture('input-fail.html', entry)).toHaveLength(1);
  });

  it('takes a directory pattern', async () => {
    const entry = helixAllow({ files: [`${FIXTURES}/**`], rules: [RULE], reason });
    expect(await lintFixture('select-fail.html', entry)).toEqual([]);
  });

  it.each([undefined, '', '   '])('rejects an entry with the reason %j', (value) => {
    expect(() => helixAllow({ files: ['src/**'], rules: [RULE], reason: value })).toThrow(/reason/);
  });

  it.each(['files', 'rules'])('rejects an entry without %s', (key) => {
    const entry = { files: ['src/**'], rules: [RULE], reason };
    expect(() => helixAllow({ ...entry, [key]: [] })).toThrow(key);
    expect(() => helixAllow({ ...entry, [key]: undefined })).toThrow(key);
  });
});

describe('directive list', () => {
  const lib = join(ROOT, 'projects/ui/src/lib');
  const selectors = readdirSync(lib, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
    .flatMap((file) => [
      ...readFileSync(join(lib, file), 'utf8').matchAll(/\bselector:\s*'([^']+)'/g),
    ])
    .flatMap((match) => match[1].split(',').map((selector) => selector.trim()));

  const controls = Object.entries(
    HELIX_CONTROLS as Record<string, { directives?: string[]; component?: string }>,
  );

  it('covers the raw controls of ADR 0009', () => {
    expect(controls.map(([element]) => element).sort()).toEqual([
      'button',
      'input',
      'progress',
      'select',
      'textarea',
    ]);
  });

  it.each(
    controls.flatMap(([element, { directives = [] }]) =>
      directives.map((directive) => `${element}[${directive}]`),
    ),
  )('helix-ui declares the selector %s', (selector) => {
    expect(selectors).toContain(selector);
  });

  it.each([...controls.flatMap(([, { component }]) => component ?? []), FILE_UPLOAD as string])(
    'helix-ui declares the component %s',
    (component) => {
      expect(selectors).toContain(component);
    },
  );
});
