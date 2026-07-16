# CSS Class Prefix Decision — keep `.p-*`

Part of epic #297. Decided 2026-07-15.

Question: should the fork rename the `.p-*` CSS class names (and `data-p-*`
attributes, `--p-*` design tokens) to `h-*`, matching the `p-` → `h-` element
selector rename?

**Decision: no. Element selectors are `h-*`; CSS class names, `data-p-*`
attributes, and `--p-*` tokens keep their upstream names.**

## Why a rename is not viable

1. **The rendered CSS ships from the pinned, un-forked `@primeuix/styles`
   package**, whose rules hardcode `.p-*` class selectors (see e.g.
   `node_modules/@primeuix/styles/dist/knob/index.mjs` — `.p-knob-range`,
   `.p-knob svg` — or `.../button/index.mjs`). Renaming the classes the
   components emit would detach every component from its stylesheet.
2. **The theme layer cannot rename classes.** The `@primeuix/styled` theme
   `prefix` option renames only `--p-*` CSS variables, never class names.
   On the component side, `BaseStyle`/`cx()` emit the `classes`-map strings
   verbatim (`projects/helix/basecomponent/basecomponent.ts`, `cx()`), so
   there is no central hook to remap them either.
3. **A rename therefore requires vendoring the entire `@primeuix` styles
   layer** (~100 stylesheets) and touching, as counted on 2026-07-15:
   - ~1,741 `'p-…'` class strings in 106 `style/*.ts` files,
   - `data-p-*` attributes in 170 files,
   - `p-hidden-accessible` in 15 files,
   - `ng-content select="p-header|p-footer"` in 11 files,
   - plus 18 downstream `.p-` references in `apps/helix-demo` and
     `projects/helix-shell`.

## Cost/benefit

Permanent ownership and maintenance of ~100 stylesheets, a large one-off
rename, and breakage of every existing PrimeNG theme/preset — against zero
functional benefit (the class names are an implementation detail of the
styling layer, not part of the public component API). Keeping `.p-*` also
keeps all upstream PrimeNG themes/presets working unchanged.

## Related decisions

- [file-separation-analysis.md](file-separation-analysis.md) — template
  extraction (reversed by epic #297; templates *are* extracted).
- [signals-audit.md](signals-audit.md) — decorator APIs (reversed by epic
  #297; decorators *are* migrated to signals). Unlike those two, this
  decision is **not** reversed by #297: the blocking dependency on the
  un-forked `@primeuix` styles layer is unaffected by the fork no longer
  tracking upstream PrimeNG.
