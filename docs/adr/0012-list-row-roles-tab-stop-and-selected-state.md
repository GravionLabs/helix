# ADR 0012: Roles, tab stop and selected state of `hx-list`

- Status: proposed
- Date: 2026-11-26
- Issues: #1211, #1206
- Builds on: [ADR 0009](0009-type-scale-spacing-form-field-list-row-and-lint-preset.md)

## Context

ADR 0009 fixes `hx-list` and `[hx-list-row]` with the states `selected` and `current`, and gives the list the
keyboard. It does not say which ARIA roles and attributes they write, which row Tab reaches, or how a row's content
is laid out. An ARIA `list` requires `listitem` children, and `aria-pressed` is not allowed on a link.

## Decision

- `hx-list` has the input `role`: `list` (default) or `listbox`. Trees are not covered.
- `list` renders `role="group"`. The rows keep their native roles. `selected` on a button writes `aria-pressed`
  (only when bound, so an action row stays a plain button); on a link it writes `aria-current="true"` unless
  `current` says more.
- `listbox` renders `role="listbox"`, each row `role="option"` with `aria-selected`.
- One tab stop, moved with the CDK `FocusKeyManager` (Arrow Up/Down, Home/End, no wrapping, no typeahead): the row
  focused last, else the current, else the selected, else the first. Disabled and hidden rows are skipped. A row
  outside a list stays in the tab order.
- The list owns focus only; the app owns `selected` and `current`.
- Content slots are the classes `.hx-list-row-icon`, `.hx-list-row-label` and `.hx-list-row-meta`.
- The component tokens are `--h-list-row-*` (token set `listRow`). `list.scss` is not part of `core.css`.

## Consequences

- A screen reader announces a list of kind `list` as a group, without an item count.
- Apps give the list an accessible name and wrap navigation in their own `nav`.
- A link row cannot be disabled by the directive.

## Alternatives

- **`role="list"` with a `listitem` wrapper per row.** Rejected: every app would write the wrapper, and the example
  of ADR 0009 puts the rows directly into the list.
- **`aria-pressed` on every row.** Rejected: not allowed on links, and it turns action rows into toggle buttons.
- **A component with projected slots.** Rejected: ADR 0009 puts the row on the native element.
