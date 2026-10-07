# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine and no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the
vendored PrimeNG fork ([ADR 0001](adr/0001-styling-foundation.md)); components move over group by group,
starting with the ones `helix-shell` and `helix-zod` use.

::: warning Not published yet
The package builds and is tested in this repository (`projects/ui`), but is not on npm: the first release
needs a trusted-publisher entry for `@gravionlabs/helix-ui`. Until then it is used from source (path mapping
`@gravionlabs/helix-ui`) as in the demo.
:::

## Install and styles

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components, in the `components` cascade layer */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens, only when the app does not run the helix-core theme engine (provideHelix) */
@import "@gravionlabs/helix-ui/tokens.css";
```

- `styles.css` states the layer order Tailwind uses (`theme, base, components, utilities`) and puts the
  component CSS in `components`: an app's unlayered CSS and Tailwind's utilities win over it.
- `tokens.css` is `helixPreset` resolved by the engine of helix-core at build time: light on `:root`, dark
  under the `app-dark` class, every token the components read. An app that already calls `provideHelix`
  has the same variables and does not need it.
- Selectors and classes use the prefix `hx` (`hx-button`); helix-core owns `h-`. Both read the same `--h-*`
  tokens, so a page mixes them without a visible seam.

## Button

`button[hxButton]` and `a[hxButton]`: a native element styled as a Helix button. The label is the content;
an icon is an inline `<svg>` (or an element with the class `hx-button-icon`) next to it.

```html
<button hxButton (click)="save()">Save</button>
<button hxButton severity="success" variant="outlined" size="large">Publish</button>
<button hxButton [loading]="saving()" (click)="save()">Save</button>
<button hxButton iconOnly rounded aria-label="Add"><svg viewBox="0 0 24 24" …/></button>
<a hxButton variant="link" href="/docs">Docs</a>
```

| Input      | Type                                                                                       | Default     | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------ |
| `variant`  | `'filled' \| 'outlined' \| 'text' \| 'link'`                                               | `'filled'`  | How loud the button is.                                                        |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` | `'primary'` | What it means; every severity works with every variant.                        |
| `size`     | `'small' \| 'medium' \| 'large'`                                                           | `'medium'`  | Font size and padding from the `--h-button-sm-*` / `-lg-*` tokens.             |
| `rounded`  | `boolean`                                                                                  | `false`     | A pill; a circle for an icon-only button.                                      |
| `raised`   | `boolean`                                                                                  | `false`     | Adds the elevation shadow.                                                     |
| `fluid`    | `boolean`                                                                                  | `false`     | Takes the full width of its container.                                         |
| `iconOnly` | `boolean`                                                                                  | `false`     | Square button for one icon. **Give it `aria-label`.**                          |
| `loading`  | `boolean`                                                                                  | `false`     | Spinner in front of the label, `aria-busy="true"`, clicks are ignored; the button stays focusable. |

Behaviour:

- A **disabled** button is the native `disabled` attribute; an **anchor** is disabled with
  `aria-disabled="true"`, which the directive honours by ignoring clicks.
- While `loading` the button is *not* `disabled`: focus is not lost when an operation starts, and screen
  readers hear the busy state.
- Colours, radius, padding and the focus ring come from the `--h-button-*` tokens of the preset, in light and
  dark; override a token in your own preset, not the CSS.

## Rules of the package

- Nothing in `projects/ui` imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- A test fails when a stylesheet reads a `--h-*` token that `tokens.css` does not define, or when the
  directive sets a class the stylesheet does not style.
- Every component has unit tests and a page here and in the demo (Helix UI Button).
