# Color

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you set a color in app CSS, show a status, or pick the
`severity` of a control. It names color roles; the values are in [Theming](../THEMING.md), the roles in
[ADR 0004](../adr/0004-surface-roles-dark-elevation-density-and-named-theme-presets.md). The rules are for app CSS and
templates: a Helix component colors itself.

## Surfaces and their foregrounds

A background and the text on it are picked together, from one row. App CSS that sets a background of this table also
sets, or inherits, the foreground of the same row.

| Role                           | Background                                             | Foreground                                  |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------- |
| Chrome: ground behind panels   | `--h-surface-frame`                                    | `--h-text-color`, `--h-text-muted-color`    |
| Content: panel or page         | `--h-content-background` (`--h-surface-panel`)         | `--h-content-color`, `--h-text-muted-color` |
| Content: card, table head      | `--h-surface-card`                                     | `--h-text-color`, `--h-text-muted-color`    |
| Hovered row or item            | `--h-content-hover-background` (`--h-surface-hover`)   | `--h-content-hover-color`                   |
| Overlay: dialog                | `--h-overlay-modal-background` (`--h-surface-overlay`) | `--h-overlay-modal-color`                   |
| Overlay: popover               | `--h-overlay-popover-background`                       | `--h-overlay-popover-color`                 |
| Overlay: list of a select      | `--h-overlay-select-background`                        | `--h-overlay-select-color`                  |
| Selected item of an app's list | `--h-highlight-background`                             | `--h-highlight-color`                       |

- Text and muted text keep at least 4.5:1 on `frame`, `panel`, `card`, `overlay` and `hover`.
- An overlay is an [`hx-dialog`](../components/dialog.md), [`hx-popover`](../components/popover.md) or
  [`hx-menu`](../components/menu.md), which paint their own row. The app sets overlay tokens only on content it puts
  into an overlay of its own.
- A row of [`hx-list`](../components/list-row.md) or a table paints its own hover and selection.
- A line around a panel or card is `--h-border-panel` (`--h-content-border-color`), a line inside one
  `--h-border-divider`.
- App CSS reads a role, not a scale step: no `--h-surface-0` to `--h-surface-950`. A step does not follow the role
  in the other color scheme.
- New app CSS reads the `--h-*` names above. The `--helix-surface-*`, `--helix-border` and `--surface-*`
  [aliases](../THEMING.md#surface-roles) of `helix-shell` are for existing CSS.
- `--h-mask-*` belongs to the mask of `hx-dialog` and `hx-drawer`; app CSS does not read it.

```css
.summary {
  background: var(--h-surface-card);
  color: var(--h-text-color);
  border: 1px solid var(--h-border-panel);
}

.summary-meta {
  color: var(--h-text-muted-color);
}
```

## Primary

- Primary marks the one affirmative action of a view or dialog: at most one filled
  [`hx-button`](../components/button.md) with the default `severity`. Every other action follows the
  [button hierarchy](components.md#button-hierarchy).
- In app CSS, `--h-primary-color` colors the text of a link and nothing else: no background, border, heading, icon or
  decoration of the app reads a `--h-primary-*` token.
- `--h-primary-contrast-color` is the foreground of a primary fill, which the component paints.
- The primary color is changed with `provideHxTheme` or `HxTheme.setPrimary`, never by CSS on a component.

## Focus

- The `--h-focus-ring-*` tokens appear only in `:focus-visible` rules: not on hover, selection, errors or highlights.
- Helix components draw their own focus. An element the app makes focusable draws it with all the tokens, and no
  app rule removes an outline without this replacement.

```css
.canvas:focus-visible {
  outline: var(--h-focus-ring-width) var(--h-focus-ring-style) var(--h-focus-ring-color);
  outline-offset: var(--h-focus-ring-offset);
  box-shadow: var(--h-focus-ring-shadow);
}
```

## Danger

- `danger` is for an action that destroys or loses data: `severity="danger"` on `hx-button`, `acceptSeverity: 'danger'`
  in [`HxConfirmationService`](../components/confirm.md).
- Cancel, close and dismiss are never `danger`: they are `severity="secondary"`. The reject button of
  `HxConfirmationService` already is.

## Status

A status is never color alone. It is shown by a Helix component, with its text or icon:

| Status shown as           | Carrier                                                  | Next to the color                                       |
| ------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| Label of an item          | [`hx-tag`](../components/tag.md) with `severity`         | `value` or content text; `icon` is optional             |
| Message next to its cause | [`hx-message`](../components/message.md) with `severity` | its icon (built in, or `icon`) and a text               |
| Passing result            | [`hx-toast`](../components/toast.md), `HxMessageService` | its built-in icon and a `summary` or `detail`           |
| Count                     | [`hx-badge`](../components/badge.md) with `value`        | the value, and what it counts in the name or text by it |
| Dot                       | `hx-badge` without `value`                               | the status as text next to it or in the element's name  |

- A destructive or failed state is `severity="danger"` on `hx-tag` and `hx-badge`, `severity="error"` on
  `hx-message` and toasts.
- The status severities (`success`, `info`, `warn`, `danger`, `error`) report a state. They rank no action
  ([button hierarchy](components.md#button-hierarchy)).
- App CSS reads no palette step (`--h-red-*`, `--h-green-*`, `--h-orange-*`, `--h-sky-*` and the other hues) to show
  a status.

## Literals and tints

- App CSS has no hex color and no `rgb()`, `rgba()`, `hsl()` or `hsla()`. The Stylelint config of
  [`@gravionlabs/helix-lint`](../LINT.md) blocks them (`color-no-hex`, `function-disallowed-list`); an exception is a
  `helixAllow` entry with a reason.
- A color in app CSS is a `var(--h-…)` token, `transparent`, `currentColor`, `inherit`, or a `color-mix()` of these.
- A tint or shade is a `color-mix()` on a token, mixed with `transparent` or another token. It follows the primary
  color and the color scheme; a second literal does not.
- Text on a tint is `--h-text-color`, and keeps at least 4.5:1 on it in light and dark.

```css
.skipped-row {
  background: color-mix(in srgb, var(--h-text-muted-color), transparent 90%);
  color: var(--h-text-color);
}
```

## Not carried yet

These have no Helix carrier and are therefore no rule yet:

- A status color for markup the app draws itself: there is no semantic status token.
- A lint check for named colors, other color functions (`hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`),
  literals inside `color-mix()`, and styles in `.ts` or `.html` files. Review covers them.
