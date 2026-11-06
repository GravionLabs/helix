# Decisions as ADRs

Loaded only when `.agents/config.json` has the `governance` key. Without it `github-issue` behaves as without this file.

An issue whose outcome is a decision (a choice between architectures, services or dependencies):

- label `needs-decision`
- acceptance criterion: `ADR (the next free ADR number) with Status: Proposed`

Never write a fixed ADR number into the issue; `adr` picks the next free one when the work starts. The owner accepts the ADR.
