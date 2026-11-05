# Superseding an ADR

1. `pwsh scripts/New-Adr.ps1 -Title "<new title>" -Supersedes <nnnn>`: the new file gets `- Supersedes: [ADR nnnn](<old file>)`; the script prints the new and the old path. It never edits the old file.
2. Edit the old ADR's Status by hand, with the scope:
   - whole: `Status: Superseded by [ADR mmmm](<new file>)`
   - in part: `Status: Accepted; <what> superseded in part by [ADR mmmm](<new file>)` (elysion often supersedes in part, for example ADR 0020 of elysion)
3. Keep the old file and its content; only the Status line changes.
4. Several ADRs superseded: run once, add further `Supersedes:` lines to the new file by hand.
