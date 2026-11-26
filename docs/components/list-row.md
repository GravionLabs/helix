# List row

`hx-list` with `[hx-list-row]` is a list of rows for sidebars, search results, outlines and pickers. The rows are
native `button`s and `a`s, so activation and link behaviour stay native; the list adds the keyboard and the states.

```html
<hx-list aria-label="Branches">
  <button hx-list-row type="button" [selected]="branch() === 'main'" (click)="branch.set('main')">
    <span class="hx-list-row-icon pi pi-share-alt" aria-hidden="true"></span>
    <span class="hx-list-row-label">main</span>
    <span class="hx-list-row-meta">2 h ago</span>
  </button>
</hx-list>

<nav aria-label="Settings">
  <hx-list>
    <a hx-list-row routerLink="/account" routerLinkActive #account="routerLinkActive"
       [current]="account.isActive ? 'page' : false">
      <span class="hx-list-row-label">Account</span>
    </a>
  </hx-list>
</nav>

<hx-list role="listbox" aria-label="Results">
  @for (hit of hits(); track hit.id) {
    <button hx-list-row type="button" [selected]="hit.id === chosen()" (click)="chosen.set(hit.id)">
      <span class="hx-list-row-label">{{ hit.title }}</span>
      <hx-badge class="hx-list-row-meta" [value]="hit.count" />
    </button>
  }
</hx-list>
```

For a form control with a value and options use [Listbox](listbox.md); for a popup of commands use [Menu](menu.md).

## `hx-list`

| Input  | Type                  | Default  | Description                                                        |
| ------ | --------------------- | -------- | ------------------------------------------------------------------ |
| `role` | `'list' \| 'listbox'` | `'list'` | A list of buttons and links, or a listbox of options. No tree yet. |

## `[hx-list-row]`

On a `button` or an `a`. Give a button `type="button"` so it does not submit a form.

| Input      | Type                                                            | Default | Description                  |
| ---------- | --------------------------------------------------------------- | ------- | ---------------------------- |
| `selected` | `boolean \| undefined`                                          |         | The row is selected.         |
| `current`  | `boolean \| 'page' \| 'step' \| 'location' \| 'date' \| 'time'` | `false` | The row is the current item. |

The list does not change `selected` or `current`: the app sets them, e.g. in the row's `(click)`.

## Content

| Class                | Slot                                                      |
| -------------------- | --------------------------------------------------------- |
| `.hx-list-row-icon`  | Leading icon (`aria-hidden="true"` when it is decoration) |
| `.hx-list-row-label` | The label; it truncates with an ellipsis                  |
| `.hx-list-row-meta`  | Trailing text or [badge](badge.md)                        |

A row is one button or link: put no other buttons, links or fields inside it.

## Keyboard

| Key                   | Action                                                  |
| --------------------- | ------------------------------------------------------- |
| Tab / Shift+Tab       | Enters and leaves the list; the list is one tab stop.   |
| Arrow Down / Arrow Up | Moves to the next or previous row; no wrapping.         |
| Home / End            | Moves to the first or last row.                         |
| Enter / Space         | Activates the row (a link: Enter), as the element does. |

The tab stop is the row focused last; before that the current row, else the selected row, else the first one.
Rows that are `disabled`, `aria-disabled="true"` or `hidden` are skipped. For a disabled link, remove its `href` or
`routerLink` too: `aria-disabled` does not stop a click.

## Accessibility

- Name the list with `aria-label` or `aria-labelledby`.
- `role="list"` renders a `group` around the native buttons and links (an ARIA `list` would need `listitem`
  children in place of the rows' own roles). A button with `selected` bound is a toggle button (`aria-pressed`);
  without it, a plain button. A link cannot be pressed: a selected link gets `aria-current="true"`.
- `role="listbox"` makes every row an `option` with `aria-selected`.
- `current` sets `aria-current`.

## Tokens

`--h-list-row-*`: gap, padding, radius, font size, background and colour, `icon-color`, `meta-*`, `hover-*`,
`current-*` (background, colour, weight, indicator bar), `selected-*`, `focus-ring-*`, `disabled-opacity` and
`list-gap`. Backgrounds come from the surface roles of
[ADR 0004](../adr/0004-surface-roles-dark-elevation-density-and-named-theme-presets.md) and the highlight tokens;
sizes are type scale and spacing tokens, so the compact density scales the rows. See
[Theming](../HELIX-UI.md#theming); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
