# Menubar

`hx-menubar` is a horizontal menu of [`HxMenuItem`s](../HELIX-UI.md#menu-item-model) with dropdown submenus, on the CDK menubar.

```html
<hx-menubar ariaLabel="Main" [model]="items">
  <a hxMenubarStart routerLink="/">Helix</a>
  <button hxMenubarEnd hx-button>Sign in</button>
</hx-menubar>
```

| Input / output | Type           | Default  | Description                                                           |
| -------------- | -------------- | -------- | --------------------------------------------------------------------- |
| `model`        | `HxMenuItem[]` | `[]`     | The entries; an entry with `items` opens a submenu.                   |
| `breakpoint`   | `number`       | `960`    | Width in px below which the items collapse into a button.             |
| `ariaLabel`    | `string`       |          | Name of the menubar.                                                  |
| `buttonLabel`  | `string`       | `'Menu'` | Name of the button shown when collapsed.                              |
| `(triggered)`  | `HxMenuItem`   |          | An item was activated (after its `command`).                          |

Content marked `hxMenubarStart` or `hxMenubarEnd` is placed before and after the items.

- **Collapsed:** below `breakpoint` the bar shows the start and end content and a button; the button opens the items as
  an [`hx-menu`](menu.md) popup (group headings and nested submenus as there).
- **Keyboard:** Left and Right move between the top items, Down or Enter opens a submenu and moves into it, Escape
  closes it and returns to the item, typing jumps by label.
- **Accessibility:** `role="menubar"` with `menuitem`s; items with a submenu have `aria-haspopup="menu"` and
  `aria-expanded`. Name icon-only items with `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-menubar-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
