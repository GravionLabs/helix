# Paginator

`hx-paginator` is the page navigation of a list or table: first, previous, a window of page links, next, last,
and an optional rows-per-page [select](select.md). It is a `nav` landmark; the current page link has
`aria-current="page"`.

```html
<hx-paginator [rows]="10" [totalRecords]="120" [(first)]="first" [rowsPerPageOptions]="[10, 20, 50]"
  showCurrentPageReport (pageChange)="load($event)" />
```

`first` is the index of the first record shown (so the page is `first / rows`); a change of the rows per page keeps
the first record on screen.

## Inputs and outputs

| Name | Type | Default | |
| --- | --- | --- | --- |
| `rows` (model) | `number` | `10` | Records per page. |
| `totalRecords` | `number` | `0` | Number of records in all. |
| `first` (model) | `number` | `0` | Index of the first record shown (0-based). |
| `rowsPerPageOptions` | `number[]` | none | Shows the rows-per-page select. |
| `pageLinkSize` | `number` | `5` | Page links shown at most; the current page stays in the middle. |
| `showCurrentPageReport` | `boolean` | `false` | Shows `currentPageReportTemplate` (polite live region). |
| `currentPageReportTemplate` | `string` | `'{first} - {last} of {totalRecords}'` | Also `{page}` and `{pageCount}`. |
| `showFirstLastButtons` | `boolean` | `true` | The first and last page buttons. |
| `ariaLabel`, `firstPageLabel`, `previousPageLabel`, `nextPageLabel`, `lastPageLabel`, `pageLabelTemplate`, `rowsPerPageLabel` | `string` | English | The labels, for translation (`pageLabelTemplate` replaces `{page}`). |
| `pageChange` | `HxPageEvent` | | `{ first, rows, page, pageCount }` after a user change. |

`goTo(page)` (0-based, clamped) is public for a template reference.

## Accessibility

A `nav` with `aria-label`; every button has an accessible name ("First page", "Page 3", …); the current page link has
`aria-current="page"`; first/previous are disabled on the first page and next/last on the last. All controls are native
buttons, so Tab, Enter and Space work as usual.

## Tokens

The look comes from the design tokens `--h-paginator-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
