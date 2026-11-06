# Tab bar

`hx-tab-bar` is an editor-style tab strip: tabs that the user closes, reorders, moves between bars and scrolls. It has no panels, the app renders the content of the active tab itself.

```html
<hx-tab-bar
  ariaLabel="Open files"
  groupId="left"
  allTabsButton
  [tabs]="tabs()"
  [(value)]="active"
  [menu]="menu"
  (closed)="close($event)"
  (moved)="move($event)"
  (received)="receive($event)"
  (menuAction)="run($event)"
>
  <ng-template #tabContent let-tab><span class="mode-badge">{{ tab.id }}</span></ng-template>
  <button hx-button>New</button>
</hx-tab-bar>
```

## hx-tab-bar or hx-tabs

|              | `hx-tabs`                             | `hx-tab-bar`                                            |
| ------------ | ------------------------------------- | ------------------------------------------------------- |
| Tabs         | a fixed set, declared in the template | dynamic, from a `tabs` array                            |
| Content      | `hx-tab-panel`s, linked to the tabs   | none: the app renders it                                |
| User changes | picks the active tab                  | also closes, pins, reorders and moves tabs between bars |
| Pattern      | WAI-ARIA tabs with panels             | `tablist` and `tab` without panels                      |

Use `hx-tabs` for a page or card split into a few sections; use `hx-tab-bar` for documents, terminals or views that come and go.

## Inputs and outputs

| Input           | Type                 | Default | Description                                                                  |
| --------------- | -------------------- | ------- | ---------------------------------------------------------------------------- |
| `tabs`          | `HxTabBarItem[]`     | -       | Required. The tabs, in order.                                                |
| `value`         | `string \| null`     | `null`  | `[(value)]`: the `id` of the active tab.                                     |
| `ariaLabel`     | `string`             | -       | Accessible name of the tab strip.                                            |
| `groupId`       | `string`             | `''`    | Identifies the bar when a tab is dragged between bars.                       |
| `menu`          | `HxTabBarMenuItem[]` | `[]`    | Entries of the context menu; none disables it.                               |
| `allTabsButton` | `boolean`            | `false` | While the tabs overflow, a button at the right end opens a menu of all tabs. |

| Output        | Payload                                       | Description                                                          |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `valueChange` | `string`                                      | A tab was chosen (`[(value)]`).                                      |
| `closed`      | `string`                                      | The close button, a middle click, Delete or Ctrl+W on a tab: its id. |
| `pinned`      | `string`                                      | Double click on a tab: its id.                                       |
| `moved`       | `{ from: number; to: number }`                | A tab was dropped on another tab of the same bar.                    |
| `received`    | `{ from: string; id: string; index: number }` | A tab of the bar with `groupId` `from` was dropped here at `index`.  |
| `menuAction`  | `{ id: string; action: string }`              | A context menu entry was chosen for the tab `id`.                    |

The bar reports, the app changes `tabs`: remove the tab on `closed`, reorder on `moved`, take the tab over on `received` (and remove it from the other bar).

`HxTabBarItem`: `id`, `label`, and optional `group` (shown in capitals before the label), `title` (tooltip, the label by default), `preview` (italic), `attention` (rings the tab) and `unread` (a dot).

`HxTabBarMenuItem`: `action`, `label`, and optional `shortcut` (shown next to the label), `disabled` and `appliesTo(tabId)` (the entry is offered only for tabs where it returns `true`).

**Content:** `<ng-template #tabContent let-tab>` renders extra content (a mode badge, an icon) before the label of every tab; projected content sits at the right end of the bar.

## Overflow

When the tabs are wider than the bar, the strip scrolls:

- buttons at both ends scroll it, only while it overflows: the same scroller and tokens as `hx-tabs` with `scrollable`;
- the vertical mouse wheel scrolls it sideways;
- with `allTabsButton`, a button opens an `hx-menu` of every tab (label, with `!` for a tab that needs attention) and activates the chosen one;
- the active tab is scrolled into view when it changes or the tabs change.

Drag and drop works while the strip is scrolled and between two bars.

## Keyboard and accessibility

- `role="tablist"` (named by `ariaLabel`) with `role="tab"` and `aria-selected`; there are no panels, so no `aria-controls`.
- Roving tabindex: Tab enters the strip at the active tab; Left and Right (wrapping), Home and End move to a tab and select it; Enter and Space select.
- Delete or Ctrl+W close the focused tab and move the focus to its neighbour.
- The Menu key or Shift+F10 open the context menu of the focused tab (the same `hx-menu` as the right click); Escape closes it and returns the focus to the tab.
- The tab name includes the group, and `, needs attention` for a tab with `attention`. The close button is named `Close <group> / <label>`. The scroll buttons are for the pointer and no tab stops.

## From poimen's `app-tab-bar`

| `app-tab-bar`                                                                                                   | `hx-tab-bar`                                        |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `[activeId]`                                                                                                    | `[(value)]` (replaces `(selected)`)                 |
| `(selected)`                                                                                                    | `(valueChange)`                                     |
| `[tabs]`, `(closed)`, `(pinned)`, `(moved)`, `[groupId]`, `(received)`, `[menu]`, `(menuAction)`, `#tabContent` | unchanged                                           |
| `TabBarItem`, `TabBarMenuItem`                                                                                  | `HxTabBarItem`, `HxTabBarMenuItem`                  |
| (none)                                                                                                          | `ariaLabel`, `allTabsButton`, the overflow features |

## Tokens

The look comes from `--h-tabbar-*` (see [Theming](../HELIX-UI.md#theming)), among them `--h-tabbar-tab-active-background` for the active tab and `--h-tabbar-background` for the strip; the scroll buttons read `--h-tabs-nav-button-*`. Override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
