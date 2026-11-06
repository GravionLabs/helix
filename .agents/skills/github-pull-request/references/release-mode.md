# Release mode

Release heads (`release/next`, `release/<x.y>`) into the default branch have no issue number. The caller supplies `title`; step 1 skips `gh issue view`.

Body (step 3):

```markdown
## Summary

Release of `<branch>` into `<base>`.

## Merged pull requests

- #<n> <title>

## Release review notes

- <one bullet per line of `release_review_notes`>

## Verification

<as in step 3, one sentence>

Closes #<feature_number>
```

- `## Release review notes` only when `release_review_notes` is non-empty, else the section is left out.
- `Closes #<feature_number>` only when `feature_number` is passed, else none. Never `Closes #<issue_number>`.
- Reviewer (step 5) unchanged. `auto_merge` is forced false (step 6 never runs).
- Output (step 7): PR number, URL, footer `none` in release mode without `feature_number`.
