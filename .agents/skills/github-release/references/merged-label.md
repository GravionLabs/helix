# The `merged` label

`Closes #n` fires only on the default branch, so PBIs and Bugs merged into `release/*` stay open until the release. The label `merged` marks them.

## Lifecycle

1. A PR merges into a `release/*` branch. The reusable workflow `GravionLabs/ci/.github/workflows/release-branch.yml@v1` (`release-branch.yml` template; its step `versioning/mark-merged-issues`) adds `merged` to every issue the PR closes or references, comments on it, and labels the parent PBI and Feature once their children are merged. With `project-status` (default `In release`) it sets the project Status `In release` on the same issues: those the merged PR closes (`closingIssuesReferences`) plus those named with a keyword (`Refs #n`, `Closes #n`, `Fixes #n`) in the PR body or its commits, so Refs-only issues and PRs into `release/next` are covered. Only merged PRs whose base is the pushed branch count.
2. The issue stays open and keeps the label while the release branch is unreleased.
3. The release lands on `main`: `close-release-issues` (`gh-release`) closes the issue and removes `merged`.

The project status `In release` is set by that workflow; `github-project sync` (skill of GravionLabs/ci) stays the repair path. The label stays the source of truth.

Labels can be edited by hand, so skills treat `merged` as a fast path only.

## Rollout to existing repos

One PR per repo: copy `templates/release-branch.yml` to `.github/workflows/release-branch.yml` (replace an inline copy of the workflow; set `project-url`) and open the PR with `github-pull-request`. `cut` offers this when no workflow in `.github/workflows/` calls `release-branch.yml` of GravionLabs/ci.

## Permissions

- Token requirements are documented in the README of GravionLabs/ci (`release-branch.yml`): a classic PAT with scopes `repo`, `workflow` and `project`. Summary below.
- The workflow needs `contents: read`, `issues: write`, `pull-requests: write` (the calling job grants them to the reusable workflow, `permissions: {}` at the top).
- Secrets are passed explicitly (`GH_PAT` required, `PROJECT_TOKEN` optional), not `secrets: inherit`. Without `GH_PAT` the workflow falls back to `github.token`: a PAT is needed so PRs created by CI trigger the required checks; labelling works with `github.token`.
- Project status: the project status and Needs calls need a classic PAT with scope `project` in secret `PROJECT_TOKEN`, else `GH_PAT`. A fine-grained token does not work for a user-owned project: its `Projects` permission exists only under organization permissions, there is none under account permissions, so every project call fails with `Resource not accessible by personal access token` (the workflow then emits one warning and stops). Only an organization-owned project accepts a fine-grained token (resource owner the organization, Projects: read and write). The token also needs read access to the repository (pull requests and issues) besides scope `project`; a fallback `GH_PAT` that already serves the release PR has it. Without it the job sets only the label and emits a warning. Issues without a project entry or already `Done`/`In release` are skipped; failures per issue are warnings and never fail the job.
- The action is used `@main`, so fixes arrive centrally without touching the repos.

## Known limit

The release PR step of the reusable `release-branch.yml` (`versioning/release-pr`) accepts only `release/<x.y>` and ignores `release/next` (GravionLabs/ci#55). The labelling step is a separate action and is not affected. Checked 2026-10-26: GravionLabs/ci#55 is OPEN (current state: `gh issue view 55 -R GravionLabs/ci --json state`). The status is set by `mark-merged-issues` and independent of the release PR step.
