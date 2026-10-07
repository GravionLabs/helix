# Helix

Angular UI components (a maintained fork of PrimeNG 21.1.9), an application shell with a navigation rail and layout store, dynamic forms from Zod schemas, and AG Grid helpers, by Gravion Labs. The look is quiet and neutral: zinc surfaces, one muted indigo for action, colour reserved for meaning.

Source: https://github.com/GravionLabs/helix · docs: https://gravionlabs.github.io/helix/ · live demo: https://gravionlabs.github.io/helix/demo/

This system is generated from the repository (`pnpm design-system:build`, see `docs/CONTRIBUTING-design-system.md`); the tokens are those of `helixPreset` (`@gravionlabs/helix-core/themes/helix`, ADR 0001). Change them there, not here.

## Content fundamentals

What the demo and the docs show, in the order you meet it:

- **Buttons are short verbs**: Submit, Save, Cancel, Delete, Search. Two words at most; the primary action is last in a group.
- **Labels are nouns** in sentence case ("Username", "Float label"); navigation entries are the component or page name in Title Case ("Form Layout", "Dynamic Form").
- **Messages say what happened**, plainly ("Username is required"), without exclamation marks, apology or blame.
- **Numbers and money are written as data** ("152", "$2.100", "%52+ since last week"): the demo keeps the sample data's own formatting.
- **Code is code**: component and package names in monospace, always with their full import path on first use.

## Visual foundations

**Colour.** Neutrals are the **zinc** scale in both themes (`surface-0` … `surface-950`). The one brand hue is **indigo**, muted: Helix uses Tailwind's scales with their OKLCH chroma reduced to 55 % at unchanged lightness, so contrast ratios are those of the original and the colours are quieter. `primary` is `primary-600` on light, `primary-400` on dark; `primary-contrast` is the text on a primary fill.
Colour means something: `success`, `info`, `warn`, `help` and `danger` (muted green, sky, orange, purple, red) are for status, never for decoration. Hover and pressed states step along the scale (`primary-hover`, `primary-active`).

**Surfaces.** Page ground is a light neutral (`surface-100`; `surface-950` in dark); cards and fields sit on `content-bg` (`surface-0`; `surface-900`) with a hairline `content-border`. Overlays use the `shadow-*` tokens; nothing else casts a shadow at rest.

**Type.** **Inter** for text and headings (headings 700, tracking −0.02em), self-hosted (Open Font License), and the system monospace (`ui-monospace`, SF Mono, Menlo, Consolas) for code: the same look as the other Gravion Labs sites. One family keeps the page calm; `--helix-font-display` exists so an application can still give headings another face. The application root is **14px**; headings step 14 → 35px (`h1`) in the Display styles. Body text is `text` on `content-bg`, secondary text `text-muted` (≥ 4.5:1 on cards in both themes).

**Shape and space.** One radius does most of the work: **6px** (`radius-md`) on buttons, fields, cards; 12px (`radius-xl`) on modal dialogs; pills only for `rounded` buttons and badges. Fields and buttons are padded `field-padding-x` × `field-padding-y` (10.5 × 7px); lists gap 2px; the shell's cards are `layout-gap` (21px) apart.

**Focus and state.** Focus is a 1px solid `primary` ring with a 2px offset (inputs swap their border for `field-border-focus`); disabled controls fade to 60 % opacity; transitions are 0.2s.

**Dark mode.** The same tokens under the `app-dark` class: `surface-950` ground, `surface-900` cards, `primary-400` for action with `surface-950` text on it, severity fills one step lighter. Nothing is inverted by hand; a block that would vanish on the ground takes another token.

## Iconography

Icons come from the **PrimeIcons** font (MIT; `pi pi-home`, …), 1rem by default, inheriting the text colour; `HelixIcons` names them. The Helix mark (`assets/Logos`) is the double helix of the shell's navigation rail, drawn in `primary`; it is a single-ink glyph, so use the light file on light grounds and the dark file on dark ones.

## Using it

- In an Angular app: `provideHelix({ theme: { preset: helixPreset, options: { darkModeSelector: '.app-dark' } } })`, the `@fontsource-variable/inter` stylesheet and `@gravionlabs/helix-shell/styles.css` (docs: Theming).
- Outside Angular: `pnpm tokens:export` writes the same tokens as CSS and JSON (`dist/tokens`).
- The component previews here are static renditions of the real markup and CSS; the components themselves are Angular, so there is no runtime bundle.

## Not synced

Twelve of the library's 90 components have previews (Button, InputText, Textarea, Checkbox, RadioButton, ToggleSwitch, Tag, Badge, Message, Card, Divider, ProgressBar); the shell's chrome (topbar, nav rail, status bar) and the table, overlay and menu families are not rendered yet. Icons are not mirrored (the PrimeIcons font is not redistributed here).
