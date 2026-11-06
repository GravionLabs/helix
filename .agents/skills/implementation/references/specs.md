# Spec rules

Loaded when `governance.specMap` exists in `.agents/config.json`. `specMap` maps globs of code to the spec file that describes them; `specDir` is the folder of the specs.

## What counts as a spec change

- Public API: endpoints, routes, messages, exported contracts.
- Configuration: settings, environment variables, flags.
- Behavior visible to another service or the user.

Not a spec change: refactorings, tests, internal renames.

## Rules

- When a changed file matches a `specMap` glob and the change is a spec change, update the spec file in the same commit as the code.
- A glob matches but the spec needs no change: add `no spec change needed: <spec file> — <reason>` to `notes[]` of the implementer result (exact wording; CI looks for it and `deliver` passes it on).
- `specMode` does not change what implementation does; it only decides warn or fail in CI and `code-review`.

## New service

A new top-level folder like `apps/<name>` that no `specMap` glob matches is a new service. In the same commit:

1. create `<specDir>/<name>.md` from `templates/spec.md`
2. add the `specMap` entry `<folder>/**` → that file to `.agents/config.json`

Without the entry CI never checks the new service.
