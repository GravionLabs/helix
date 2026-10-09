# Menu

`hx-menu` shows a list of [`HxMenuItem`s](../HELIX-UI.md#menu-item-model), inline or as a popup, with nested submenus. It is built on
`@angular/cdk/menu`.

```html
<button hx-button aria-haspopup="menu" (click)="menu.toggle($event)">Actions</button>
<hx-menu #menu popup ariaLabel="Actions" [model]="items" (triggered)="onPick($event)" />

<hx-menu [model]="items" ariaLabel="Account" />
```

| Input / output | Type                  | Default | Description                                                         |
| -------------- | --------------------- | ------- | ------------------------------------------------------------------- |
| `model`        | `HxMenuItem[]`        | `[]`    | The entries: label, icon, `routerLink`, `url`, `command`, `disabled`, `separator`, `badge`, `items`. |
| `popup`        | `boolean`             | `false` | Open in an overlay with `toggle(event)` / `show(event)`; otherwise inline. |
| `ariaLabel`    | `string`              |         | Name of the menu.                                                   |
| `(triggered)`  | `HxMenuItem`          |         | An item was activated (after its `command`).                        |

`toggle(event)`, `show(event)` and `hide()` control a popup; it opens at the element of the event.

- **Items:** an item at the first level that has `items` and no action of its own is a group heading above its
  children; deeper levels open as submenus. A disabled item runs nothing; a hidden one (`visible: false`) is left out.
- **Keyboard:** Arrow Down/Up and Home/End move, typing jumps by label, Right or Enter opens a submenu and Left closes
  it, Enter or Space activates, Escape closes the menu and returns the focus to the element that opened it.
- **Accessibility:** the WAI-ARIA menu from the CDK: `role="menu"`, `menuitem`, `separator`, `group`; submenu items
  have `aria-haspopup="menu"` and `aria-expanded`. Put `aria-haspopup="menu"` on the button that opens a popup, and
  name an icon-only item with `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-menu-*`, `--h-tieredmenu-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
