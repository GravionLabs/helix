# ADR 0003: Configurable topbar actions

- Status: Proposed
- Date: 2026-11-06
- Issues: #1044

## Context

The inset shell (22.2) moved the global actions (dark mode, configurator, alerts, custom buttons, an ellipsis menu) into the nav rail footer through `topbarItems`, `topbarActions` (`HelixTopbarAction[]`) and `menuActions`. Page-specific controls such as a filter field went through the projected `[helixTopbarEnd]` slot. This gave two unrelated mechanisms for the same header, no control over placement, and no way to put a search field in the middle of the page header or to hide a built-in action.

## Decision

- `helix-app-layout` takes one list, `topbarActions: HelixTopbarActionConfig[]`. Each entry names an `action`, a `position` (`start`, `center` or `end`, default `end`), an `order` within the position and a `hidden` flag. The actions render in the page header.
- The `action` is either a built-in (`search`, `darkMode`, `configurator`, `alerts`) or a custom action `{ id, template }` rendered from an `ng-template`.
- Without input the header shows `HELIX_DEFAULT_TOPBAR_ACTIONS` (search in the center, dark mode and configurator at the end, alerts only when the `alerts` input has items). `[]` renders no actions. `defineTopbarActions(defaults, overrides)` changes single entries by action id.
- The menu toggle and the breadcrumb or page title stay fixed in `start`. Up to 991px the center zone folds into the end zone, sorted by `order`.
- The nav rail footer actions (`items`, `menuActions`, `menuLabel`), `topbarItems`, the ellipsis-menu shape of `topbarActions` (`HelixTopbarAction`, `HelixTopbarItem`, `HelixTopbarItemType`) and the `[helixTopbarEnd]` slot are removed without a deprecated path. 22.3 is a breaking release; [the migration notes](../MIGRATION-inset-shell.md#topbar-actions-223) map each old input to the new list.

## Consequences

- One declarative API for every header action; placement and visibility are data, so apps can test and compute them.
- Apps using `topbarItems`, the ellipsis menu or `[helixTopbarEnd]` must migrate when they take 22.3; there is no transition period.
- Custom actions are templates, so the layout does not own their state or accessibility; the app does.
- The nav rail is only navigation; the header gains a layout that needs a fixed height on narrow screens (zones never wrap).

## Alternatives

- Keep the projected `[helixTopbarEnd]` slot next to the list: rejected, it keeps two mechanisms and cannot express start or center placement.
- Keep a deprecated path for one release: rejected, the old and new shapes of `topbarActions` have different types, so a shim would be ambiguous; the major release is the place to break.
- Separate inputs per zone (`topbarStart`, `topbarCenter`, `topbarEnd`): rejected, it spreads one concern over three inputs and makes defaults and overrides harder.
