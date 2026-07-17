# Paginator

> Paginator is a generic component to display content in paged format.

## Import

```ts
import { Paginator } from '@gravionlabs/helix/paginator';
```

## Components

### Paginator

Selector: `h-paginator`

Paginator is a generic component to display content in paged format.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pageLinkSize` | `number` | `5` | Number of page links to display. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `alwaysShow` | `boolean` | `true` | Whether to show it even there is only one page. |
| `dropdownAppendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| string \| null \| undefined \| any` | — | Target element to attach the dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `templateLeft` | `TemplateRef&lt;PaginatorTemplateContext&gt; \| undefined` | — | Template instance to inject into the left side of the paginator. |
| `templateRight` | `TemplateRef&lt;PaginatorTemplateContext&gt; \| undefined` | — | Template instance to inject into the right side of the paginator. |
| `dropdownScrollHeight` | `string` | `'200px'` | Dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `currentPageReportTemplate` | `string` | `'{currentPage} of {totalPages}'` | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| `showCurrentPageReport` | `boolean \| undefined` | — | Whether to display current page report. |
| `showFirstLastIcon` | `boolean` | `true` | When enabled, icons are displayed on paginator to go first and last page. |
| `totalRecords` | `number` | `0` | Number of total records. |
| `rows` | `number` | `0` | Data count to display per page. |
| `rowsPerPageOptions` | `any[] \| undefined` | — | Array of integer/object values to display inside rows per page dropdown. A object that have 'showAll' key can be added to it to show all data. Exp; [10,20,30,{showAll:'All'}] |
| `showJumpToPageDropdown` | `boolean \| undefined` | — | Whether to display a dropdown to navigate to any page. |
| `showJumpToPageInput` | `boolean \| undefined` | — | Whether to display a input to navigate to any page. |
| `jumpToPageItemTemplate` | `TemplateRef&lt;PaginatorDropdownItemTemplateContext&gt; \| undefined` | — | Template instance to inject into the jump to page dropdown item inside in the paginator. |
| `showPageLinks` | `boolean` | `true` | Whether to show page links. |
| `locale` | `string \| undefined` | — | Locale to be used in formatting. |
| `dropdownItemTemplate` | `TemplateRef&lt;PaginatorDropdownItemTemplateContext&gt; \| undefined` | — | Template instance to inject into the rows per page dropdown item inside in the paginator. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onPageChange` | `EventEmitter&lt;PaginatorState&gt;` | Callback to invoke when page changes, the event object contains information about the new state. |

## Source

[`projects/helix/paginator`](../../projects/helix/paginator)
