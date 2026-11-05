# Reviewer contract

How `code-review` behaves as the reviewer role when a runner (such as `deliver`) or a caller starts it. Interactive use is the same review; only the output differs.

## Input

- the diff under review (`git diff <base>...HEAD`)
- the acceptance criteria of the issue or PBI
- the role `review` (the default); `SKILL.md` step 3 passes it to `Get-Lessons.ps1 -Role`
- the `## Review rules` of the `<lang>-implementation` skills from `detect-techstack`
- the `## Review rules` of the `<lang>-test` skills from `detect-techstack`, applied to the test files of the diff; a skill without that section is skipped

## Blocking

A finding is **blocking** when it breaks an acceptance criterion or is a correctness or security defect. Everything else is a note: style, naming, performance without a measured problem, API taste, refactors.

Security is part of every review: injection, unvalidated input, secrets in code or logs, broken authorization, unsafe deserialization, path traversal. A confirmed defect is blocking; a doubt goes into `notes`.

A missing or weak test for changed behavior is blocking only when a criterion requires that behavior to be tested or the untested path is itself a correctness defect.

## Result

Print one JSON object that validates against `schema/review.schema.json`, nothing else.

| Property   | Meaning                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------- |
| `blocking` | findings that must be fixed before merge; empty when none                                   |
| `file`     | path relative to the repository root                                                        |
| `line`     | 1-based line in the new version of the file                                                 |
| `title`    | the defect in one line                                                                      |
| `why`      | which criterion or defect class it breaks, and the fix direction                            |
| `rule`     | optional on a blocking item: `adr-missing` or `spec-drift`, from `references/governance.md` |
| `notes`    | non-blocking observations, one string each                                                  |

```json
{
  "blocking": [
    {
      "file": "src/parse.ts",
      "line": 42,
      "title": "Empty input throws instead of returning []",
      "why": "Criterion 2 requires [] for empty input; guard before the split."
    }
  ],
  "notes": ["`parseAll` could reuse `parse`"]
}
```
