// Resolves the Helix tokens (dist/tokens/helix.json, from `pnpm tokens:export`; the data is projects/tokens) to the Design System
// type's `tokens.json` (#527, epic #519): colours per theme, spacing, radius, shadow and type.
//
// The type reads colours as literals (`#rrggbb`, `rgb()`, …) or `{alias}` of another colour token, never
// `var()` or `color-mix()`; a `var(--h-x)` that points at another curated token becomes that alias, so the
// file keeps the preset's structure (primary → primary-600 → indigo-600), everything else is resolved to
// its literal value.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const SCHEMES = ['light', 'dark'];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// ---------------------------------------------------------------------------------------- resolving

const VAR = /^var\((--[\w-]+)\)$/;
const MIX = /^color-mix\(in srgb, (.+), transparent (\d+(?:\.\d+)?)%\)$/;

/** `#rgb`/`#rrggbb` → [r, g, b] (0–255). */
export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
}

/** WCAG contrast ratio of two `#rrggbb` colours. */
export function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, bl] = hexToRgb(hex).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * A resolver over the exported tokens: `value(name, scheme)` is the raw value of a custom property in a
 * scheme (a dark token not overridden falls back to light), `literal(name, scheme)` follows `var()` to a
 * concrete value (`color-mix(…, transparent N%)` becomes `rgba()`), or null when it cannot.
 */
export function createResolver(tokens) {
  const value = (name, scheme) => tokens[scheme]?.[name] ?? tokens.light[name];
  const literal = (name, scheme, depth = 0) => {
    if (depth > 16) return null;
    const raw = value(name, scheme);
    if (raw == null) return null;
    return literalOf(String(raw).trim(), scheme, depth);
  };
  const literalOf = (raw, scheme, depth) => {
    const ref = VAR.exec(raw);
    if (ref) return literal(ref[1], scheme, depth + 1);
    const mix = MIX.exec(raw);
    if (mix) {
      const base = literalOf(mix[1].trim(), scheme, depth + 1);
      if (!base?.startsWith('#')) return null;
      const [r, g, b] = hexToRgb(base);
      return `rgba(${r}, ${g}, ${b}, ${Number(((100 - Number(mix[2])) / 100).toFixed(2))})`;
    }
    return raw;
  };
  return { value, literal, literalOf };
}

// ---------------------------------------------------------------------------------------- the colour set

const PALETTES = ['indigo', 'red', 'green', 'sky', 'orange', 'purple'];
const SEVERITIES = [
  ['success', 'Success: confirmation, completed, valid.'],
  ['info', 'Info: neutral notices and help.'],
  ['warn', 'Warning: needs attention, not blocking.'],
  ['help', 'Help: hints, secondary highlights.'],
  ['danger', 'Danger: errors, destructive actions.'],
];

const SURFACE_USAGE = {
  0: 'Page and cards on light, fields; the lightest neutral.',
  50: 'Chrome on light (topbar, nav, status bar) and soft blocks.',
  100: 'Hover and quiet fills on light (secondary button, row hover).',
  200: 'Dividers and card borders on light.',
  300: 'Control borders on light.',
  400: 'Muted text on dark; placeholders.',
  500: 'Muted text on light.',
  600: 'Text on light; control borders on dark.',
  700: 'Dividers and hover on dark.',
  800: 'Cards and overlays on dark.',
  900: 'Page on dark.',
  950: 'Chrome and fields on dark.',
};

