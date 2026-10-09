import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildSystem, coverOf, markOf } from '../design-system/build.mjs';

const ROOT = resolve(__dirname, '../..');
// needs the exported tokens (`pnpm tokens:export`), nothing else
const built = existsSync(resolve(ROOT, 'dist/tokens/helix.json'));

describe('coverOf', () => {
  const cover = coverOf();

  it('is a preview: marker on line 1, one svg, bound to tokens, no motion or script', () => {
    expect(cover.split('\n')[0]).toBe('<!-- @dsCard height=320 -->');
    expect(cover.match(/<svg\b/g)).toHaveLength(1);
    expect(cover).toMatch(/var\(--primary\)/);
    expect(cover).not.toMatch(
      /<script|@keyframes|animation|gradient|filter|@media|@container|\bvw\b|cqw/,
    );
    expect(cover).not.toMatch(/#[0-9a-f]{3,6}\b/i); // every colour is a token
  });

  it('keeps the name zone clear: nothing but text left of x = 480', () => {
    for (const [, x] of cover.matchAll(/<(?:rect|circle)[^>]*\b(?:x|cx)="(\d+(?:\.\d+)?)"/g))
      expect(Number(x)).toBeGreaterThanOrEqual(480);
  });

  it('writes the derivation as a comment', () => {
    expect(cover).toMatch(/<!-- blocks:[\s\S]*arrangement:[\s\S]*pattern:[\s\S]*steps and radii:/);
  });
});

describe('markOf', () => {
  it('is a single-ink svg in the given colour', () => {
    const svg = markOf('#555dad');
    expect(svg).toContain('stroke="#555dad"');
    expect(svg).not.toMatch(/currentColor|<style|<script/);
  });
});

describe.skipIf(!built)('buildSystem (built library)', () => {
  it('writes the files the type needs, within its caps, and the same bytes twice', async () => {
    const a = await buildSystem();
    const b = await buildSystem();
    expect(Object.keys(a)).toEqual(Object.keys(b));
    for (const key of Object.keys(a))
      expect(Buffer.from(a[key]).equals(Buffer.from(b[key]))).toBe(true);

    for (const required of [
      'README.md',
      'tokens.json',
      'components/bundle.css',
      'components/Cover/preview.html',
      'fonts/inter-latin-wght-normal.woff2',
      'assets/Logos/helix-mark-light.svg',
    ]) {
      expect(a).toHaveProperty([required]);
    }
    expect(
      Object.keys(a).some(
        (k) => k.startsWith('components/Cover/') && k !== 'components/Cover/preview.html',
      ),
    ).toBe(false); // a bare folder is the cover
    expect(Object.keys(a).length).toBeLessThan(1000);
    for (const [key, data] of Object.entries(a)) {
      expect(key).not.toMatch(/(^|\/)\.|\.\.|\\/);
      expect(data.length).toBeLessThan(15 * 1024 * 1024);
    }
    expect(a['README.md'].length).toBeLessThan(200 * 1024);
    expect(a['tokens.json'].length).toBeLessThan(512 * 1024);
  });

  it('points tokens.json at the fonts it ships', async () => {
    const files = await buildSystem();
    const tokens = JSON.parse(files['tokens.json'] as string);
    for (const font of tokens.type.fonts) expect(files).toHaveProperty([font.file]);
  });
});
