# Tooltip

`[hx-tooltip]` shows a short text next to an element on hover and keyboard focus. It is a CDK overlay with
`role="tooltip"`, the host gets `aria-describedby` while it is open, and Escape or a click closes it. Use it for
hints, for example the name of an icon-only button, never for essential information.

```html
<button hx-button iconOnly aria-label="Add" hx-tooltip="Add item" hxTooltipPosition="right">+</button>
```

| Input                    | Type                                     | Default  | Description                                    |
| ------------------------ | ---------------------------------------- | -------- | ---------------------------------------------- |
| `hx-tooltip`             | `string \| null`                         |          | The text; empty shows nothing.                 |
| `hxTooltipPosition`      | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`  | Preferred side; it flips when it does not fit. |
| `hxTooltipEvent`         | `'hover' \| 'focus' \| 'both'`           | `'both'` | What opens it.                                 |
| `hxTooltipDisabled`      | `boolean`                                | `false`  | Never shows.                                   |
| `hxTooltipShowDelay`     | `number`                                 | `0`      | Milliseconds before it appears.                |
| `hxTooltipShortcut`      | `string[]`                               |          | A shortcut shown as key caps after the text.   |
| `hxTooltipWhenTruncated` | `boolean`                                | `false`  | Opens only while the host text is cut off.     |

## Shortcut

`hxTooltipShortcut` shows a keyboard shortcut as small [key caps](kbd.md) after the text. The keys are not translated:
pass the labels for the platform. The caps are text inside the tooltip, so a screen reader reads them. Set
`aria-keyshortcuts` on the host yourself.

```html
<button hx-button hx-tooltip="Save" [hxTooltipShortcut]="['Ctrl', 'S']" aria-keyshortcuts="Control+S">Save</button>
```

## Only when the text is cut off

A tooltip that repeats a fully visible label is noise. With `hxTooltipWhenTruncated` the tooltip opens only while the
host text is cut off by an ellipsis, for example file names, tab labels and sidebar rows. The host is measured
(`scrollWidth > clientWidth`) when the tooltip is about to open, after the show delay, not on every resize. The host
needs `overflow: hidden` and `text-overflow: ellipsis` (or `truncate`) for this to mean anything.

```html
<span class="truncate" [hx-tooltip]="file.name" hxTooltipWhenTruncated>{{ file.name }}</span>
```

## Tokens

The look comes from the design tokens `--h-tooltip-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
