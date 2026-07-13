#!/usr/bin/env bash
# Release reset for epic #201 / task #225.
#
# Deletes ALL GitHub releases, all v* tags, and all GitHub Packages
# npm packages (helix, helix-shell, helix-zod, helix-ag-grid) so that
# GitVersion (next-version: 1.0.0) mints a fresh v1.0.0 on the next
# main build — the first publish of the reborn @gravionlabs/helix.
#
# Run AFTER the final epic/201-primeng-fork -> main merge and BEFORE
# the next main CI run, in a quiet window (the script refuses to run
# while workflow runs are in progress).
#
# Requirements:
#   - gh CLI authenticated as GravionLabs (or with an admin PAT via
#     GH_TOKEN) carrying scopes: repo, read:packages, delete:packages
#
# Usage:
#   ./scripts/release-reset.sh            # dry run: list what would be deleted
#   ./scripts/release-reset.sh --execute  # actually delete

set -euo pipefail

REPO="GravionLabs/helix"
OWNER="GravionLabs" # user account, not an org -> users/... API paths
PACKAGES=(helix helix-shell helix-zod helix-ag-grid)

EXECUTE=false
if [[ "${1:-}" == "--execute" ]]; then
  EXECUTE=true
elif [[ -n "${1:-}" ]]; then
  echo "Unknown argument: $1 (only --execute is supported)" >&2
  exit 2
fi

say() { printf '%s\n' "$*"; }

# --- preflight -------------------------------------------------------------

say "== Preflight =="

login=$(gh api user --jq .login)
say "Authenticated as: $login"

scopes=$(gh api -i user 2>/dev/null | tr -d '\r' | sed -n 's/^X-Oauth-Scopes: //Ip')
say "Token scopes: ${scopes:-<none reported>}"
if $EXECUTE && [[ "$scopes" != *delete:packages* ]]; then
  say "ERROR: token lacks the delete:packages scope; package deletion would fail."
  say "Re-auth with: gh auth refresh -s delete:packages -s read:packages"
  exit 1
fi

in_progress=$(gh run list --repo "$REPO" --limit 50 \
  --json status --jq '[.[] | select(.status != "completed")] | length')
if [[ "$in_progress" != "0" ]]; then
  say "ERROR: $in_progress workflow run(s) not completed — wait for a quiet window."
  $EXECUTE && exit 1
fi

# --- inventory -------------------------------------------------------------

say ""
say "== Inventory =="

mapfile -t releases < <(gh release list --repo "$REPO" --limit 200 \
  --json tagName --jq '.[].tagName')
say "Releases (${#releases[@]}): ${releases[*]:-<none>}"

mapfile -t tags < <(gh api "repos/$REPO/git/matching-refs/tags/v" \
  --jq '.[].ref | sub("^refs/tags/"; "")')
say "v* tags (${#tags[@]}): ${tags[*]:-<none>}"

declare -A pkg_versions
for pkg in "${PACKAGES[@]}"; do
  count=$(gh api "users/$OWNER/packages/npm/$pkg" --jq .version_count 2>/dev/null || echo "absent")
  pkg_versions[$pkg]=$count
  say "Package @gravionlabs/$pkg: $count version(s)"
done

if ! $EXECUTE; then
  say ""
  say "DRY RUN — nothing deleted. Re-run with --execute to perform the reset."
  exit 0
fi

# --- confirmation ----------------------------------------------------------

say ""
say "!! This permanently deletes everything listed above from $REPO / $OWNER."
read -r -p "Type 'reset' to proceed: " answer
[[ "$answer" == "reset" ]] || { say "Aborted."; exit 1; }

# --- 1. releases -----------------------------------------------------------

say ""
say "== Deleting releases =="
for tag in "${releases[@]}"; do
  gh release delete "$tag" --repo "$REPO" --yes
  say "deleted release $tag"
done

# --- 2. tags ---------------------------------------------------------------

say ""
say "== Deleting v* tags =="
for tag in "${tags[@]}"; do
  gh api -X DELETE "repos/$REPO/git/refs/tags/$tag" >/dev/null
  say "deleted tag $tag"
done

# --- 3. packages -----------------------------------------------------------

say ""
say "== Deleting packages =="
for pkg in "${PACKAGES[@]}"; do
  if [[ "${pkg_versions[$pkg]}" == "absent" ]]; then
    say "skipping @gravionlabs/$pkg (not found)"
    continue
  fi
  gh api -X DELETE "users/$OWNER/packages/npm/$pkg" >/dev/null
  say "deleted package @gravionlabs/$pkg (all ${pkg_versions[$pkg]} versions)"
done

# --- done ------------------------------------------------------------------

say ""
say "== Reset complete =="
say "GitVersion next-version is 1.0.0 — the next push to main builds, tags,"
say "and publishes v1.0.0 of all four packages, including the PrimeNG fork."
say "Verify afterwards with:"
say "  gh release list --repo $REPO"
say "  gh api repos/$REPO/git/matching-refs/tags/v --jq length"
