# Retro categories

Adapted from mattpocock/skills `skills/engineering/retro/SKILL.md` (MIT), commit 49dd158d1076134a641b33efb035946536778336 (default branch HEAD when fetched; the upstream file was not pinned to an older revision). Categories 7-8 are ours.

Goal: improve the agent **environment**, not the code under review. Rank candidates by severity (cost or rework caused). Each candidate cites evidence: a transcript turn, a review finding or a metric.

1. **Navigation** - did the agent take long to find the right files? Hidden dependencies between files? A navigation pointer (one line in `AGENTS.md` to a doc) fixes it. Use when exploration dominated the run.
2. **Automated checks** - could lint, types, tests or a filesystem check have caught a mistake? Read the repo's own check command and CI first: an existing check that is unwired or broken is the finding. A repo with no guardrail (no hook, no CI job) is itself a finding. Mechanical mistakes (fixed pattern, banned API, import shape, file location) get a deterministic check, never a prose rule.
3. **Review rules** - the reviewer failed to catch something: add or clarify a rule in the `<lang>-implementation` `## Review rules`. Classify first: mechanical -> category 2; judgement call (cross-file consistency, surrounding style) -> a review rule. The reviewer has the least context pressure and enforces standards; the implementer should not carry them.
4. **AGENTS.md / steering size** - steering files are pushed into every context. Keep them for navigation pointers; move standards to review rules or checks. Flag a large file in the repo or the global scope.
5. **No-op instructions** - lines that do not change agent behaviour (the agent already does it, or it is unverifiable). Candidates for deletion.
6. **Tool economy** - expensive tool calls that could be streamlined (whole-file reads, noisy CLI output, token-heavy MCP tools). Check request counts and the largest tool results.
7. **Information access** - a crucial fact was unavailable (dev-server logs, read-only access to a third-party service, an issue field). Propose access, not instructions.
8. **Model per role** - compare usage per role with its outcome. An expensive role that produced rework may need a stronger model; a role that only reads may need a cheaper one. Evidence: the role share of agentlens and the fix rounds on the PR.

## Metric reading

- Fix rounds above 1 per PBI: review rules or issue bodies were too thin (categories 2, 3).
