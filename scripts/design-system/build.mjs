// The whole Design System folder (#522): `pnpm design-system:build` → dist/design-system/project/…
//
//   tokens.json                      helixPreset resolved (tokens.mjs)
//   README.md                        the brand book (content/README.md)
//   components/bundle.css            tokens + structural CSS of the previewed components (bundle.mjs)
//   components/<Name>/…              README.md + preview.html per component (previews.mjs)
//   components/Cover/preview.html    the cover, built from the tokens
//   fonts/*.woff2                    Geist and Geist Mono (latin, variable) from @fontsource-variable
//   assets/Logos/…                   the Helix mark, one file per theme, and its usage note
//
// Everything is derived from the repository, nothing from the clock: a second run writes the same bytes.
// The index (design-system.json) is written when the system is published, because it records the ids of
// the uploaded assets (docs/CONTRIBUTING-design-system.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComponents } from './bundle.mjs';
import { FONTS, buildTokens, createResolver } from './tokens.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const OUT = path.join(ROOT, 'dist/design-system/project');

// ---------------------------------------------------------------------------------------- the cover

/**
 * components/Cover/preview.html (cover.md of the Design System type): palette blocks and one pattern in
 * the system's tokens, the name bottom-left. 960 × 320, one layout, no motion.
 *
 * Derivation — blocks: `primary` slab 240×192, `contrast` slab 240×120 and a `primary-200` tint 120×96, three
 * state squares (success, warn, danger) the size of a spacing step; arrangement: a flush modular grid on a
 * 24px unit from x = 480, bleeding off the top and right edges; pattern: a double helix of 38 dots (the
 * mark of the shell's nav rail), two strands in `primary` and `contrast` at a 24px pitch under the blocks,
 * the one motif only this brand has; steps and radii: 24px unit, `radius-md` on every block.
 */
export function coverOf() {
  const dots = [];
  for (let i = 0; i < 19; i++) {
    const x = 496 + 24 * i;
    const dy = Math.round(28 * Math.sin((i * 2 * Math.PI) / 9) * 100) / 100;
    dots.push(`<circle class="p" cx="${x}" cy="${268 + dy}" r="5"/>`, `<circle class="k" cx="${x}" cy="${268 - dy}" r="5"/>`);
  }
  return `<!-- @dsCard height=320 -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Helix</title>
<style>
html,body{margin:0;background:transparent}
svg{display:block}
.p{fill:var(--primary)}.k{fill:var(--contrast)}.t{fill:var(--primary-200)}.s{fill:var(--success)}.w{fill:var(--warn)}.d{fill:var(--danger)}
rect{rx:var(--radius-md)}
.name{font-family:var(--font-sans),system-ui,sans-serif;font-weight:700;letter-spacing:-0.02em;fill:var(--text)}
.tag{font-family:var(--font-sans),system-ui,sans-serif;font-size:14px;fill:var(--text-muted)}
</style>
</head>
<body>
<svg width="960" height="320" viewBox="0 0 960 320" role="img" aria-label="Helix">
<!-- blocks: primary 240×192, contrast 240×120, primary-200 120×96, success/warn/danger at spacing steps.
     arrangement: flush modular grid on a 24px unit from x=480, bleeding off the top and right edges.
     pattern: double helix, 38 dots at a 24px pitch (the mark of the nav rail): strands in primary and contrast.
     steps and radii: 24px unit, radius-md on the blocks. -->
<rect class="p" x="480" y="0" width="240" height="192"/>
<rect class="k" x="720" y="0" width="240" height="120"/>
<rect class="t" x="720" y="120" width="120" height="96"/>
<rect class="s" x="840" y="120" width="48" height="48"/>
<rect class="w" x="888" y="120" width="48" height="24"/>
<rect class="d" x="888" y="144" width="48" height="24"/>
${dots.join('\n')}
<text class="name" x="48" y="214" font-size="112">Helix</text>
<text class="tag" x="52" y="256">Angular components, application shell, dynamic forms.</text>
</svg>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------------------- the logo

const HELIX_MARK = `<path d="m10 16 1.5 1.5"/><path d="m14 8-1.5-1.5"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m16.5 10.5 1 1"/><path d="m17 6-2.891-2.891"/><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="m20 9 .891.891"/><path d="M3.109 14.109 4 15"/><path d="m6.5 12.5 1 1"/><path d="m7 18 2.891 2.891"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>`;

/** The mark of the shell's nav rail (Lucide `dna`, ISC) in the primary colour of a theme. */
export const markOf = (ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${HELIX_MARK}</svg>\n`;

// ---------------------------------------------------------------------------------------- the folder

/** Every file of the system but the index, `{ path under project/: text | Buffer }`. */
export async function buildSystem() {
  const exported = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/tokens/helix.json'), 'utf8'));
  const { tokens } = buildTokens(exported);
  const { literal } = createResolver(exported);
  const ink = { light: literal('--h-primary-color', 'light'), dark: literal('--h-primary-color', 'dark') };

  const files = {
    'tokens.json': `${JSON.stringify(tokens, null, 2)}\n`,
    'README.md': fs.readFileSync(path.join(import.meta.dirname, 'content/README.md'), 'utf8'),
    ...(await buildComponents()),
    'components/Cover/preview.html': coverOf(),
    'assets/Logos/helix-mark-light.svg': markOf(ink.light),
    'assets/Logos/helix-mark-dark.svg': markOf(ink.dark),
    'assets/Logos/README.md': `The Helix mark: the double helix of the application shell's navigation rail (Lucide \`dna\`, ISC licence), a single-ink glyph drawn with a 2px round stroke on a 24px grid.

- \`helix-mark-light.svg\`: ink \`${ink.light}\` (\`primary\` on light), for light grounds.
- \`helix-mark-dark.svg\`: ink \`${ink.dark}\` (\`primary\` on dark), for dark grounds.

Use it at 24px or larger with clear space of one quarter of its size; do not recolour it, outline it or put it on a \`primary\` fill.
`,
  };
  for (const f of FONTS) {
    files[`fonts/${f.file}`] = fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource-variable', f.pkg, 'files', f.file));
  }
  return files;
}

export function writeSystem(files, out = OUT) {
  fs.rmSync(out, { recursive: true, force: true });
  for (const [rel, data] of Object.entries(files)) {
    const file = path.join(out, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, data);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const needed of ['dist/tokens/helix.json', 'dist/core/fesm2022']) {
    if (!fs.existsSync(path.join(ROOT, needed))) {
      console.error(`${needed} not found — run \`pnpm build:lib\` first`);
      process.exit(1);
    }
  }
  const files = await buildSystem();
  writeSystem(files);
  const size = Object.values(files).reduce((n, d) => n + d.length, 0);
  console.log(`${path.relative(ROOT, OUT)}: ${Object.keys(files).length} files, ${(size / 1024).toFixed(0)} kB`);
}
