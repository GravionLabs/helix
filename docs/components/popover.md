# Popover

`hx-popover` is a small panel anchored to an element, with arbitrary content and an arrow pointing at the element.

```html
<button hx-button aria-haspopup="dialog" (click)="op.toggle($event)">Share</button>
<hx-popover #op ariaLabel="Share this page">
  <input hx-input aria-label="Link" value="https://…" />
</hx-popover>
```

| Input / output    | Type      | Default | Description                                         |
| ----------------- | --------- | ------- | --------------------------------------------------- |
| `ariaLabel`, `ariaLabelledBy` | `string` |   | Name of the popover.                                |
| `dismissable`     | `boolean` | `true`  | A click outside closes it.                          |
| `closeOnEscape`   | `boolean` | `true`  | Escape closes it.                                   |
| `(shown)`, `(hidden)` | `void` |         | Opened, closed.                                     |

`toggle(event, target?)`, `show(event, target?)` and `hide()` control it; it opens below the element of the event (or
`target`) and above it when there is no room, the arrow follows. `open` is a signal.

- **Accessibility:** a non-modal `role="dialog"`, so the page behind stays reachable. The focus moves to its first
  control when it has one, and returns to the element that opened it on Escape and on `hide()`; an outside click leaves
  the focus where the user clicked. Put `aria-haspopup="dialog"` on the trigger. For a hint on hover use
  [`hx-tooltip`](tooltip.md); for a modal choice use [`hx-dialog`](dialog.md).
- The projected content is created together with the popover and only shown while it is open.

## Tokens

The look comes from the design tokens `--h-popover-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
