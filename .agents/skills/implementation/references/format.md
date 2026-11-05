# Format changed files

`scripts/Format-Changed.ps1` formats (or checks) the changed files of a change. For `ts`, `ng`, `py`, `dotnet`, `rust` and `go` it knows the default commands; a `-Language` call needs no further parameters. The `## Format` section of each `<lang>-implementation` skill names the extensions and commands.

Without `-Language`, `-Extensions` and `-Command` the script detects the formatter: the changed files are grouped by extension (`.ts .tsx .js .jsx .mjs .cjs .json .css .html` ts, `.py` py, `.cs .csproj .sln .slnx` dotnet, `.rs` rust, `.go` go), each detected language runs its defaults (a `format.<lang>` entry still replaces them), other extensions are ignored. `-WhatIf` lists the steps of every detected language.

```powershell
pwsh scripts/Format-Changed.ps1                      # detect from the changed files
pwsh scripts/Format-Changed.ps1 -Language ts
pwsh scripts/Format-Changed.ps1 -Language ts -Check
pwsh scripts/Format-Changed.ps1 -Extensions .ts,.tsx -Command 'npx prettier --write {files}'   # any other tool
```

Defaults, in order: ts/ng prettier then eslint (ts prettier on `.ts .tsx .js .mjs .cjs .jsx .json .css .html`, eslint on `.ts .tsx .js .mjs .cjs .jsx`; ng prettier on `.ts .tsx .js .mjs .cjs .json .html .scss .css`, eslint on `.ts .tsx .js .mjs .cjs`), or in a Biome project (`biome.json`/`biome.jsonc` at the git toplevel) `npx biome check --write --no-errors-on-unmatched {files}` alone on the prettier extensions of the language plus `.md .yml .yaml` (the flag keeps a file outside `files.includes` from failing; probe `npx --no-install biome --version`), py `uv run ruff format` then `uv run ruff check --fix`, dotnet `dotnet format --include`, rust `cargo fmt -- {files}`, go `gofmt -w {files}` (check `gofmt -l {files}`, no probe: a missing `gofmt` is `skipped: gofmt not found`). `-Check` runs the read-only variants. Precedence: `.agents/config.json` entry `format.<lang>`, then explicit `-Extensions`/`-Command`, then these defaults.

Not configured: a tool that is missing or whose `-Requires` probe fails is skipped with `skipped: <tool> not configured` (`ruff`, `prettier`, `eslint`, `biome`, `dotnet`, `cargo`); note it in the report. A tool configured in `.agents/config.json` that is missing is an error. The config and a JetBrains example (`jb cleanupcode`): https://github.com/GravionLabs/skills/blob/main/docs/usage/project-config.md.

## Parameters

| Parameter     | Meaning                                                                                                                                                                                                     |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-Language`   | Key into `format` of `.agents/config.json` and into the built-in defaults (`ts`, `ng`, `py`, `dotnet`, `rust`, `go`). With an entry or a default, `-Extensions`/`-Command` become optional.                 |
| `-Extensions` | Extensions to keep (`.ts`, `.tsx`; comma-separated string or array; the dot is optional).                                                                                                                   |
| `-Command`    | Command line with a `{files}` placeholder (files appended when absent). Each file is its own argument, repo-relative; never `.` or a directory.                                                             |
| `-Requires`   | Optional probe command that must exit 0 (e.g. `npx --no-install prettier --version`); otherwise `skipped: <tool> not configured`, exit 0. Makes "tool not configured" skip even behind `npx`/`uv`/`dotnet`. |
| `-Check`      | Read-only intent: the command is the check command; success prints `checked`.                                                                                                                               |
| `-WhatIf`     | Prints the resolved steps as JSON (`tool`, `extensions`, `requires`, `commands`; `-Check` selects the check commands) and runs nothing.                                                                     |
| `-Base <ref>` | Also include files changed in `<ref>...HEAD`. Default: uncommitted changes only (staged, unstaged, untracked). Deleted files are dropped.                                                                   |

## Outcomes

| Situation                                                                                                                                | stdout                                                                                        | Exit          |
| :--------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :------------ |
| No changed file with a listed extension (or only other extensions)                                                                       | `skipped: no changed files`                                                                   | 0             |
| `-Requires` probe fails                                                                                                                  | `skipped: <tool> not configured`                                                              | 0             |
| First token of `-Command` not found                                                                                                      | `skipped: <tool> not found` (note it in the report)                                           | 0             |
| `-Base` ref invalid or git fails                                                                                                         | git's error on stderr                                                                         | non-zero      |
| Override tool not found                                                                                                                  | stderr `error: <tool> not found (configured in .agents/config.json for <lang>)`, nothing runs | 1             |
| `.agents/config.json` (or the legacy `.agents/format.json`) invalid JSON, unknown top-level key, or entry lacks the `format`/`check` key | stderr error naming file (and language, key)                                                  | 1             |
| `"format": false` in `.agents/config.json` (with `-Language`)                                                                            | `skipped: disabled`                                                                           | 0             |
| Command fails                                                                                                                            | its stderr passes through                                                                     | its exit code |
| Not a git repository                                                                                                                     | `skipped: not a git repository`                                                               | 0             |
| Success                                                                                                                                  | `formatted: <n> files` / `checked: <n> files`                                                 | 0             |

## Override (.agents/config.json)

With `-Language <lang>` the script reads `<git toplevel>/.agents/config.json`, key `format` (schema: `schema/config.schema.json`, unknown top-level keys are an error):

```json
{
  "format": {
    "dotnet": {
      "extensions": [".cs"],
      "format": "jb cleanupcode {files}",
      "check": ["jb inspectcode {files}", "jb chk"]
    }
  }
}
```

- `"format": false` skips every format and check call: `skipped: disabled`, exit 0. No `format` key, or no entry for `<lang>`: the defaults apply.
- The legacy `.agents/format.json` (the map without the `format` wrapper) still works when `config.json` has no `format` key, with a deprecation notice on stderr; when both exist `config.json` wins and the notice says so.

- An entry for `<lang>` replaces all default commands of the language (and `-Requires`); `extensions` replace `-Extensions` (absent: `-Extensions` stays). `-Check` selects `check`, otherwise `format`; each is a string or an array run in order on the same file list, the first non-zero exit stops.
- `{files}` as its own token expands to one argument per file; inside a token (`--include={files}`) the files are joined by `;`.
- The override ignores `-Command`/`-Requires`, so every call with the same `-Language` and mode runs the same override commands again. A skill with several calls (e.g. prettier + eslint) therefore repeats them; make the override commands idempotent, or call the script once per mode with `-Language` only.
- The script prints `notice: running commands from .agents/config.json` on stderr: the file is repo-controlled, review it like code.
- A tool configured there that is missing is an error, never a skip, even when no file changed. A missing mode key is an error too (no fallback to `-Command`).
- No entry for `<lang>`, other entries, or no `-Language`: the file is ignored and `-Extensions`/`-Command` apply (both then required).

## From a `## Format` section

The section names the extensions, the format command and the check command. Run `Format-Changed.ps1 -Language <lang>` after green tests and before the commit; the check command (with `-Check`) is what CI or the caller runs read-only.
