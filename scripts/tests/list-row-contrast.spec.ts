import { describe, expect, it } from 'vitest';
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { resolveTokens } from '../tokens/resolve.mjs';

// hx-list rows: text and muted meta text are at least 4.5:1 on every surface a list stands on, and the text of a
// hovered, current and selected row on the background of that state, in the light and the dark theme.
const tokens = resolveTokens(helixTokens).json as Record<'light' | 'dark', Record<string, string>>;

type Scheme = 'light' | 'dark';
type Color = [number, number, number, number];

/** A token as RGBA: follows `var()` chains; knows hex, `rgba()` and `color-mix(in srgb, x, transparent n%)`. */
function color(scheme: Scheme, value: string): Color {
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) return color(scheme, tokens[scheme][ref[1]] ?? tokens.light[ref[1]]);
  const mix = /^color-mix\(in srgb, (var\(--[\w-]+\)), transparent (\d+)%\)$/.exec(value);
  if (mix) {
    const [r, g, b] = color(scheme, mix[1]);
    return [r, g, b, 1 - Number(mix[2]) / 100];
  }
  const rgba = /^rgba\((\d+),(\d+),(\d+),(\.?\d*\.?\d+)\)$/.exec(value);
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), Number(rgba[4])];
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`not a colour: ${value}`);
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(value.slice(i, i + 2), 16));
  return [r, g, b, 1];
}

const over = ([r, g, b, a]: Color, [br, bg, bb]: Color): Color => [
  r * a + br * (1 - a),
  g * a + bg * (1 - a),
  b * a + bb * (1 - a),
  1,
];

function luminance(c: Color): number {
  const [r, g, b] = c.slice(0, 3).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Color, b: Color): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each(['light', 'dark'] as const)('hx-list row contrast, %s theme', (scheme) => {
  const token = (name: string) => color(scheme, `var(${name})`);

  describe.each(['frame', 'panel', 'card', 'overlay'])('on the %s surface', (name) => {
    const surface = () => token(`--h-surface-${name}`);

    it.each(['--h-list-row-color', '--h-list-row-meta-color'])('%s is 4.5:1', (fg) => {
      expect(contrast(token(fg), surface())).toBeGreaterThanOrEqual(4.5);
    });

    it.each(['hover', 'current', 'selected', 'selected-hover'])('the %s row is 4.5:1', (state) => {
      const background = over(token(`--h-list-row-${state}-background`), surface());
      const text = over(token(`--h-list-row-${state}-color`), background);
      expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
