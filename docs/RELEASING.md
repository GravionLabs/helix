# Releasing

`CI / Publish` runs on every push to `main` and publishes `ui`, `shell`, `zod`, `ag-grid` and `desktop`
with `scripts/publish-packages.mjs`. A package whose version is already on npm is skipped, so a run that
failed half-way is repaired by re-running the job: the rest is published and the Release job tags the
commit and creates the GitHub Release. Any other npm error still fails the job.

## Adding a package

Do this on npmjs.com **before** the first merge to `main` that contains the package, or its publish
fails with `E404 … you do not have permission`:

1. Create the package (a first manual `npm publish --access public` by an org owner) or grant the CI
   access to the scope.
2. Settings → Trusted Publisher → GitHub Actions → owner `GravionLabs`, repo `helix`, workflow `ci.yml`.
3. Add its directory to the lists in `.github/workflows/ci.yml` (Set package versions, Publish packages).
