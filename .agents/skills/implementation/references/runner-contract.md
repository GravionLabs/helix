# Runner contract

How `implementation` behaves as the implementer role when a runner (such as `deliver`) or a caller starts it for one PBI or Bug. Interactive use is unchanged; this file only adds the input, the rules and the result.

## Input

- the PBI or Bug issue body (scope, Technical Notes, Invariants) with its acceptance criteria
- the worktree: the working directory, already on the issue branch
- the role: `implement` (default) or `fix` (a fix round with findings); `SKILL.md` `## Lessons` passes it to `Get-Lessons.ps1 -Role`

Read the files the issue names, then follow `SKILL.md` and the `<lang>-implementation` skill from `detect-techstack`.

## Rules

- Commit the change with the issue number in the message (`<type>: <description> (#<nr>)`, last footer line `Refs #<nr>`); files added by name.
- Never call `gh`: no issue, comment, label or pull request calls. The caller owns GitHub.
- Never push. The caller pushes.
- Stay inside the worktree and the files of the issue; a criterion that cannot be met as written ends in `blocked`, not in a reinterpretation.
- Spec rules (`specs.md`): a matching `specMap` entry without a needed spec change puts `no spec change needed: <spec file> — <reason>` into `notes`; the runner passes that line on.
- Tests and format per `SKILL.md` before the commit.

## Result

Print one JSON object that validates against `schema/implementer.schema.json`, nothing else.

| Property       | Meaning                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `status`       | `done` (committed, tests green) or `blocked` (nothing committed that is red)                              |
| `commit`       | SHA of the commit; `null` when `blocked` without a commit                                                 |
| `filesChanged` | paths changed by the commit, relative to the worktree                                                     |
| `testsRun`     | the test commands run and their outcome, one string                                                       |
| `notes`        | decisions, deviations, follow-ups; for `blocked` the reason and what is needed                            |
| `risk`         | `{level, what, backout}`: `low`, `medium` or `high`; what could break and for whom; how to undo it        |
| `visual_proof` | `{before, after}` (paths or text) or `{na}` (the reason); required, `na` for a change that is not visible |

Both `risk` and `visual_proof` are always required, also for `blocked`. `deliver` puts them into the pull request body. Risk levels are those of `github-pull-request` `references/risk-and-proof.md`: the highest level of the changes wins.

## Visual proof

A change is visible when it touches UI files (`.html`, `.css`, `.scss`, `.tsx`, `.jsx`, `.vue`, `.svelte`, `*.component.ts`) or changes the behavior of an app a person runs. Then:

- start the app with the `run` skill (or drive the browser with the browser skills), take a before screenshot (the base state) and an after screenshot;
- store them under `.agents/proof/<branch>/` (`<branch>` the issue branch) and put those paths into `visual_proof.before` and `visual_proof.after`; describe what differs in text next to the path;
- the files are never committed or staged (the directory is gitignored); a person attaches images to the pull request when needed.

Any other change: `visual_proof.na` with the reason, for example `no UI change, skill text only`. Never invent a screenshot path.

```json
{
  "status": "done",
  "commit": "a1b2c3d",
  "filesChanged": ["src/parse.ts", "src/parse.test.ts"],
  "testsRun": "pnpm vitest run src/parse.test.ts: 6 passed",
  "notes": [],
  "risk": {
    "level": "low",
    "what": "parser only, covered by tests",
    "backout": "revert the commit"
  },
  "visual_proof": { "na": "no UI change, parser only" }
}
```
