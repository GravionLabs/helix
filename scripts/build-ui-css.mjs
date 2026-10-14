#!/usr/bin/env node
// The CSS of @gravionlabs/helix-ui (#541): dist/ui/styles.css, dist/ui/core.css and dist/ui/tokens.css.
//
//   styles.css  projects/ui/styles/*.scss (compiled to plain CSS), one file per component, in a `components` cascade layer:
//               an application's unlayered CSS and Tailwind's `utilities` layer win over it, so a
//               component can be adjusted from the outside without specificity fights.
//   core.css    a smaller alternative to styles.css for apps that use only the everyday components (#925):
//               the stylesheets in CORE_COMPONENTS, same layer and layer order statement. Load either styles.css
//               or core.css, not both.
//   tokens.css  the Helix tokens the components read, resolved from the token data of projects/tokens: the
//               primitive/semantic/global variables and the tokens of every component that has a
//               stylesheet (light on :root, dark under `.app-dark`). Load it in every app.
//
// Run: node scripts/build-ui-css.mjs   (needs nothing built: the tokens are resolved from projects/tokens)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import { helixTokens } from '../projects/tokens/src/index.ts';
import { DARK_SELECTOR } from './export-tokens.mjs';
import { resolveTokens } from './tokens/resolve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STYLES = path.join(ROOT, 'projects/ui/styles');
// HELIX_UI_CSS_OUT redirects the output (the build-script tests write to a temporary directory)
export const OUT = process.env.HELIX_UI_CSS_OUT ? path.resolve(process.env.HELIX_UI_CSS_OUT) : path.join(ROOT, 'dist/ui');

/**
 * The tokens of the preset's components that each stylesheet reads (the stylesheet `input.scss` reads those of
 * `inputtext`, …). A stylesheet without an entry here is an error, so a new component cannot ship without its tokens.
 */
export const TOKEN_COMPONENTS = {
  accordion: ['accordion'],
  avatar: ['avatar'],
  badge: ['badge', 'overlaybadge'],
  breadcrumb: ['breadcrumb'],
  button: ['button'],
  'button-group': ['button'],
  card: ['card'],
  carousel: ['carousel'],
  chart: [],
  checkbox: ['checkbox'],
  confirm: ['confirmdialog', 'confirmpopup'],
  'data-table': ['datatable'],
  dialog: ['dialog'],
  divider: ['divider'],
  'float-label': ['floatlabel'],
  galleria: ['galleria'],
  drawer: ['drawer'],
  fieldset: ['fieldset'],
  'icon-field': ['iconfield', 'inputtext'],
  image: ['image'],
  input: ['inputtext', 'textarea'],
  listbox: ['listbox', 'inputtext'],
  menu: ['menu', 'tieredmenu'],
  menubar: ['menubar'],
  message: ['message'],
  'multi-select': ['multiselect', 'inputtext', 'checkbox'],
  'auto-complete': ['autocomplete', 'inputtext'],
  'date-picker': ['datepicker', 'inputtext'],
  'time-picker': ['datepicker', 'inputtext'],
  'time-row': ['datepicker'],
  'date-time-picker': ['datepicker', 'inputtext'],
  'date-time-range-picker': ['datepicker', 'inputtext'],
  'file-upload': ['fileupload', 'button'],
  'input-group': ['inputgroup'],
  'input-number': ['inputnumber', 'inputtext'],
  paginator: ['paginator'],
  panel: ['panel'],
  password: ['password', 'inputtext'],
  progress: ['progressbar', 'progressspinner'],
  popover: ['popover'],
  radio: ['radiobutton'],
  select: ['select'],
  skeleton: ['skeleton'],
  slider: ['slider'],
  rating: ['rating'],
  'select-button': ['selectbutton', 'togglebutton'],
  chip: ['chip'],
  'cdk-overlay': [],
  'split-button': ['splitbutton'],
  stepper: ['stepper'],
  switch: ['toggleswitch'],
  'toggle-button': ['togglebutton'],
  toolbar: ['toolbar'],
  tag: ['tag'],
  table: ['datatable'],
  tabs: ['tabs'],
  timeline: ['timeline'],
  tree: ['tree'],
  toast: ['toast'],
  tooltip: ['tooltip'],
};

/**
 * The stylesheets of core.css: actions, form basics, containers, overlays and feedback (and the CDK overlay CSS the
 * overlays need). Left out, still in styles.css: the chart (needs chart.js), media (galleria, carousel, image), data
 * display (table, data-table, tree, timeline, paginator), the date and time pickers, navigation bars (menubar,
 * breadcrumb, stepper) and the specialised inputs (auto-complete, multi-select, file-upload, rating, slider,
 * select-button, toggle-button).
 */