/** [token name, custom property, usage] — the curated colour tokens, in display order. */
export function colorSpec() {
  const spec = [];
  for (const p of PALETTES) {
    for (const s of STEPS) {
      spec.push([`${p}-${s}`, `--h-${p}-${s}`, `${p[0].toUpperCase()}${p.slice(1)} ${s} of Helix's muted scale (primitive; use the semantic tokens in UI).`]);
    }
  }
  for (const s of STEPS) spec.push([`primary-${s}`, `--h-primary-${s}`, `Primary scale step ${s}: the brand colour's tints and shades (indigo).`]);
  for (const s of [0, ...STEPS]) spec.push([`surface-${s}`, `--h-surface-${s}`, SURFACE_USAGE[s]]);
  spec.push(
    ['primary', '--h-primary-color', 'Brand colour: filled buttons, links, focus ring, selected state. 600 on light, 400 on dark.'],
    ['primary-hover', '--h-primary-hover-color', 'Primary on hover.'],
    ['primary-active', '--h-primary-active-color', 'Primary while pressed.'],
    ['primary-contrast', '--h-primary-contrast-color', 'Text and icons on a primary fill.'],
    ['highlight', '--h-highlight-background', 'Selected list item, selected row, text selection background.'],
    ['text', '--h-text-color', 'Body text and headings; on surface-0 (light) and surface-900/950 (dark).'],
    ['text-muted', '--h-text-muted-color', 'Secondary text, captions, helper text; ≥ 4.5:1 on cards in both themes.'],
    ['content-bg', '--h-content-background', 'Card and panel background.'],
    ['content-border', '--h-content-border-color', 'Card and panel border, dividers.'],
    ['field-bg', '--h-form-field-background', 'Input background.'],
    ['field-border', '--h-form-field-border-color', 'Input border.'],
    ['field-border-hover', '--h-form-field-hover-border-color', 'Input border on hover.'],
    ['field-border-focus', '--h-form-field-focus-border-color', 'Input border when focused (the primary colour).'],
    ['field-border-invalid', '--h-form-field-invalid-border-color', 'Input border when invalid.'],
    ['field-placeholder', '--h-form-field-placeholder-color', 'Placeholder text.'],
    ['mask', '--h-mask-background', 'Backdrop behind a modal dialog.'],
    ['secondary', '--h-button-secondary-background', 'Secondary button fill: a quiet neutral.'],
    ['secondary-text', '--h-button-secondary-color', 'Text on a secondary button.'],
    ['contrast', '--h-button-contrast-background', 'Contrast button fill: the strongest neutral (near-black on light, white on dark).'],
    ['contrast-text', '--h-button-contrast-color', 'Text on a contrast button.'],
  );
  for (const [sev, note] of SEVERITIES) {
    spec.push([sev, `--h-button-${sev}-background`, `${note} Fill colour.`], [`on-${sev}`, `--h-button-${sev}-color`, `Text and icons on ${sev}.`]);
  }
  return spec;
}

/** The `color` family: themes and tokens with per-theme values (aliases where a var() names a curated token). */
export function buildColors(tokens) {
  const { literal, value } = createResolver(tokens);
  const spec = colorSpec();
  const byVar = new Map(spec.map(([name, prop]) => [prop, name]));
  const skipped = [];
  const out = [];
  for (const [name, prop, usage] of spec) {
    const perTheme = {};
    for (const scheme of SCHEMES) {
      const raw = String(value(prop, scheme) ?? '').trim();
      const ref = VAR.exec(raw);
      const aliasTo = ref && byVar.get(ref[1]);
      const lit = literal(prop, scheme);
      if (aliasTo && aliasTo !== name && literal(ref[1], scheme)) perTheme[scheme] = `{${aliasTo}}`;
      else if (lit?.startsWith('#') || lit?.startsWith('rgb')) perTheme[scheme] = lit;
    }
    if (!perTheme.light) {
      skipped.push(`${name} (${prop})`);
      continue;
    }
    // Same value in both themes: a plain string (the first theme's), the type's shorthand.
    out.push({ name, value: perTheme.dark && perTheme.dark !== perTheme.light ? perTheme : perTheme.light, usage });
  }
  // Text on a fill below 4.5:1 stays as the preset has it (Aura's semantics), flagged in its usage note.
  for (const [sev] of SEVERITIES) {
    const token = out.find((t) => t.name === `on-${sev}`);
    const ratios = SCHEMES.map((scheme) => {
      const fg = literal(`--h-button-${sev}-color`, scheme);
      const bg = literal(`--h-button-${sev}-background`, scheme);
      return fg?.startsWith('#') && bg?.startsWith('#') ? contrast(fg, bg) : null;
    });
    if (token && ratios.some((r) => r != null && r < 4.5)) {
      const [l, d] = ratios.map((r) => (r == null ? '–' : r.toFixed(1)));
      token.usage += ` Contrast on ${sev}: ${l}:1 light, ${d}:1 dark — below 4.5:1 for small text (as in Aura); keep it to bold or large text.`;
    }
  }
  return { color: { themes: [{ id: 'light', name: 'Light' }, { id: 'dark', name: 'Dark' }], tokens: out }, skipped };
}

