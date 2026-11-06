import { HX_THEME_PRESETS, VITEPRESS_PRIMARY } from './presets';
import { HX_SURFACES } from './surfaces';

/** WCAG 2.x contrast ratio of two `#rrggbb` colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
const round = (n: number) => Math.round(n * 100) / 100;

// The Helix colours the presets sit on (tokens.css, semantic.ts): written out here, not read from the tokens.
const HELIX = {
  indigo: { 400: '#8a94ce', 500: '#6c74be', 600: '#555dad' },
  lightPanel: '#ffffff',
  darkPanel: '#1b1b1f',
  darkSurface950: '#161618', // text of a filled button in dark mode
  lightText: '#3c3c43',
  darkText: '#dfdfd6',
};

describe('contrast of the VitePress scale (hand-written)', () => {
  it('step 600 (light primary) is VitePress brand-1: 7.1:1 on white, 7.08 before rounding', () => {
    expect(VITEPRESS_PRIMARY[600]).toBe('#3451b2');
    expect(round(contrast(VITEPRESS_PRIMARY[600], '#ffffff'))).toBe(7.08);
  });

  it('step 400 (dark primary) is VitePress brand-1 of dark: 8.5:1 on the dark panel', () => {
    expect(VITEPRESS_PRIMARY[400]).toBe('#a8b1ff');
    expect(round(contrast(VITEPRESS_PRIMARY[400], HELIX.darkPanel))).toBe(8.5);
  });

  it('the filled button in dark mode, white text on step 500, is 4.9:1 (helix: 4.30, below AA)', () => {
    expect(round(contrast('#ffffff', VITEPRESS_PRIMARY[500]))).toBe(4.9);
  });

  it('the scale has 11 colours that get darker from 50 to 950', () => {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
    expect(Object.keys(VITEPRESS_PRIMARY).map(Number)).toEqual([...steps]);
    const onWhite = steps.map((s) => contrast(VITEPRESS_PRIMARY[s], '#ffffff'));
    expect(onWhite).toEqual([...onWhite].sort((a, b) => a - b));
  });
});

describe('contrast of the bundled presets', () => {
  // The audit's values (docs/migrations/theme-audit.md) are the expected ones.
  it('helix: primary 5.91:1 on white (light) and 5.89:1 on the dark panel', () => {
    expect(round(contrast(HELIX.indigo[600], HELIX.lightPanel))).toBe(5.91);
    expect(round(contrast(HELIX.indigo[400], HELIX.darkPanel))).toBe(5.89);
  });

  it('helix: dark filled button on primary.500 with white text is 4.30:1, below AA (found by the audit)', () => {
    expect(round(contrast('#ffffff', HELIX.indigo[500]))).toBe(4.3);
    expect(contrast('#ffffff', HELIX.indigo[500])).toBeLessThan(4.5);
  });

  it('the filled buttons the components paint pass AA: light white on 600, dark surface.950 on 400', () => {
    for (const preset of ['helix', 'vitepress', 'compact'] as const) {
      const scale = HX_THEME_PRESETS[preset].primary;
      const p = typeof scale === 'string' ? HELIX.indigo : scale;
      expect(contrast('#ffffff', p[600])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(HELIX.darkSurface950, p[400])).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('every preset: primary as text on the panel and body text pass AA in both schemes', () => {
    for (const preset of ['helix', 'vitepress', 'compact'] as const) {
      const scale = HX_THEME_PRESETS[preset].primary;
      const p = typeof scale === 'string' ? HELIX.indigo : scale;
      expect(contrast(p[600], HELIX.lightPanel)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p[400], HELIX.darkPanel)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(HELIX.lightText, HELIX.lightPanel)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(HELIX.darkText, HELIX.darkPanel)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('the bundled presets use the neutrals of the tokens (no surface scale of their own)', () => {
    for (const preset of Object.values(HX_THEME_PRESETS)) expect(preset.surface).toBeNull();
    expect(Object.keys(HX_SURFACES)).not.toContain('helix');
  });

  it('presets: helix and vitepress comfortable, compact is helix plus the compact density', () => {
    expect(HX_THEME_PRESETS.helix.density).toBe('comfortable');
    expect(HX_THEME_PRESETS.vitepress.density).toBe('comfortable');
    expect(HX_THEME_PRESETS.compact).toEqual({ ...HX_THEME_PRESETS.helix, density: 'compact' });
    expect(Object.keys(HX_THEME_PRESETS)).toEqual(['helix', 'vitepress', 'compact']);
  });
});

describe('severity steps as text on white (audit, decision 6: found, not changed here)', () => {
  const found = {
    green500: ['#74b881', 2.36],
    orange500: ['#d48c67', 2.71],
    sky500: ['#67a1c6', 2.8],
    red500: ['#c76e67', 3.59],
    red700: ['#b55b52', 4.58], // 600 in the audit text, the AA threshold case
  } as const;
  for (const [name, [hex, ratio]] of Object.entries(found)) {
    it(`${name} ${hex} on white is ${ratio}:1`, () => {
      expect(contrast(hex, '#ffffff')).toBeCloseTo(ratio, 1);
    });
  }
});