export const CORE_COMPONENTS = [
  'cdk-overlay',
  'accordion',
  'avatar',
  'badge',
  'button',
  'button-group',
  'card',
  'checkbox',
  'chip',
  'confirm',
  'dialog',
  'divider',
  'drawer',
  'fieldset',
  'float-label',
  'icon-field',
  'input',
  'input-group',
  'input-number',
  'listbox',
  'menu',
  'message',
  'panel',
  'password',
  'popover',
  'progress',
  'radio',
  'select',
  'skeleton',
  'split-button',
  'switch',
  'tabs',
  'tag',
  'toast',
  'toolbar',
  'tooltip',
];

/** The component stylesheets, `{ name: 'button', css }`, in name order. */
export function componentStyles(dir = STYLES) {
  const own = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.scss') && !f.startsWith('_'))
    .sort()
    .map((f) => ({
      name: f.slice(0, -5),
      // SCSS is a build-time convenience (loops, mixins, nesting): the package ships plain CSS
      css: sass.compile(path.join(dir, f), { style: 'expanded' }).css.trim(),
    }));
  // The CDK overlay container's structural CSS (positioning, z-index, backdrop) comes first: overlay based
  // components (Select, …) do not work without it.
  const cdk = path.join(ROOT, 'node_modules/@angular/cdk/overlay-prebuilt.css');
  return [{ name: 'cdk-overlay', css: fs.readFileSync(cdk, 'utf8').trim() }, ...own];
}

/** core.css: the stylesheets of `names` only, in the same layer as styles.css. An unknown name is an error. */
export function buildCore(styles = componentStyles(), names = CORE_COMPONENTS) {
  const known = new Set(styles.map((s) => s.name));
  const unknown = names.filter((n) => !known.has(n));
  if (unknown.length) throw new Error(`CORE_COMPONENTS names no stylesheet: ${unknown.join(', ')} (scripts/build-ui-css.mjs)`);
  return buildStyles(styles.filter((s) => names.includes(s.name)));
}

export function buildStyles(styles = componentStyles()) {
  const body = styles.map(({ name, css }) => `/* ${name} */\n${css}`).join('\n\n');
  const indented = body
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n');
  return `/* @gravionlabs/helix-ui: generated by scripts/build-ui-css.mjs from projects/ui/styles (do not edit). */\n/* The layer order Tailwind uses, stated here so it holds whichever stylesheet loads first. */\n@layer theme, base, components, utilities;\n\n@layer components {\n${indented}\n}\n`;
}

export function buildTokens(styles = componentStyles()) {
  const components = [
    ...new Set(
      styles.flatMap((s) => {
        const tokens = TOKEN_COMPONENTS[s.name];
        if (!tokens) throw new Error(`projects/ui/styles/${s.name}.scss has no entry in TOKEN_COMPONENTS (scripts/build-ui-css.mjs)`);
        return tokens;
      }),
    ),
  ];
  const { css } = resolveTokens(helixTokens, { darkSelector: DARK_SELECTOR, components });
  return `/* @gravionlabs/helix-ui: the Helix tokens the components read, from the Helix tokens (generated by scripts/build-ui-css.mjs; do not edit). Light on :root, dark under ${DARK_SELECTOR}. */\n${css}\n`;
}

/** `var(--h-x)` used without a fallback that a tokens stylesheet does not define. */
export function undefinedVariables(styles, tokens) {
  const defined = new Set([...tokens.matchAll(/(--h-[\w-]+)\s*:/g)].map((m) => m[1]));
  const used = new Set([...styles.matchAll(/var\((--h-[\w-]+)\)/g)].map((m) => m[1]));
  return [...used].filter((v) => !defined.has(v)).sort();
}

/** Adds `./styles.css`, `./core.css` and `./tokens.css` to the exports map of dist/ui (ng-packagr knows only the TS entry). */
export function addCssExports(dist = OUT) {
  const file = path.join(dist, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.exports ??= {};
  for (const name of ['styles.css', 'core.css', 'tokens.css']) pkg.exports[`./${name}`] = `./${name}`;
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const styles = componentStyles();
  const stylesCss = buildStyles(styles);
  const coreCss = buildCore(styles);
  const tokensCss = buildTokens(styles);
  const missing = undefinedVariables(stylesCss, tokensCss);
  if (missing.length) {
    console.error(`styles.css uses tokens that tokens.css does not define: ${missing.join(', ')}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'styles.css'), stylesCss);
  fs.writeFileSync(path.join(OUT, 'core.css'), coreCss);
  fs.writeFileSync(path.join(OUT, 'tokens.css'), tokensCss);
  if (fs.existsSync(path.join(OUT, 'package.json'))) addCssExports(OUT);
  const kB = (css) => `${(Buffer.byteLength(css) / 1024).toFixed(1)} kB`;
  console.log(
    `dist/ui (raw): styles.css ${kB(stylesCss)} (${styles.length} stylesheets), core.css ${kB(coreCss)} (${CORE_COMPONENTS.length} stylesheets), tokens.css ${kB(tokensCss)}`,
  );
}
