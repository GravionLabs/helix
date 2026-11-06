---
name: adr
description: 'Write an architecture decision record (ADR) with the next free number, Status Proposed, and supersede older ADRs. Use for "write an ADR", "record this decision", architecture decision.'
---

An ADR records one decision: `docs/adr/NNNN-<slug>`, format in `references/format.md`. The skill writes it; only the owner accepts it.

## When an ADR is needed

- Explicit request ("write an ADR", "record this decision"): always, with or without config.
- Automatic rules apply only when `.agents/config.json` has the `governance` key: the change touches a path of `governance.adrPaths`, adds a service or an external dependency, reverses an accepted ADR, or the issue has `needs-decision`. A label of `governance.skipLabels` (default `skip-adr`) skips the rule.
- Without the key, do not demand an ADR on your own.

Details: `references/when.md`.

## Steps

1. Read the existing ADRs of the directory (`governance.adrDir`, default `docs/adr`) for overlap and for an ADR this one supersedes.
2. Create the file from the project root: `pwsh scripts/New-Adr.ps1 -Title "<title>" [-Issue <nr>] [-Supersedes <nnnn>]`. It picks the next free number (gaps are not filled), fills date and Status, never overwrites, and prints the new path.
3. Fill Context, Decision, Consequences and Alternatives in the new file. Short, concrete, active voice.
4. Leave Status `Proposed`. Never write `Accepted`: the owner accepts.
5. Link the ADR from the issue or PR.

## Superseding

`-Supersedes <nnnn>` writes `- Supersedes: [ADR nnnn](<old file>)` into the new ADR only and prints the old path. Then edit the old ADR's Status by hand: what was superseded (whole or in part, which part) and by which ADR. The old file stays. Procedure: `references/superseding.md`.

## Rules

- Issues never fix an ADR number; write "the next free ADR number".
- An unknown `-Supersedes` number or an existing file is an error; fix the input, do not rename files by hand.
- Out of scope: accepting an ADR, ADRs for existing repositories.
