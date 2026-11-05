# Governance rules

Loaded only when `.agents/config.json` has the `governance` key (names: `skills/shared/implementation/schema/config.schema.json`). They mirror the CI checks of GravionLabs/ci (`adr`, `spec`).

## Run

From the project root: `pwsh scripts/Get-GovernanceMatches.ps1 [-Base <ref>] [-Head <ref>]` (defaults `origin/release/next` and `HEAD`; a branch that is not checked out, such as `origin/<branch>`, goes in `-Head`). It prints `{ "governance": false }` without the key; else `adr.matched`, `adr.adrFiles` and `spec[]` (`glob`, `spec`, `changedFiles`, `specChanged`). Globs follow CI (`**`, `*`, `?`, paths relative to the repository root); test files (case-sensitive: `*.test.*`, `*.spec.*`, `test_*`, `test/`, `tests/`, `__tests__/`, `*Tests.cs`, `*.Tests/`) and `.md` files are not counted for `spec`.

Inputs from the caller: the labels of the issue (none passed: no skip) and the implementer `notes`.

## adr-missing

`adr.matched` is non-empty and `adr.adrFiles` is empty: **blocking** with `rule: "adr-missing"`, `file` the first matched file, `why` names `adrDir`. No finding when the issue carries a label of `skipLabels` (default `skip-adr`).

## spec-drift

For each `spec[]` entry with `changedFiles` and `specChanged: false`:

- the implementer notes contain `no spec change needed: <that spec>`: no blocking finding, a **note** with the reason instead
- else `specMode: require`: **blocking** with `rule: "spec-drift"`, `file` the first changed file, `why` names the spec file
- else (`warn`, the default): a **note** naming the spec file
