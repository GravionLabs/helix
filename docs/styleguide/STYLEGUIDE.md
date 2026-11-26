# UX style guide

The base guide for apps on Helix ([ADR 0008](../adr/0008-ux-style-guide-a-helix-base-guide-that-app-guides-extend.md)).
Binding for every UI change. Read this whole file first; read a deep dive only when its condition applies.
A deviation needs a reason in the PR. Names are those of `@gravionlabs/helix-ui` unless said otherwise.

## Tokens

- Load `@gravionlabs/helix-ui/tokens.css`; it holds the values ([Theming](../THEMING.md)). This guide names roles.
- Colors, font sizes, spacing, radii and shadows are `var(--h-…)` tokens, never literals in app CSS.
- Spacing is a `--h-space-*` step, a radius a `--h-border-radius-*` step, an overlay shadow a `--h-overlay-*-shadow`.
- Change a look by overriding a token (`--h-*`), never the CSS of a Helix component.
- Light, dark and the primary color are set through `provideHxTheme` and `HxTheme`.

## Color

| Role                   | Token or carrier                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Background             | `--h-surface-frame`, `--h-surface-panel`, `--h-surface-card`, `--h-surface-overlay` |
| Hovered row or item    | `--h-surface-hover`                                                                 |
| Border                 | `--h-border-panel` around, `--h-border-divider` inside                              |
| Text, muted text       | `--h-text-color`, `--h-text-muted-color`                                            |
| Primary action, danger | `hx-button` (default severity), `severity="danger"`                                 |
| Focus                  | `--h-focus-ring-*`                                                                  |

- Text on a surface role is `--h-text-color` or `--h-text-muted-color` (at least 4.5:1 on each of them).
- A view or dialog has at most one filled primary `hx-button`; `danger` is for destructive actions, never for Cancel.
- The focus ring tokens mark focus only.
- A status is never color alone: an `hx-tag` has a text, an `hx-message` keeps its icon and a text.

## Typography and spacing

- UI text is `--helix-font-sans`, code `--helix-font-mono` (apps with the `helix-shell` stylesheet).
- Every `font-size` is a `--h-font-size-*` step; a screen uses at most four of them.
- Body text is `--h-font-size-sm` or larger; `--h-font-size-xs` is for secondary text such as row meta.
- Gaps, padding and margins are `--h-space-*` steps.
- Toolbar actions sit in [`hx-toolbar`](../components/toolbar.md), list rows are
  [`hx-list-row`](../components/list-row.md) in an `hx-list`. Their gap, padding and font size stay those of the
  `--h-toolbar-*` and `--h-list-row-*` tokens on every screen.
- A denser app sets the [density option](../THEMING.md#density) (`density: 'compact'`, `HxTheme.setDensity`) for the
  whole app; no screen shrinks its own text or padding.

## Components

- Use the [Helix component](../components/README.md) before you build one.
- No raw `<button>`, `<input>`, `<select>`, `<textarea>` or `<progress>` without its Helix directive or component.
- A text input, checkbox, radio, switch or `hx-select` of a form sits in an [`hx-field`](../components/form-field.md)
  with a `label`.
- Read [forms.md](forms.md) when you add or change a form.
- A modal decision is an [`hx-dialog`](../components/dialog.md) with its actions in `hxDialogFooter`.
- An icon-only `hx-button` (`iconOnly`) has an `aria-label` and an `hx-tooltip`.
- Hover, focus, active and disabled states are the component's; the app sets `disabled`, it draws no state itself.

## UX rules

- A started action disables its control at once (`[disabled]`, or `[loading]` on `hx-button`); from 1 s it shows
  `[loading]` or an `hx-progress-spinner`, from 3 s named steps or an `hx-progress-bar`.
- An irreversible action asks through `HxConfirmationService`; a reversible one runs and offers Undo in an `hx-toast`.
- Every data view has an empty state that names the next action, a loading state (`hx-skeleton`, or `loading` of
  `hx-data-table`) and an error state (`hx-message severity="error"` with a retry `hx-button`).
- Texts of `hx-button`, `hx-field` and `hx-message` are in sentence case, without "please", "simply" or "just".
- Read [ux-rules.md](ux-rules.md) when you add or change a flow, a dialog, a tooltip, a message, an empty or error
  state, or an animation.

## Cross-platform

- Targets: desktop (macOS, Windows, Linux), mobile and web. A desktop app picks `hx-app-shell` or `hx-mobile-shell`
  by [`getHxPlatform()`](../HELIX-DESKTOP.md#hxmobileshell-and-hxbottombar), never by window width.
- Every action is a native control (`hx-button`, `[hx-list-row]`, an `hx-menu` item), so it works from the keyboard.
- A shown shortcut is implemented: `hxTooltipShortcut` or [`hx-kbd`](../components/kbd.md) with the keys of the
  user's platform, and `aria-keyshortcuts` on the control.

## Enforcement

- [`@gravionlabs/helix-lint`](../LINT.md) blocks in CI: Stylelint (no hex, no raw color functions, font sizes from
  the scale) and the template rule `helix/no-raw-control`.
- Every exception is a `helixAllow` entry with a reason.
- What lint cannot check is reviewed; a review finding blocks only when an acceptance criterion names it.

## How app guides extend this guide

- An app has its own `docs/STYLEGUIDE.md`, linked from its `AGENTS.md`.
- It names this guide as its base: `node_modules/@gravionlabs/helix-ui/styleguide/STYLEGUIDE.md`.
- It lists only the app's own rules and deviations, each deviation with a reason. It copies no base rule.
- It may tighten a base rule freely; it relaxes one only as a named deviation.

## When this guide is silent

1. Follow the nearest existing component or screen that solves the same problem.
2. If none exists, choose the simplest option made of Helix components and tokens only.
3. Write the choice and the reason in the PR. If it will recur, file a Helix issue: a rule needs a carrier here.
