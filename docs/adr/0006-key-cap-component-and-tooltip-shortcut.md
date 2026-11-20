# ADR 0006: Key-cap component and a shortcut in the tooltip

- Status: Proposed
- Date: 2026-11-20
- Issues: #1113, #1111

## Context

Apps built on Helix show keyboard shortcuts in palettes, menus and tooltips, each with its own markup or as plain text. Shortcuts should look the same everywhere and read well for screen readers.

## Decision

- `hx-kbd` (`HxKbd`) renders one `<kbd>` cap per key from `keys`. `size` is `md` or `sm` (dense rows and menus).
- `separator` is `'+'` or `'none'`. The default follows the platform: none on macOS, `+` elsewhere.
- The component does not translate or rename keys. The app passes the labels for its platform (for example `⌘` on macOS).
- `hx-tooltip` takes an optional `hxTooltipShortcut` (array of keys) and shows small caps after its text. The caps sit inside the `aria-describedby` element, so screen readers read them as text.
- `aria-keyshortcuts` on the trigger element stays the caller's job; the docs name it.
- Styling uses the tokens `--h-kbd-*` and `--h-kbd-tooltip-*`. A token test checks the contrast in the light and dark theme: cap text at least 4.5:1, border at least 3:1.

## Consequences

- Apps replace their own shortcut markup with `hx-kbd`.
- Key label translation stays in the app, so the library needs no locale data.
