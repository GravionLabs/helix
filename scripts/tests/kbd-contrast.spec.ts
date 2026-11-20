import { describe, expect, it } from 'vitest';
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { resolveTokens } from '../tokens/resolve.mjs';

// hx-kbd: the text of a cap is at least 4.5:1 and its border at least 3:1 against the cap background, in the light
// and the dark theme, on the page and on the (dark) bubble of a tooltip.
const tokens = resolveTokens(helixTokens).json as Record<'light' | 'dark', Record<string, string>>;

function hex(scheme: 'light' | 'dark', name: string): string {
  let value = tokens[scheme][name] ?? tokens.light[name];
  for (let i = 0; i < 10 && value?.startsWith('var('); i++) {
    const next = value.slice(4, -1);
    value = tokens[scheme][next] ?? tokens.light[next];
  }
  if (!/^#[0-9a-f]{6}$/i.test(value ?? ''))
    throw new Error(`${name} does not resolve to a hex: ${value}`);
  return value;
}

function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(color.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each(['light', 'dark'] as const)('hx-kbd contrast, %s theme', (scheme) => {
  it.each(['kbd', 'kbd-tooltip'])('%s: text 4.5:1, border 3:1', (prefix) => {
    const bg = hex(scheme, `--h-${prefix}-background`);
    expect(contrast(hex(scheme, `--h-${prefix}-color`), bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hex(scheme, `--h-${prefix}-border-color`), bg)).toBeGreaterThanOrEqual(3);
  });

  it('the caps in a tooltip stand out from the bubble', () => {
    const bubble = hex(scheme, '--h-tooltip-background');
    expect(contrast(hex(scheme, '--h-kbd-tooltip-border-color'), bubble)).toBeGreaterThanOrEqual(3);
  });
});
