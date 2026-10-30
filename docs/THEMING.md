# Theming

Helix components are styled by **design tokens**: values declared once, in three layers, and turned into `--h-*`
CSS custom properties by a build step. A component reads only those variables, so changing a token, or the
primary colour at runtime, changes every component that refers to it, with no styling engine in the browser.

| Layer        | What                                                                                                             | Example                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `primitive`  | Palettes and radii                                                                                               | `{indigo.600}`, `{border.radius.md}`             |
| `semantic`   | The choices shared by every component: `primary`, `surface`, `text`, `formField`, `focusRing`, per colour scheme | `primary.color: '{primary.600}'`                 |
| `components` | Per-component tokens, referencing the layers above                                                               | `button.root.paddingX: '{form.field.padding.x}'` |

A token value is a CSS value or a `{reference}` to another token; a reference becomes `var(--h-…)`.

## Where the tokens live

The tokens are plain data in `projects/tokens`: `primitive.ts`, `semantic.ts`
(with `colorScheme.light` and `colorScheme.dark`) and one file per component under `components/`. The resolver
`scripts/tokens/resolve.mjs` turns that data into CSS and JSON. Nothing needs to
be built first, and nothing runs in the browser.

To change a token, edit its value in the file of its layer (the README of the project says how, and what the naming
rules are), then rebuild what reads the tokens: `pnpm build:lib:css:ui` for helix-ui, `pnpm tokens:site` for the
documentation site.

## The Helix look

The tokens are Aura's, adapted by Helix (decided in [ADR 0001](adr/0001-styling-foundation.md)):

- **Neutrals:** one grey scale for both colour schemes (`surface.0…950`): the surfaces and greys of the stock
  VitePress theme, so the demo, the docs and the other Gravion Labs sites look alike. Light: white page and
  cards, `surface.50` chrome, `surface.200` hairlines; dark: `surface.900` page, `surface.950` chrome,
  `surface.800` cards, text `#dfdfd6`.
- **Primary:** indigo: `primary.600` on light backgrounds, `primary.400` on dark ones.
- **Muted hues:** the primary and severity scales (indigo, red, green, sky, orange, purple, …) are
  Tailwind's with 45 % less chroma in OKLCH, same lightness (`palettes.ts`, generated from `tailwind.ts` by
  `pnpm palettes:generate [factor]`). Contrast ratios are those of Aura; the colours are quieter.
- **Text:** near-black (`surface.950`) with a darker muted step (`surface.600`) for 4.5:1 contrast on
  cards; the inverse in dark mode.
- **Radius:** Aura's 6 px (`border.radius.md`).
- **Type:** Inter for text and headings (one family; headings are weight 700 with −0.02em tracking) and the
  system monospace for code, declared as `--helix-font-sans`, `--helix-font-display` (an alias of sans, so an
  application can give headings another face) and `--helix-font-mono` by `helix-shell`'s stylesheet. The font file
  is the application's: the demo loads it from `@fontsource-variable/inter` (self-hosted, no font CDN).

## In an application

Load the tokens and the component styles of helix-ui, and the font:

```json
// angular.json → projects.<app>.architect.build.options.styles
[
  "node_modules/@fontsource-variable/inter/index.css",
  "node_modules/@gravionlabs/helix-ui/tokens.css",
  "node_modules/@gravionlabs/helix-ui/styles.css",
  "node_modules/@gravionlabs/helix-shell/styles.css",
  "node_modules/@gravionlabs/helix-shell/globals.css"
]
```

`globals.css` is opt-in (the Helix page look, see below); leave it out to keep your own `html` and `body`. With
`core.css` instead of `styles.css` (see "Component styles only"), the list is:
`tokens.css`, `core.css`, then the shell styles.

`tokens.css` defines every token the helix-ui components read, light on `:root,:host` and dark under `.app-dark`.
`styles.css` is the component CSS, in the cascade layer `components`, so your own CSS and Tailwind's utilities
win over it without specificity fights.

The shell's `styles.css` no longer sets rules on `html` and `body`. They moved to the opt-in
`@gravionlabs/helix-shell/globals.css` (14 px root font size, body font, colour and background); add it after
`styles.css` for the Helix page look, leave it out to keep the `rem` and the `body` of your own application.

