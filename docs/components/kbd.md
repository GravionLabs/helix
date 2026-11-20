# Kbd

`<hx-kbd>` shows a keyboard shortcut as key caps, one `<kbd>` per key. Use it in menus, palettes, buttons and, through
`hxTooltipShortcut`, in tooltips, so every shortcut of an app looks the same.

```html
<hx-kbd [keys]="['Ctrl', 'Shift', 'P']" />
<hx-kbd [keys]="['⌘', 'K']" size="sm" separator="none" />
```

| Input       | Type                | Default                            | Description                                         |
| ----------- | ------------------- | ---------------------------------- | --------------------------------------------------- |
| `keys`      | `string[]`          | `[]`                               | The labels, one cap each, in order.                 |
| `size`      | `'md' \| 'sm'`      | `'md'`                             | `sm` fits dense rows and menus.                     |
| `separator` | `'+' \| 'none'`     | platform: `'none'` on macOS, `'+'` | `'+'` joins the caps, `'none'` puts them side by side. |

The component does not translate or rename keys. The app passes the labels for the platform of the user (`'⌘'` on
macOS, `'Ctrl'` on Windows and Linux) and, if it wants, in the language of the user.

## In a tooltip

`hxTooltipShortcut` on `[hx-tooltip]` takes the keys as an array and shows them after the text, in small caps.

```html
<button hx-button iconOnly aria-label="Search" hx-tooltip="Search" [hxTooltipShortcut]="['Ctrl', 'K']" aria-keyshortcuts="Control+K">…</button>
```

## Accessibility

The caps are real text, so a screen reader reads the shortcut (in a tooltip it is part of the element that
`aria-describedby` points to). The `+` between caps is decorative and hidden from assistive technology.

`hx-kbd` only displays a shortcut. Announcing it on the control that runs it is the job of the caller: set
`aria-keyshortcuts` (for example `aria-keyshortcuts="Control+Shift+P"`) on that element, with the key names of the
[ARIA specification](https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts).

Contrast: the text of a cap has at least 4.5:1 and its border at least 3:1 against the cap, in the light and the dark
theme and inside a tooltip (checked by a token test).

## Tokens

The look comes from the design tokens `--h-kbd-*` (`--h-kbd-tooltip-*` inside a tooltip; see
[Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
