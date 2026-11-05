# Governance: ADR and spec rules

Loaded only when `.agents/config.json` has `governance` (names: `adrDir`, `adrPaths`, `specDir`, `specMap`, see `docs/usage/project-config.md`). Without it planning and refinement are unchanged and this file is not read.

## Decision PBI

An item (planned, or a PBI being refined) needs a decision when it:

- touches a path matching a `governance.adrPaths` glob,
- adds a service (a new top-level folder that no `specMap` glob matches, see `skills/shared/implementation/references/specs.md`),
- adds an external dependency, or
- reverses an accepted ADR.

Such an item gets a separate decision PBI:

- title `docs: ADR <topic>`, label `needs-decision`;
- acceptance criterion `ADR (the next free ADR number) with Status: Proposed`, same wording as `github-issue` `references/decisions.md`; never a fixed ADR number;
- the implementing item lists the decision PBI in `blocked_by` (in a plan: its plan id, for an existing issue: its number).

Open questions of the decision go through `grill-me` first. Answers the user settles in the session go under `## Decisions` of the decision PBI (`<question> — <answer>`); the ADR still carries `Status: Proposed`, the owner accepts it.

## Spec criterion

An item whose files match a `governance.specMap` glob names the spec file in its body (`Spec: <specDir>/<name>.md`) and gets the acceptance criterion (`<spec>` is that spec file):

```markdown
- [ ] spec updated or `no spec change needed: <spec>` noted
```

The wording is exact; CI and `code-review` look for `no spec change needed:`. The wording is exact; CI and `code-review` look for `no spec change needed:`.

## Readiness

A PBI under `adrPaths` without an `ADR (the next free ADR number) with Status: Proposed` criterion, or without a blocking decision PBI in `blocked_by`, is not ready (`references/ready.md`). In `## Refine` the missing point goes to `grill-me` like any other gap, and the decision PBI is created only after approval.
