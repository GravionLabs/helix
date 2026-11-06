import { describe, expect, it } from 'vitest';
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { resolveTokens } from '../tokens/resolve.mjs';

// ADR 0004: the surface roles per colour scheme, the dark elevation steps and the AA text contrast on each.
const tokens = resolveTokens(helixTokens).json as Record<'light' | 'dark', Record<string, string>>;

/** Follows `var(--h-x)` chains to a hex colour. */
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

const SURFACES = ['frame', 'panel', 'card', 'overlay'] as const;

describe('surface roles (ADR 0004)', () => {
  it('light: frame 50, panel 0, card 0, overlay 0, hover 100, hairline 200, divider 100', () => {
    const t = tokens.light;
    expect(t['--h-surface-frame']).toBe('var(--h-surface-50)');
    expect(t['--h-surface-panel']).toBe('var(--h-surface-0)');
    expect(t['--h-surface-card']).toBe('var(--h-surface-0)');
    expect(t['--h-surface-overlay']).toBe('var(--h-surface-0)');
    expect(t['--h-surface-hover']).toBe('var(--h-surface-100)');
    expect(t['--h-border-panel']).toBe('var(--h-surface-200)');
    expect(t['--h-border-divider']).toBe('var(--h-surface-100)');
  });

  it('dark: frame 950, panel 900, card 800, overlay 800, hover 700, hairline and divider 700', () => {
    const t = tokens.dark;
    expect(t['--h-surface-frame']).toBe('var(--h-surface-950)');
    expect(t['--h-surface-panel']).toBe('var(--h-surface-900)');
    expect(t['--h-surface-card']).toBe('var(--h-surface-800)');
    expect(t['--h-surface-overlay']).toBe('var(--h-surface-800)');
    expect(t['--h-surface-hover']).toBe('var(--h-surface-700)');
    expect(t['--h-border-panel']).toBe('var(--h-surface-700)');
    expect(t['--h-border-divider']).toBe('var(--h-surface-700)');
  });

  it('components read the roles: content border is the panel hairline, dividers the divider role', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const t = { ...tokens.light, ...tokens[scheme] };
      expect(t['--h-content-border-color'], scheme).toBe('var(--h-border-panel)');
      expect(t['--h-content-background'], scheme).toBe('var(--h-surface-panel)');
      expect(t['--h-divider-border-color'], scheme).toBe('var(--h-border-divider)');
      expect(t['--h-overlay-modal-background'], scheme).toBe('var(--h-surface-overlay)');
    }
  });

  it('cards and panels share the md radius; the card has a hairline and no shadow', () => {
    expect(tokens.light['--h-card-border-radius']).toBe(tokens.light['--h-content-border-radius']);
    expect(tokens.light['--h-card-border-color']).toBe('var(--h-border-panel)');
    expect(tokens.light['--h-card-shadow']).toBe('none');
    expect({ ...tokens.light, ...tokens.dark }['--h-card-background']).toBe(
      'var(--h-surface-card)',
    );
  });

  it('dark overlays carry a 40 % black shadow', () => {
    expect(tokens.dark['--h-overlay-modal-shadow']).toContain('rgba(0, 0, 0, 0.4)');
    expect(tokens.light['--h-overlay-modal-shadow']).toContain('rgba(0, 0, 0, 0.1)');
  });

  // Expected ratios are literals computed from the hex values of the audit (#1027).
  it('dark steps are visible: hairline against panel is 1.27:1', () => {
    expect(contrast(hex('dark', '--h-border-panel'), hex('dark', '--h-surface-panel'))).toBeCloseTo(
      1.27,
      1,
    );
    expect(hex('dark', '--h-surface-card')).not.toBe(hex('dark', '--h-surface-panel'));
    expect(hex('dark', '--h-surface-panel')).not.toBe(hex('dark', '--h-surface-frame'));
  });

  describe.each(['light', 'dark'] as const)('AA text contrast (%s)', (scheme) => {
    it.each(SURFACES)('text and muted text on %s are at least 4.5:1', (role) => {
      const ground = hex(scheme, `--h-surface-${role}`);
      expect(contrast(hex(scheme, '--h-text-color'), ground)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(hex(scheme, '--h-text-muted-color'), ground)).toBeGreaterThanOrEqual(4.5);
    });

    it('primary text is at least 4.5:1 on panel and card', () => {
      for (const role of ['panel', 'card']) {
        expect(
          contrast(hex(scheme, '--h-primary-color'), hex(scheme, `--h-surface-${role}`)),
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  // #1060: the hover must show a step on every host it can sit on, not only on the panel.
  describe.each(['light', 'dark'] as const)('hover against its host (%s)', (scheme) => {
    // Resolved colours; the literals are the scale steps of semantic.ts.
    const HOVER = { light: '#ebebef', dark: '#2e2e32' }[scheme];
    const HOSTS = {
      light: { frame: '#f6f6f7', panel: '#ffffff', card: '#ffffff', overlay: '#ffffff' },
      dark: { frame: '#161618', panel: '#1b1b1f', card: '#202127', overlay: '#202127' },
    }[scheme];

    it('--h-surface-hover resolves to the documented step', () => {
      expect(hex(scheme, '--h-surface-hover')).toBe(HOVER);
    });

    it.each(SURFACES)(
      'hover differs from the %s host (lighter in dark, darker in light)',
      (role) => {
        const host = hex(scheme, `--h-surface-${role}`);
        expect(host).toBe(HOSTS[role]);
        expect(host).not.toBe(hex(scheme, '--h-surface-hover'));
        if (scheme === 'dark') {
          expect(luminance(hex(scheme, '--h-surface-hover'))).toBeGreaterThan(luminance(host));
        } else {
          expect(luminance(hex(scheme, '--h-surface-hover'))).toBeLessThan(luminance(host));
        }
      },
    );

    it.each(SURFACES)('text and hover text on the hover background are 4.5:1 (%s host)', () => {
      const hover = hex(scheme, '--h-surface-hover');
      expect(contrast(hex(scheme, '--h-text-color'), hover)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(hex(scheme, '--h-text-hover-color'), hover)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(hex(scheme, '--h-text-muted-color'), hover)).toBeGreaterThanOrEqual(4.5);
    });

    it.each([
      '--h-content-hover-background',
      '--h-datatable-row-hover-background',
      '--h-tree-node-hover-background',
      '--h-tabbar-tab-hover-background',
      '--h-list-option-focus-background',
      '--h-navigation-item-focus-background',
      '--h-menu-item-focus-background',
    ])('%s resolves to the hover step, so rows and items on any host show it', (name) => {
      expect(hex(scheme, name)).toBe(HOVER);
    });
  });

  it('dark hover is 1.18:1 against a card or overlay host and 1.27:1 against the panel', () => {
    const hover = hex('dark', '--h-surface-hover');
    expect(contrast(hover, hex('dark', '--h-surface-card'))).toBeCloseTo(1.18, 1);
    expect(contrast(hover, hex('dark', '--h-surface-overlay'))).toBeCloseTo(1.18, 1);
    expect(contrast(hover, hex('dark', '--h-surface-panel'))).toBeCloseTo(1.27, 1);
  });
});