// ---------------------------------------------------------------------------------------- the rest

/** The layout constants of helix-shell (`--helix-*` in styles-src.css), read from the source. */
export function shellConstants(css = fs.readFileSync(path.join(ROOT, 'projects/shell/styles-src.css'), 'utf8')) {
  const get = (name) => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1].trim();
  return {
    'layout-gap': get('helix-layout-gap'),
    'topbar-height': get('helix-topbar-height'),
    'status-bar-height': get('helix-status-bar-height'),
    'nav-width': get('helix-nav-width'),
    'nav-width-collapsed': get('helix-nav-width-collapsed'),
  };
}

const px = (rem, base = 14) => `${Number((Number.parseFloat(rem) * base).toFixed(2))}px`;
const toPx = (v) => (String(v).endsWith('rem') ? px(v) : v);

export function buildSpacing(tokens, shell = shellConstants()) {
  const { literal } = createResolver(tokens);
  const L = (prop) => literal(prop, 'light');
  return {
    tokens: [
      { name: 'field-padding-x', value: toPx(L('--h-form-field-padding-x')), usage: 'Horizontal padding of inputs and buttons.' },
      { name: 'field-padding-y', value: toPx(L('--h-form-field-padding-y')), usage: 'Vertical padding of inputs and buttons.' },
      { name: 'list-gap', value: L('--h-list-gap'), usage: 'Gap between options in lists and menus.' },
      { name: 'list-padding', value: toPx(L('--h-list-padding')?.split(' ')[0]), usage: 'Inner padding of lists and menus.' },
      { name: 'layout-gap', value: toPx(shell['layout-gap']), usage: 'Gap between cards and between columns of the application shell.' },
      { name: 'topbar-height', value: toPx(shell['topbar-height']), usage: 'Height of the shell topbar.' },
      { name: 'status-bar-height', value: toPx(shell['status-bar-height']), usage: 'Height of the shell status bar.' },
      { name: 'nav-width', value: toPx(shell['nav-width']), usage: 'Width of the expanded nav rail.' },
      { name: 'nav-width-collapsed', value: toPx(shell['nav-width-collapsed']), usage: 'Width of the collapsed nav rail.' },
    ].filter((t) => t.value),
  };
}

export function buildRadius(tokens) {
  const { literal } = createResolver(tokens);
  const usage = { none: 'Square corners.', xs: 'Checkbox boxes, small chips.', sm: 'List options, menu items.', md: 'Buttons, inputs, cards and panels (the Helix default).', lg: 'Larger surfaces.', xl: 'Modal dialogs.' };
  return {
    tokens: Object.entries(usage).map(([k, u]) => ({ name: `radius-${k}`, value: literal(`--h-border-radius-${k}`, 'light'), usage: u })).filter((t) => t.value),
  };
}

