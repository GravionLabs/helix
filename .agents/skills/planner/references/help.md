# /planner

Plans an issue one level down with blockers and sizes, grills the open decisions, creates the approved issues. `refine <nr>` checks readiness.

## Usage

```text
/planner <nr>
/planner <owner/repo#nr>
/planner <free description>
/planner refine <nr>
/planner refine --check <nr…> --result <file>
/planner help
```

## Arguments and flags

- `<nr>`: issue number to plan; the input level decides the output level:
  - Objective gives Features in the target repositories (each item names its `repo`, same owner)
  - Epic gives Features
  - Feature gives PBIs
  - PBI or Bug that fits one session: no items (use `refine <nr>`); size L or more than one session: split into sibling PBIs under the same Feature
- `<owner/repo#nr>`: an issue of another repository, e.g. an Objective; the Features are created in their repositories and linked to it as sub-issues
- `<free description>`: internal steps only, no issues are created
- `refine <nr>`: no plan, no new issues except an approved split; checks the issue against the readiness list of its level, grills the gaps, updates the body (`## Decisions`), sets labels (`needs-refinement` removed when ready, `needs-decision` when a question is open)
- Depth, named in the request: `quick` (~5 key files), `standard` (default), `deep` (call sites, tests, docs of every affected area)
- Interactive session: plan, grill the open decisions round by round (`grill-me`), then you approve granularity, blockers and which items to create (also with zero questions); nothing is created before; the answers go under `## Decisions` of the created issues
- A split of an L-sized PBI is created only after your approval
- Non-interactive (a workflow subagent): no questions, no issues; the plan with `questions[]` is returned as data
- `help` (also `--help`, `-h`): print this file

## Examples

```text
/planner 42
/planner GravionLabs/telos#3
/planner refine 42
/planner deep plan for #42
/planner add rate limiting to the gateway
/planner help
```

## Config

- `governance` in `.agents/config.json`: switches on the ADR and spec rules (decision PBI `docs: ADR <topic>` that blocks the implementing item, spec criterion); without it planning is unchanged. See `site/usage/project-config.md`

## See also

- `grill-me`, `github-issue`, `deliver`
- `site/usage/governance.md`
