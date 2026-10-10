# Tooltip

`[hx-tooltip]` shows a short text next to an element on hover and keyboard focus. It is a CDK overlay with
`role="tooltip"`, the host gets `aria-describedby` while it is open, and Escape or a click closes it. Use it for
hints, for example the name of an icon-only button, never for essential information.

```html
<button hx-button iconOnly aria-label="Add" hx-tooltip="Add item" hxTooltipPosition="right">+</button>
```

| Input                  | Type                                       | Default  | Description                                 |
| ---------------------- | ------------------------------------------ | -------- | ------------------------------------------- |
| `hx-tooltip`           | `string \| null`                           |          | The text; empty shows nothing.              |
| `hxTooltipPosition`    | `'top' \| 'right' \| 'bottom' \| 'left'`    | `'top'`  | Preferred side; it flips when it does not fit. |
| `hxTooltipEvent`       | `'hover' \| 'focus' \| 'both'`             | `'both'` | What opens it.                              |
| `hxTooltipDisabled`    | `boolean`                                  | `false`  | Never shows.                                |
| `hxTooltipShowDelay`   | `number`                                   | `0`      | Milliseconds before it appears.             |

## Tokens

The look comes from the design tokens `--h-tooltip-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