export function buildShadow(tokens) {
  const { literal } = createResolver(tokens);
  const usage = { select: 'Select and autocomplete panels.', popover: 'Popovers and tooltips.', modal: 'Modal dialogs.', navigation: 'Menus and overlay navigation.' };
  return {
    tokens: Object.entries(usage).map(([k, u]) => ({ name: `shadow-${k}`, value: literal(`--h-overlay-${k}-shadow`, 'light'), usage: u })).filter((t) => t.value),
  };
}

/** Fonts: Inter (text and headings), self-hosted latin variable file; code uses the system monospace. */
export const FONTS = [
  { family: 'Inter', pkg: 'inter', weight: '100 900', file: 'inter-latin-wght-normal.woff2' },
];

export function buildType(tokens) {
  const { literal } = createResolver(tokens);
  const smallRem = literal('--h-form-field-sm-font-size', 'light');
  const largeRem = literal('--h-form-field-lg-font-size', 'light');
  const style = (name, size, lh, weight, extra = {}) => ({ name, fontSize: size, lineHeight: lh, fontWeight: weight, ...extra });
  return {
    fonts: FONTS.map((f) => ({ family: f.family, file: `fonts/${f.file}`, weight: f.weight, style: 'normal' })),
    families: {
      sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace',
    },
    groups: [
      {
        name: 'Display',
        family: 'sans',
        styles: [
          style('h1', px('2.5rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Page title.' }),
          style('h2', px('2rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Section heading.' }),
          style('h3', px('1.75rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Subsection heading.' }),
          style('h4', px('1.5rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Card title (large).' }),
          style('h5', px('1.25rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Card title.' }),
          style('h6', px('1rem'), 1.3, 700, { letterSpacing: '-0.02em', usage: 'Small heading.' }),
        ],
      },
      {
        name: 'Text',
        family: 'sans',
        styles: [
          style('body', '14px', 1.4, 400, { usage: 'Default text: the application root is 14px.' }),
          style('body-strong', '14px', 1.4, 600, { usage: 'Labels, emphasised text.' }),
          style('small', toPx(smallRem), 1.4, 400, { usage: 'Small controls, captions, helper text.' }),
          style('large', toPx(largeRem), 1.4, 400, { usage: 'Large controls, lead text.' }),
        ],
      },
      { name: 'Code', family: 'mono', styles: [style('code', '14px', 1.5, 400, { usage: 'Inline code and code blocks.' })] },
    ],
  };
}

/** The complete tokens.json. */
export function buildTokens(tokens, { shell } = {}) {
  const { color, skipped } = buildColors(tokens);
  return {
    tokens: {
      name: 'Helix',
      version: 1,
      color,
      type: buildType(tokens),
      spacing: buildSpacing(tokens, shell),
      radius: buildRadius(tokens),
      shadow: buildShadow(tokens),
      meta: { source: 'github', repo: 'GravionLabs/helix', package: 'projects/tokens', paths: { tokens: ['projects/tokens/src/index.ts', 'projects/tokens/src/palettes.ts'], fonts: ['@fontsource-variable/figtree', '@fontsource-variable/space-grotesk', '@fontsource-variable/fira-code'] } },
    },
    skipped,
  };
}

// ---------------------------------------------------------------------------------------- the file

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const src = path.join(ROOT, 'dist/tokens/helix.json');
  if (!fs.existsSync(src)) {
    console.error('dist/tokens/helix.json not found — run `pnpm tokens:export` first');
    process.exit(1);
  }
  const out = path.resolve(ROOT, process.argv[2] ?? 'dist/design-system/project/tokens.json');
  const { tokens, skipped } = buildTokens(JSON.parse(fs.readFileSync(src, 'utf8')));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(tokens, null, 2)}\n`);
  console.log(`${path.relative(ROOT, out)}: ${tokens.color.tokens.length} colours, ${tokens.spacing.tokens.length} spacing, ${tokens.radius.tokens.length} radius, ${tokens.shadow.tokens.length} shadow`);
  if (skipped.length) console.log(`skipped (no literal value): ${skipped.join(', ')}`);
}
