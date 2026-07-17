# Signals Audit — Decorator-to-Signal Migration

Originally audited 2026-07-14 on Angular 22 (epic #233 / feature #240).
Reversed and turned into a migration plan on 2026-07-16 (epic #297, see below).

## Decision change (2026-07-16, epic #297)

The original audit verdict — **"do not migrate the fork's decorator APIs"** —
rested on upstream diffability: the fork was expected to track PrimeNG
releases, and rewriting ~2,850 call sites would have made upstream diffs
unreadable. The project has since decided **not to track upstream PrimeNG**,
which voids that rationale. Epic #297 reverses the verdict: all fork decorator
APIs migrate to their signal equivalents **before the first 22.0.0 publish**,
so the published API is signal-based from day one and the API break is free.

The other two original rationale points are addressed rather than dismissed:

- **Public API breakage** (`component.foo = x` stops working on `input()`
  signals): acceptable pre-publish; internally-written inputs follow the rules
  below instead of a mechanical swap.
- **Signal adoption via upstream syncs**: no longer applicable without
  upstream tracking.

The [.p-* CSS class prefix decision](css-class-prefix-decision.md) is *not*
reversed by this epic — class names stay `.p-*`.

## Scope

Inventory at time of reversal (non-spec `.ts` files, `projects/helix`):

| API | Occurrences | Files | Signal replacement |
|---|---|---|---|
| `@Input()` | ~1,830 | 95 | `input()` / `model()` |
| `@Output()` | ~340 | 64 | `output()` |
| `@ViewChild` | ~144 | 43 | `viewChild()` |
| `@ContentChild` | ~386 | 66 | `contentChild()` |
| `@ContentChildren` | ~70 | 65 | `contentChildren()` |
| `@HostListener` | ~75 | 23 | `host: {}` metadata |
| `@HostBinding` | ~4 | 4 | `host: {}` metadata |

Own code (`helix-shell`, `helix-zod`, `helix-ag-grid`, demo app) was already
migrated under epic #233 batch 1 (#270); nothing remains there.

## Working rules (fixed by the pilot, #311)

Each batch runs the official schematics **scoped to its component
directories**, then finishes manually by these rules:

1. **Schematics first.** Run per component path:
   `@angular/core:signal-input-migration`, `@angular/core:output-migration`,
   `@angular/core:signal-queries-migration` (with `--path projects/helix/<dir>`).
   *Pilot finding:* the output/queries schematics analyze the whole program and
   may edit or insert `// TODO` comments in files **outside** `--path` — revert
   every change outside the batch's directories before committing.
2. **Plain `@Input()` never written internally** → `input()`
   (or `input.required()` if every consumer must bind it).
3. **`@Input()` written internally or from a sibling component/directive** →
   `model()` only if genuinely two-way for the consumer; otherwise keep a
   private `signal()` for internal writes and expose the input separately.
   If neither is trivially safe, leave the decorator and list it in the PR body.
4. **Getter/setter `@Input` pairs backed by a signal** → collapse to
   `input()`/`model()` when behavior-preserving.
5. **`@Output()`** → `output()`. `OutputEmitterRef.emit()` requires its value
   argument — fix zero-arg `emit()` calls at the source (type the output
   `output<void>()` or pass the value) rather than leaving schematic TODOs.
6. **`@HostListener` / `@HostBinding`** → `host: {}` metadata on the
   component/directive decorator.
7. **Specs:** input writes `component.x = y` →
   `fixture.componentRef.setInput('x', y)`; input *reads* become signal calls
   (`component.x()`); non-input members keep direct assignment.
8. **Verification per batch:** `pnpm build:lib` and the demo build pass;
   `pnpm ng test helix-shell --watch=false` passes **after** rebuilding
   `dist/helix` (the shell consumes the built package — it is the only
   runnable consumer test suite and catches cross-component signal leaks
   like the `$hostName` PT-key regression); decorator grep over the batch's
   directories is empty (documented exceptions listed in the PR body).

## Batch tracking

| Batch | PBI | Scope | Status |
|---|---|---|---|
| Pilot | #311 | knob + this audit refresh | ✅ done |
| 1 | #312 | accordion–card | ✅ done (leftovers: `blockui.blocked`, `ButtonDirective` label/icon/loading/severity/buttonProps) |
| 2 | #313 | carousel–dataview | ✅ done (leftovers: carousel page/numVisible/numScroll, cascadeselect value, confirmdialog visible, contextmenu model & sub visible, chip chipProps) |
| 3 | #314 | dialog–floatlabel | ✅ done (leftovers: dialog visible/style, drawer visible, fileupload files) |
| 4 | #315 | fluid–inputicon | ✅ done (no leftovers) |
| 5 | #316 | inputmask–message | ✅ done (leftovers: inputmask mask, megamenu/menubar model) |
| 6 | #317 | metergroup–password | ✅ done (leftovers: orderlist value; spec input writes → #324) |
| 7 | #318 | popover–skeleton | ✅ done (spec input writes → #324) |
| 8 | #319 | slider–terminal | open |
| 9 | #320 | textarea–treetable | open |
| 10 | #321 | directives & infrastructure | open |
| Hard cases | #322 | table & treetable | open |
| Large components | #323 | datepicker, multiselect, select, tree, autocomplete, picklist, galleria | open |
| Closeout | #324 | final sweep, audit update, lint guard | open |

## Definition of done (epic #297)

`grep -rE '@(Input|Output|ViewChild|ContentChild|ContentChildren|HostListener|HostBinding)\('
projects/helix --include='*.ts'` returns nothing (or only documented
exceptions); builds and CI green; a lint guard prevents reintroduction (#324).

Related: [css-class-prefix-decision.md](css-class-prefix-decision.md) records
the epic-#297 decision that the `.p-*` CSS class names stay even though this
file's keep-decorators verdict was reversed by the same epic.
