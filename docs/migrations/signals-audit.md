# Signals Audit — Remaining Decorator-Based APIs

Part of epic #233 / feature #240. Audited 2026-07-14 on Angular 22.

Inventory of remaining decorator-based Angular APIs (`@Input()`, `@Output()`,
`@ViewChild`, `@ContentChild`, `@ContentChildren`, `@HostListener`,
`@HostBinding`, `BehaviorSubject`-as-state) across all libraries and the demo
app, with the signal replacement for each row or the documented reason not to
migrate.

## Summary

| Area | Decorator usages | Verdict |
|---|---|---|
| `projects/helix` (vendored PrimeNG fork) | ~2,850 across 100+ files | **Do not migrate** (see below) |
| `projects/helix-shell` | 0 | Nothing to do |
| `projects/helix-zod` | 0 | Nothing to do |
| `projects/helix-ag-grid` | 0 | Nothing to do |
| `apps/helix-demo` | 2 (`@ViewChild`) | **Migrate** (batch 1, #270) |

`BehaviorSubject`-as-state: zero occurrences anywhere.

## Own code — migration table (batch 1, #270)

| File | Current API | Signal replacement |
|---|---|---|
| `apps/helix-demo/src/app/pages/crud/crud.ts:329` | `@ViewChild('dt') dt!: Table` | `dt = viewChild.required<Table>('dt')` (call sites become `this.dt()`) |
| `apps/helix-demo/src/app/pages/uikit/table/table-demo.ts:92` | `@ViewChild('filter') filter!: ElementRef` | `filter = viewChild.required<ElementRef>('filter')` (call sites become `this.filter()`) |

`apps/helix-demo/public/source/**` contains generated copies of the uikit page
sources (`pnpm demo:generate-sources`); they follow automatically and are not
audit rows.

## Vendored fork (`projects/helix`) — keep decorator APIs

Exact counts (non-spec `.ts` files):

| API | Occurrences | Files | Signal equivalent (not applied) |
|---|---|---|---|
| `@Input()` | 1,830 | 95 | `input()` / `model()` |
| `@Output()` | 340 | 64 | `output()` |
| `@ViewChild` | 144 | 43 | `viewChild()` |
| `@ContentChild` | 386 | 66 | `contentChild()` |
| `@ContentChildren` | 70 | 65 | `contentChildren()` |
| `@HostListener` | 75 | 23 | `host: {}` metadata |
| `@HostBinding` | 4 | 4 | `host: {}` metadata |

**Decision: do not migrate the fork's decorator APIs wholesale.**

Rationale:

1. **Upstream diffability.** The fork vendors PrimeNG 21.1.9 (epic #201). Its
   remaining decorator usage mirrors upstream sources; rewriting ~2,850 call
   sites would make every future upstream diff/patch port unreadable. This is
   the same trade-off recorded for template file separation
   (`file-separation-analysis.md`) and for the `eqeqeq` lint exception.
2. **Public API breakage.** `@Input()` properties are assignable
   (`component.foo = x`); `input()` signals are not. Many fork inputs are set
   programmatically by sibling components (e.g. table ↔ paginator), so a
   mechanical swap is not behavior-preserving.
3. **Signal adoption already tracks upstream.** The fork already uses
   `input()`, `computed()`, `contentChild()` etc. where upstream PrimeNG does.
   New signal adoption should arrive by syncing upstream versions, not by
   diverging locally.

Follow-up: revisit per component only if/when a component is deliberately
forked away from upstream (at that point its decorators join the migration
table above).

## Batch plan

- **Batch 1 (#270):** the two demo-app `@ViewChild` rows above.
- **Batch 2 (#271):** not needed — the audit found no further own-code rows.
  Recommend closing #271 as completed-by-audit (no additional batches were
  pre-authorized for fork code).

Related: [css-class-prefix-decision.md](css-class-prefix-decision.md) records
the epic-#297 decision that the `.p-*` CSS class names stay even as this
file's keep-decorators verdict is reversed by the same epic.