### Component styles only

An app that does not use `helix-shell` and only needs everyday components can load `core.css` instead of
`styles.css`. Raw sizes, measured from `pnpm build:lib:css:ui`:

| File                                  | Raw size |                                                         |
| ------------------------------------- | -------- | ------------------------------------------------------- |
| `@gravionlabs/helix-ui/styles.css`    | 266.1 kB | all 60 components                                       |
| `@gravionlabs/helix-ui/core.css`      | 128.3 kB | 36 stylesheets, same `components` layer and layer order |
| `@gravionlabs/helix-ui/tokens.css`    | 129.0 kB | tokens of all components; load it with either           |
| `@gravionlabs/helix-shell/styles.css` | 47.1 kB  | shell layout and Tailwind utilities                     |
| `primeicons/primeicons.css`           | 19.0 kB  | icon font classes (`pi pi-*`)                           |

```json
[
  "node_modules/@fontsource-variable/inter/index.css",
  "node_modules/@gravionlabs/helix-ui/tokens.css",
  "node_modules/@gravionlabs/helix-ui/core.css"
]
```

Which components are in `core.css` and which are not: [HELIX-UI](HELIX-UI.md#component-only-css).

Provide the theme service to switch colours while the app runs ([details](HELIX-UI.md#theming)):

```ts
// app.config.ts
import { provideHxTheme } from '@gravionlabs/helix-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideHxTheme({ storageKey: 'my-app-theme' })],
};
```

## Dark mode

Tokens of `colorScheme.dark` are emitted under the dark selector: the class `app-dark` on `<html>`. `HxTheme`
sets it (`setDark`, `toggleDark`, and the system setting as the first value when nothing is remembered); the layout
store of `helix-shell` and its top-bar button go through it, with a view transition when `viewTransition` is on.
An attribute (`[data-theme="dark"]`) works too: pass it as `darkSelector` to `provideHxTheme`, and build the tokens
with it (`pnpm tokens:export --dark='[data-theme="dark"]'`).

Who matches what:

| Piece                                                                           | Dark when                                                                             |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `helix-ui` `tokens.css`                                                         | `.app-dark`, fixed when the file is built (the published file keys on the class only) |
| `helix-shell` `styles.css` (the `dark:` variant and the dark surface overrides) | `[class*="app-dark"]` or `[data-theme="dark"]`                                        |
| `HxTheme`                                                                       | writes `darkSelector` (class or attribute) to `<html>` unless `manageDark` is `false` |

So the shell follows either marker, but the published helix-ui tokens follow the class only: an app that marks dark
mode with `data-theme` alone needs `tokens.css` built with `--dark='[data-theme="dark"]'`, or must set the class too.

### An app that owns its dark mode

With `manageDark: false`, `HxTheme` never writes to `<html>`. `dark()` and `setDark()` still drive the colour
overrides, so the app sets the marker itself and tells the service:

```ts
// app.config.ts
import { provideHxTheme } from '@gravionlabs/helix-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideHxTheme({ manageDark: false, darkSelector: '.app-dark' })],
};
```

```ts
// app.component.ts: system setting first, an explicit choice (data-theme) wins
const theme = inject(HxTheme);
const media = matchMedia('(prefers-color-scheme: dark)');

const apply = () => {
  const choice = document.documentElement.dataset['theme']; // 'dark' | 'light' | undefined
  const dark = choice ? choice === 'dark' : media.matches;
  document.documentElement.classList.toggle('app-dark', dark); // what tokens.css reads
  theme.setDark(dark); // keep the colour overrides in step
};
apply();
media.addEventListener('change', apply);
```

```css
/* the app's own rules follow the same decision */
:root { color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { color-scheme: dark; } }
:root[data-theme="dark"] { color-scheme: dark; }
```

## Colours at runtime

`HxTheme` changes the primary colour (17 choices, including black and white) and the surface scale (8) with CSS
custom properties only, in one style sheet of its own that wins over `tokens.css` in light and dark. The roles
that depend on the colour (`--h-primary-color` is step 600 in light and 400 in dark) stay the tokens' own, so every
component follows.

## Overriding tokens in an application

Override a token with a custom property, after `tokens.css` or with a selector that is stronger. The override
reaches every component that refers to the token:

```css
/* styles.css of the app, loaded after tokens.css */
:root:root {
  --h-button-border-radius: 999px;
  --h-form-field-border-color: var(--h-surface-400);
}

/* only in dark mode */
:root:root.app-dark {
  --h-form-field-border-color: var(--h-surface-600);
}
```

### Mapping the roles to the app's own tokens

An app with its own design tokens can point the Helix roles at them instead of overriding component tokens one by
one. Load a stylesheet after `tokens.css` (or `core.css`) that sets the semantic roles; the components follow:

```css
/* helix-roles.css, loaded after @gravionlabs/helix-ui/tokens.css */
:root:root {
  --h-primary-color: var(--brand-600);
  --h-primary-contrast-color: var(--brand-on-600);
  --h-primary-hover-color: var(--brand-700);
  --h-text-color: var(--ink);
  --h-text-muted-color: var(--ink-soft);
  --h-content-background: var(--paper);
  --h-content-border-color: var(--line);
  --h-form-field-border-color: var(--line-strong);
}

/* the app's own dark rule */
:root:root.app-dark {
  --h-primary-color: var(--brand-400);
  --h-text-color: var(--ink-on-dark);
  --h-content-background: var(--paper-dark);
}
```

`:root:root` is stronger than the `:root` of `tokens.css`, so the file wins whatever the load order. Names are
those of the generated `tokens.css`; look them up there (`grep -- '--h-primary' node_modules/@gravionlabs/helix-ui/tokens.css`).

To make the change for everyone, edit the token itself in `projects/tokens` instead.

## Static tokens, outside Angular

`pnpm tokens:export` resolves the data and writes `dist/tokens/helix.css` (all `--h-*` variables, light and dark)
and `helix.json` (the same by colour scheme). With `--base` only the primitive, semantic and global layers are written
(~16 kB), enough for a page that is not built from Helix components, and `--dark=<selector>` picks the dark-scheme
selector. Helix is the only preset with token data. The documentation site is themed this way: `pnpm tokens:site`
writes `apps/site/.vitepress/theme/generated/helix.base.css` with `.dark` as selector, and
[`apps/site/.vitepress/theme/helix.css`](../apps/site/.vitepress/theme/helix.css) binds VitePress's `--vp-c-*`
variables to the `--h-*` ones, so site and components share one palette.

## The Design System

The tokens, the brand book and static previews of the components are generated as a Design System
(`pnpm design-system:build`); see [CONTRIBUTING-design-system](CONTRIBUTING-design-system.md).

## Where things are

|                                                                             |                                                                                                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Token data                                                                  | `projects/tokens`                                                                                                      |
| Resolver                                                                    | `scripts/tokens/resolve.mjs`; users: `scripts/export-tokens.mjs`, `scripts/build-ui-css.mjs`, `scripts/design-system/` |
| Runtime colour switching                                                    | `HxTheme` and `provideHxTheme` in `@gravionlabs/helix-ui` ([Theming](HELIX-UI.md#theming))                             |
| Shell layer (`--helix-surface-*`, layout sizes, fonts, Tailwind colour map) | `projects/shell/styles-src.css`, `projects/shell/styles/helix-tailwind`                                                |
| Configurator (primary / surface / menu mode)                                | `HelixConfigurator` in `@gravionlabs/helix-shell`                                                                      |

## Before helix-ui

Components of the former `helix-core` were themed by a runtime engine: `provideHelix({ theme: { preset } })`,
`definePreset`, `updatePreset`, `updatePrimaryPalette`, `updateSurfacePalette`, `$t` and `$dt`. That API went
away with the package ([ADR 0002](adr/0002-retire-helix-core.md)). The look is the same: the Helix preset is the
data of `projects/tokens`, the variables have the same names (`--h-*`), and `HxTheme` overrides them at runtime
(`provideHxTheme`, `setPrimary`, `setSurface`, `toggleDark`).
