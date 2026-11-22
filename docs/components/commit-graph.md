# Commit graph

`hx-commit-graph` from `@gravionlabs/helix-code/git` shows a history as rows: the graph on the left (SVG), then ref labels, the message, the author and the time. The user selects a commit. It needs no CodeMirror: the `/git` entry imports nothing from `@codemirror/*` or `@lezer/*`. It lays the commits out with `hxLayoutCommits`.

```html
<hx-commit-graph aria-label="History" [commits]="commits" [selected]="id" (selectedChange)="id = $event" />
```

```ts
import { HxCommitGraph, HxCommitGraphRowCell, type HxCommit } from '@gravionlabs/helix-code/git';
```

The commits come in the order of `git log --topo-order` (a commit before its parents). Virtual scrolling and paging are not part of this component yet.

## Inputs and output

| Name                            | Type                       | Description                                                                   |
| ------------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| `commits` (required)            | `readonly HxCommit[]`      | The commits.                                                                  |
| `selected`                      | `string \| null`           | The id of the selected commit.                                                |
| `selectedChange`                | output `string`            | The id the user selects (click, arrow keys, Home, End, Enter or Space).       |
| `maxLanes`                      | `number` (default 12)      | Maximum width of the graph in lanes. Lanes from `maxLanes - 1` on are folded. |
| `formatTime`                    | `(secs: number) => string` | Formats Unix seconds. Default: relative ("5 min ago"), a date from 30 days.   |
| `aria-label`, `aria-labelledby` | `string`                   | The accessible name of the list.                                              |

## Rows

A dot sits on the commit's lane; lines run per segment and curve where a line changes lanes. A merge commit (two or more parents) has a larger dot with a hollow center. Refs show as labels before the message: a branch is a filled outline, a remote branch is dashed, a tag has square corners and HEAD is bold. The message is the first line, cut off with the full text as tooltip.

Lanes at index `maxLanes - 1` and beyond are folded: their dots and segments are drawn in lane `maxLanes - 1`, in the line color of that lane.

## Colors

The lane colors are the CSS variables `--hx-graph-lane-1` to `--hx-graph-lane-8`. `commit-graph.scss` sets defaults on `:host` for light and, under `.app-dark`, for dark; each has at least 3:1 contrast against the content background (`#ffffff` and `#1b1b1f`). Override them on the component or an ancestor.

## Keyboard

The list is a `listbox` with `aria-activedescendant`; each row is an `option` named "message, author, time". Arrow up and down move the selection, Home and End jump to the first and last commit.

## Row cell

`<ng-template hxCommitGraphRowCell>` renders content at the end of each row. `let-commit` is the `HxCommit`, `let-row="row"` its `HxGraphRow`.

```html
<hx-commit-graph [commits]="commits">
  <ng-template hxCommitGraphRowCell let-commit let-row="row">
    <button type="button" (click)="copy(commit.id)">Copy id</button>
  </ng-template>
</hx-commit-graph>
```
