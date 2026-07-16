# Component File-Structure Analysis (ts/html/scss)

Part of epic #233 / feature #241. Analyzed 2026-07-14.

> **Decision change (2026-07-15, epic #297):** the "keep inline (vendored)"
> verdict below is **reversed**. The project no longer tracks upstream
> PrimeNG, which voids criterion 2 (upstream diffability) — the load-bearing
> reason for keeping the fork single-file. Epic #297 (feature #298) extracts
> all fork inline templates to separate `.html` files before the first
> 22.0.0 publish; the 55 SVG icon components under `projects/helix/icons/`
> and secondary components with templates under 10 lines stay inline. The
> extraction convention lives in
> [../CONTRIBUTING-file-structure.md](../CONTRIBUTING-file-structure.md).
> The analysis below is kept unchanged for the record.

Question: which components (if any) should be split from single-file inline
templates into separate ts/html/scss files?

## Criteria

A split is worth it only when **all** of these hold:

1. **Template size** — the inline template dominates the file (roughly > 200
   template lines) and makes the TS logic hard to find.
2. **We own the file's history** — the file is not a vendored copy whose diff
   against upstream must stay readable.
3. **Styles exist as CSS** — the component styles with stylesheet files, not a
   TS token system.

## Verdicts by area

### `projects/helix` (vendored PrimeNG fork, 110 components) — keep inline

Criterion 2 fails for every fork component, and criterion 3 fails as well
(styles are TS token files under `style/*style.ts`, explicitly out of scope
for #233). Upstream PrimeNG ships these components as single files with inline
templates; splitting `table.ts` (6,697 lines), `treetable.ts` (4,170),
`datepicker.ts` (3,929) etc. would make every future upstream sync a manual
re-merge of the extracted templates. Even the largest templates — where the
editing-comfort argument is strongest — are exactly the components that
receive the most upstream churn.

**Verdict: all 110 fork components keep the upstream single-file layout.**
This is deliberately the same trade-off recorded in
[signals-audit.md](signals-audit.md) (keep decorator APIs) and the fork-scoped
`eqeqeq` lint exception. Individual per-component verdicts are therefore
uniform and not enumerated; the ten largest are listed for the record:

| Component | Lines | Verdict |
|---|---|---|
| table | 6,697 | keep inline (vendored) |
| treetable | 4,170 | keep inline (vendored) |
| datepicker | 3,929 | keep inline (vendored) |
| multiselect | 2,336 | keep inline (vendored) |
| select | 2,054 | keep inline (vendored) |
| tree | 1,986 | keep inline (vendored) |
| autocomplete | 1,937 | keep inline (vendored) |
| picklist | 1,874 | keep inline (vendored) |
| listbox | 1,791 | keep inline (vendored) |
| galleria | 1,742 | keep inline (vendored) |

### `projects/helix-shell` — already split, keep as is

All 8 layout components already use separate `.html` files (23 templates) with
Tailwind styling. Matches the convention below; no action.

### `projects/helix-zod`, `projects/helix-ag-grid` — keep current layout

Small widget components with short templates; existing per-component layout
already follows the convention. No splits warranted.

### `apps/helix-demo` — keep current layout

Pages use `templateUrl` with separate files (28 components) where templates
are non-trivial; small demo widgets use short inline templates. Both comply
with the convention; no retrofits needed.

## Resulting convention

Documented in [../CONTRIBUTING-file-structure.md](../CONTRIBUTING-file-structure.md)
(#273): own code splits ts/html(/scss) once a template stops being trivial;
vendored fork code always mirrors upstream's single-file layout.

## Follow-ups

None. No component met the split criteria, so no follow-up split PBIs are
created from this analysis.

Related: [css-class-prefix-decision.md](css-class-prefix-decision.md) — the
`.p-*` CSS class names stay even though epic #297 reverses this file's
keep-inline verdict.
