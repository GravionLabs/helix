# /roadmap

Plans the releases: assigns the open Epics, Features, PBIs and Bugs to `M<n>` milestones and keeps `ROADMAP.md`. Nothing is set or written without your approval.

## Usage

```
/roadmap
/roadmap help
```

## Arguments and flags

- nothing: read the open work, propose the milestone table, ask the open decisions, set the milestones after approval, then show the `ROADMAP.md` diff and write it after approval.
- `help` (also `--help`, `-h`): print this text.

Proposal rules: the blocked-by order decides (a blocker lands in the same or an earlier milestone), children follow their parent, release capacity is filled by size. Existing open `M<n>` come first; a new one (`M4 (new)`) only when they are full. Open decisions go to `grill-me`.

Milestones are the releases (`M<n>`, `M<n> (x.y.z)` once released, legacy `x.y.z` stays valid). `roadmap` never renames or closes one; that is `github-milestone`. Generated parts of `ROADMAP.md` sit between `roadmap:begin` and `roadmap:end` markers; text outside is yours and never changed.

## Examples

```
/roadmap
/roadmap help
```

## Config

none

## See also

- `github-milestone`, which creates and closes the milestones
- `planner`, which creates the Epics, Features and PBIs that are assigned
- `deliver`, which delivers a milestone
- `grill-me`, which asks the open decisions
