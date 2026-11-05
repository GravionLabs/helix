# When an ADR is needed

With the `governance` key of `.agents/config.json` an ADR is required when one of these holds:

- a changed file matches a glob of `governance.adrPaths` (for example `docker-compose.yml`, `infra/**`)
- a new service or deployable
- a new external dependency (runtime library, hosted service, protocol)
- a reversal of an `Accepted` ADR
- the issue has the label `needs-decision`

A label in `governance.skipLabels` (default `["skip-adr"]`) on the issue or PR waives the rule. No ADR for refactorings inside one module, bug fixes, dependency bumps or renames.

Without the key none of these rules fire; the skill still writes an ADR on request, in `docs/adr`.
