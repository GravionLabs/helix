# plan.json schema

The only output contract of `planner`: one JSON object, returned to the caller, who validates it and creates the issues. Machine-checkable form: `schema/plan.schema.json` (JSON Schema draft 2020-12, structure; a caller may validate against the same file); graph invariants are listed under Validity.

```json
{
  "phase": "plan",
  "status": "ok",
  "parent_issue": 179,
  "input_type": "feature",
  "level": "pbi",
  "depth": "standard",
  "items": [
    {
      "id": "p1",
      "title": "feat: add plan schema reference",
      "body": "Parent Feature: #179\n\n## Overview\n...\n\n## Acceptance Criteria\n- [ ] ...",
      "size": "S",
      "tier": "standard",
      "blocked_by": [],
      "files": ["skills/x/y/SKILL.md"],
      "skills": ["ts-implementation"]
    }
  ],
  "questions": [
    {
      "id": "q1",
      "question": "Drop the legacy flag now or keep it one release?",
      "options": ["drop now", "keep one release"],
      "recommended": "keep one release",
      "why": "Consumers pin the old flag; dropping it now breaks them with no gain.",
      "blocks": ["p1"]
    }
  ],
  "assumptions": ["The legacy flag is read by no package in this repository."],
  "summary": "≤120 chars; names the first unblocked item"
}
```

## Fields

| Field                     | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `phase`, `status`         | `"plan"`; `ok`, or `fail` (the reason goes in `summary`)                                                                                                                                                                                                                                                                                                                                                                                                |
| `parent_issue`            | Number of the planned issue, `null` for a description. A pbi or bug that fits one session returns `items: []` (the summary says `refine <nr>`)                                                                                                                                                                                                                                                                                                          |
| `input_type`              | `epic`, `feature`, `pbi`, `bug`, `description`                                                                                                                                                                                                                                                                                                                                                                                                          |
| `level`                   | `feature` (from epic), `pbi` (from feature; from a pbi or bug as a split into sibling PBIs; from a description as internal steps that are not created). There is no level `task`: a plan never yields `[Task]` issues                                                                                                                                                                                                                                   |
| `depth`                   | `quick`, `standard`, `deep` (exploration budget only)                                                                                                                                                                                                                                                                                                                                                                                                   |
| `items[].id`              | Unique plan id (`p1`, `p2`, …)                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `items[].title`           | Summary without level prefix: capability for `feature`, `feat: …` / `fix: …` / `refactor: …` for `pbi`; the caller adds `[Feature] ` or `[PBI] ` by `level`                                                                                                                                                                                                                                                                                             |
| `items[].body`            | Issue body; the first line is `Parent Epic: #N` / `Parent Feature: #N` (for `feature` and `pbi` from a feature: `parent_issue`; for a split of a pbi or bug: the planned issue's parent Feature, none when it has no parent) followed by the sections of the matching issue template (see the `github-issue` skill). Optional `## Invariants` section for async/stateful items (`invariants.md`), placed in the PBI body before `## Definition of Done` |
| `items[].size`            | `S`, `M`, `L` (see `slicing.md`)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `items[].tier`            | `fast`, `standard`, `strong`, chosen per the tier table below; the item body states `Tier: <tier> — <reason>`. Migration: a legacy `model` maps `haiku` to `fast`, `sonnet` to `standard`, `inherit` to `strong`; readers apply the same mapping to existing plans, new plans carry only `tier`                                                                                                                                                         |
| `items[].blocked_by`      | Plan ids or existing issue numbers (integers); acyclic; `[]` when free                                                                                                                                                                                                                                                                                                                                                                                  |
| `items[].files`, `skills` | Files to touch; `<lang>-implementation` names from detect-techstack                                                                                                                                                                                                                                                                                                                                                                                     |
| `assumptions[]`           | Strings: what the plan takes as given where the repo and the request leave it open and no question is worth asking; `[]` when none                                                                                                                                                                                                                                                                                                                      |
| `summary`                 | ≤ 120 characters; names the first unblocked item                                                                                                                                                                                                                                                                                                                                                                                                        |
| `questions[]`             | `id`, `question`, `options` (≥ 2), `recommended` (one of `options`), `why`, `blocks` (item ids, may be empty); only decisions the repo cannot answer, see `questions.md`                                                                                                                                                                                                                                                                                |

## Validity

- Ids are unique. Every string in `blocked_by` and every id in `blocks` resolves to an item; integers are existing issues. `blocked_by` has no cycles and no self-reference.
- `recommended` is one of `options`; `options` has at least 2 distinct entries.
- A plan has no issue numbers of its own: the caller creates the issues from it.

## Tiers

| Tier       | When                                                                                 |
| :--------- | :----------------------------------------------------------------------------------- |
| `fast`     | mechanical or docs-only change of size S                                             |
| `strong`   | size L, cross-package change, security-relevant code, persistence or a state machine |
| `standard` | everything else                                                                      |

The tier carries no model id; the runner maps it.
