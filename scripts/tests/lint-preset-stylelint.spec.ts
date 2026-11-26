import { resolve } from 'node:path';
import stylelint, { type Config } from 'stylelint';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs module without types
import preset, { helixAllow } from '../../projects/lint/stylelint.mjs';

// #1212: the Stylelint part of the lint preset (ADR 0009), run through the Stylelint Node API on fixtures.
const ROOT = resolve(__dirname, '../..');
const FIXTURES = 'scripts/tests/fixtures/lint-preset';
const config = preset as Config;

async function lint(options: stylelint.LinterOptions) {
  const { results } = await stylelint.lint({ cwd: ROOT, config, ...options });
  expect(results).toHaveLength(1);
  expect(results[0].invalidOptionWarnings).toEqual([]);
  return results[0].warnings.map((warning) => warning.rule);
}

// the fixtures are ignored by the repository's own config, not by the preset
const lintFixture = (file: string, overrides: Config['overrides'] = []) =>
  lint({ files: `${FIXTURES}/${file}`, config: { ...config, overrides } });

const lintFontSize = (value: string) => lint({ code: `a { font-size: ${value}; }` });

const FONT_SIZE = 'declaration-property-value-allowed-list';

describe('helix-lint Stylelint preset', () => {
  it('sets only its three rules, without extends or formatting rules', () => {
    expect(Object.keys(config)).toEqual(['rules']);
    expect(Object.keys(config.rules ?? {}).sort()).toEqual([
      'color-no-hex',
      FONT_SIZE,
      'function-disallowed-list',
    ]);
  });

  it.each([
    'hex-pass.css',
    'color-function-pass.css',
    'font-size-token-pass.css',
    'font-size-keyword-pass.css',
    'font-size-calc-pass.css',
    'font-size-clamp-pass.css',
  ])('passes %s', async (file) => {
    expect(await lintFixture(file)).toEqual([]);
  });

  it.each([
    ['hex-fail.css', 'color-no-hex'],
    ['rgb-fail.css', 'function-disallowed-list'],
    ['rgba-fail.css', 'function-disallowed-list'],
    ['hsl-fail.css', 'function-disallowed-list'],
    ['hsla-fail.css', 'function-disallowed-list'],
    ['font-size-px-fail.css', FONT_SIZE],
    ['font-size-rem-fail.css', FONT_SIZE],
    ['font-size-component-token-fail.css', FONT_SIZE],
    ['font-size-calc-rem-fail.css', FONT_SIZE],
  ])('reports %s', async (file, rule) => {
    expect(await lintFixture(file)).toEqual([rule]);
  });

  it.each([
    'initial',
    'unset',
    'revert',
    'smaller',
    'larger',
    'var( --h-font-size-3xl )',
    'calc((var(--h-font-size-md) + var(--h-font-size-xs)) / 2)',
    'clamp(\n    var(--h-font-size-sm),\n    var(--h-font-size-md),\n    var(--h-font-size-lg)\n  )',
  ])('allows the font size %j', async (value) => {
    expect(await lintFontSize(value)).toEqual([]);
  });

  it.each([
    '1em',
    '120%',
    'large',
    'var(--font-size)',
    'var(--h-font-size-sm, 14px)',
    'calc(2 * 7px)',
    'calc(1)',
    'calc(var(--h-font-size-md) + 1em)',
    'calc(var(--h-font-size-md) + 1vw)',
    'calc(var(--h-font-size-md) + var(--gap))',
    'clamp(var(--h-font-size-sm), 2vw, var(--h-font-size-lg))',
    'min(var(--h-font-size-sm), var(--h-font-size-lg))',
    'calc(var(--h-font-size-md)) 12px',
  ])('rejects the font size %j', async (value) => {
    expect(await lintFontSize(value)).toEqual([FONT_SIZE]);
  });
});

describe('helixAllow (Stylelint)', () => {
  const reason = 'Brand color of the legacy logo';
  const entry = { files: ['**/hex-*.css'], rules: ['color-no-hex'], reason };

  it('turns an entry into an overrides entry', () => {
    expect(helixAllow(entry)).toEqual({ files: entry.files, rules: { 'color-no-hex': null } });
  });

  it('turns off the named rules for the files and no others', async () => {
    const overrides = [helixAllow(entry)];
    expect(await lintFixture('hex-fail.css', overrides)).toEqual([]);
    expect(await lintFixture('rgb-fail.css', overrides)).toEqual(['function-disallowed-list']);
  });

  it('keeps the rules it does not name', async () => {
    const overrides = [helixAllow({ ...entry, files: ['**/rgb-fail.css'] })];
    expect(await lintFixture('rgb-fail.css', overrides)).toEqual(['function-disallowed-list']);
  });

  it.each([undefined, '', '   '])('rejects an entry with the reason %j', (value) => {
    expect(() => helixAllow({ ...entry, reason: value })).toThrow(/reason/);
  });

  it.each(['files', 'rules'])('rejects an entry without %s', (key) => {
    expect(() => helixAllow({ ...entry, [key]: [] })).toThrow(key);
    expect(() => helixAllow({ ...entry, [key]: undefined })).toThrow(key);
  });
});
