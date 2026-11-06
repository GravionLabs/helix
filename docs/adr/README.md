# Architecture decision records

One file per decision, numbered in the order they were taken, in the style of
[GravionLabs/ariadne](https://github.com/GravionLabs/ariadne/tree/main/docs/adr). A record is
`accepted`, `superseded by ADR NNNN` or `deprecated`; it is not edited after acceptance except for
that status line and links to later records.

| ADR                                         | Title                                                                                    | Status   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- | -------- |
| [0001](0001-styling-foundation.md)          | Styling foundation: Helix tokens on the vendored fork now, a vanilla library replaces it | accepted |
| [0002](0002-retire-helix-core.md)           | Retire helix-core: helix-ui is the only component library                                | accepted |
| [0003](0003-configurable-topbar-actions.md) | Configurable topbar actions                                                              | proposed |

Template:

```markdown
# ADR NNNN: <title>

- Status: proposed | accepted | superseded by ADR NNNN
- Date: YYYY-MM-DD
- Issues: #NNN

## Context
## Options
## Decision
## Consequences
```

## Rule

A pull request that changes `projects/*/src/**` or `apps/*/src/**`, or that closes an issue labelled
`needs-decision`, must add or change a record in `docs/adr/`. A new record needs a `Status:` line and an unused
number. The `PR checks` job (GravionLabs/ci `pr-checks.yml`) enforces it from `governance` in
`.agents/config.json`; the label `skip-adr` skips the check.
