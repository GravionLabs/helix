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

Inventory at time of reversal (non-spec `.ts` files, `projects/core`):

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
   `@angular/core:signal-queries-migration` (with `--path projects/core/<dir>`).
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
   `pnpm ng test shell --watch=false` passes **after** rebuilding
   `dist/core` (the shell consumes the built package — it is the only
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
| 8 | #319 | slider–terminal | ✅ done (leftovers: splitter panelSizes getter/setter) |
| 9 | #320 | textarea–treetable | ✅ done (leftovers: tieredmenu getter/setter visible/model, toast getter/setter position, treeselect getter/setter options, various ContentChild/Input in treeselect, toolbar ContentChild templates, toggleswitch handleTemplate, timeline markerTemplate) |
| 10 | #321 | directives & infrastructure | ✅ done (leftovers: animateonscroll enterClass/leaveClass/root/rootMargin/threshold/once, api shared.ts PrimeTemplate type/name, autofocus autofocus, dragdrop getter/setters and HostListeners, focustrap pFocusTrapDisabled, keyfilter pValidateOnly/pattern/ngModelChange/HostListeners, overlay/overlayViewChild/contentViewChild/containerViewChild, scroller remaining @Input, styleclass selector/enterFromClass/enterActiveClass/enterToClass/leaveFromClass/leaveActiveClass/leaveToClass/hideOnOutsideClick/toggleClass/hideOnEscape/hideOnResize/resizeSelector/HostListener, tooltip remaining @Input and disabled getter/setter) |
| Hard cases | #322 | table & treetable | ✅ done (leftovers: table getter/setter inputs for value, columns, first, rows, sortField, sortOrder, multiSortMeta, selection, selectAll, frozenValue, contextMenuSelection, filters, expandedRows, stateKey, loadingIcon, filterTemplate; treetable getter/setter inputs for first, rows) |
| Large components | #323 | datepicker, multiselect, select, tree, autocomplete, picklist, galleria | ✅ done (leftovers: datepicker 14 getter/setter + accessor inputs; multiselect first/rows/value; select first/rows/value; tree getter/setter value; autocomplete 3 accessor inputs; picklist 3 accessor inputs; galleria 5 getter/setter inputs) |
| Closeout | #324 | final sweep, audit update, lint guard | ✅ done — 639 remaining decorators (getter/setter @Input, @HostListener, @HostBinding) across codebase; these require manual refactoring beyond schematic capability. Bi-weekly audit doc updates recommended as leftover files are cleaned up. |

## Feature #359 — manual decorator leftovers (2026-07 to 2026-08)

#324's closeout still left ~509 non-spec decorators in `projects/core`,
concentrated in the largest components (table, multiselect, treeselect,
select, datepicker, picklist, treetable, tree, autocomplete, galleria,
scroller, overlay) plus ~50 scattered small leftovers. Epic #358 opened
feature #359 to finish these as one PBI per directory group, each carrying
the same rule block above and a grep-based DoD.

| PBI | Scope | Status |
|---|---|---|
| #360 | remaining small-component leftovers | ✅ done |
| #361 | directives (dragdrop, keyfilter, styleclass, tooltip, icons) | ✅ done |
| #362 | scroller & overlay | ✅ done |
| #363 | table | ✅ done |
| #364 | treetable | ✅ done |
| #365 | multiselect | ✅ done |
| #366 | select | ✅ done |
| #367 | treeselect | ✅ done |
| #368 | datepicker | ✅ done |
| #369 | tree | ✅ done |
| #370 | autocomplete | ✅ done |
| #371 | picklist | ✅ done |
| #372 | galleria | ✅ done |
| #373 | closeout — sweep, spec input-writes, real lint guard, audit update | ✅ done (this update) |

**#373 closeout findings:**

- Epic-level decorator sweep (`grep -rE '@(Input|Output|ViewChild|ContentChild|ContentChildren|HostListener|HostBinding)\(' projects/core --include='*.ts'`,
  excluding `*.spec.ts`) is **empty**. The only remaining decorator hits live
  in `*.spec.ts` test-host components (plain Angular test fixtures that
  legitimately use classic decorators) or are inside comments/strings — none
  are library-source leftovers.
- The fork's own spec files were never type-checked by any build or test
  script (`projects/core` has no `tsconfig.spec.json`, unlike
  `helix-shell`/`helix-zod`/`helix-ag-grid`). As components converted to
  signals, ~900 spec call sites across 51 files silently broke
  (`component.x = y` on a now-read-only `input()`/`model()`, or reading a
  signal without calling it) without anything catching it. These were found
  by type-checking `projects/core/**/*.ts` against a temporary standalone
  tsconfig and fixed per rule 7 above (`component.x = y` →
  `fixture.componentRef.setInput('x', y)`; signal reads get `()`). A
  handful of pre-existing, unrelated jasmine→vitest typing gaps (`done()`
  callback typing, `jasmine`'s `withContext`, one `IntersectionObserver`
  mock) were left untouched — they predate this migration and are a
  separate cleanup.
- Real eslint guard added in `eslint.config.js`: a `no-restricted-syntax`
  rule bans `@Input`/`@Output`/`@ViewChild`/`@ContentChild`/
  `@ContentChildren`/`@HostListener`/`@HostBinding` decorators in
  `projects/core/**/*.ts`, excluding `*.spec.ts`. Verified to fail `pnpm
  lint` when a decorator is (temporarily) reintroduced into a fork source
  file. #324 had claimed this guard but never landed it.

## Definition of done (epic #297, closed out by feature #359 / #373)

`grep -rE '@(Input|Output|ViewChild|ContentChild|ContentChildren|HostListener|HostBinding)\('
projects/core --include='*.ts'` returns nothing outside `*.spec.ts` test
hosts; builds and CI green; a real lint guard prevents reintroduction (added
by #373, see above).

Related: [css-class-prefix-decision.md](css-class-prefix-decision.md) records
the epic-#297 decision that the `.p-*` CSS class names stay even though this
file's keep-decorators verdict was reversed by the same epic.
