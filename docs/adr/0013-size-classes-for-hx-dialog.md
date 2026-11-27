# ADR 0013: Size classes for hx-dialog

- Status: Accepted
- Date: 2026-11-26
- Issues: #1230

## Context

ADR 0008 (decision 3) requires every rule of the UX style guide to name the component, directive or token that carries
it. The dialogs deep dive needs size classes by content, but `hx-dialog` only has a free `width`, so each app picks its
own pixel widths.

## Decision

- `hx-dialog` gets the input `size: 'sm' | 'md' | 'lg'` (exported type `HxDialogSize`), default `md`.
- The widths are component tokens: `--h-dialog-sm-width` (`24rem`, a confirmation or short message),
  `--h-dialog-md-width` (`32rem`, a form of a few fields) and `--h-dialog-lg-width` (`56rem`, a wide form or table).
- The component puts the class `hx-dialog-size-<size>` on the overlay pane; the dialog stylesheet gives it the width.
- `width` stays and wins, as an inline style on the pane.

## Consequences

- An app changes a class for all its dialogs by overriding one token.
- An `hx-dialog` without `width` now takes `32rem` instead of the width of its content.
- The size is read when the dialog opens.
- `HxDialogService` (`HxDialogConfig`) has no `size`, so its dialogs keep the width of their content or their `width`.
  `hx-confirm-dialog` and `hx-drawer` are unaffected.

## Alternatives

- **Only the free `width`.** Rejected: the style guide would have no carrier and apps keep their own pixel widths.
- **Content width unless `size` is set.** Rejected: dialogs would have no consistent default; #1230 asks for `md`.
