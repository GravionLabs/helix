# DataView

> DataView displays data in grid or list layout with pagination and sorting features.

## Import

```ts
import { DataView } from '@gravionlabs/helix/dataview';
```

## Components

### DataView

Selector: `h-dataView, h-dataview, h-data-view`

DataView displays data in grid or list layout with pagination and sorting features.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `paginator` | `boolean \| undefined` | — | When specified as true, enables the pagination. |
| `rows` | `number \| undefined` | — | Number of rows to display per page. |
| `totalRecords` | `number \| undefined` | — | Number of total records, defaults to length of value when not defined. |
| `pageLinks` | `number` | `5` | Number of page links to display in paginator. |
| `rowsPerPageOptions` | `number[] \| any[] \| undefined` | — | Array of integer/object values to display inside rows per page dropdown of paginator |
| `paginatorPosition` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Position of the paginator. |
| `paginatorStyleClass` | `string \| undefined` | — | Custom style class for paginator |
| `alwaysShowPaginator` | `boolean` | `true` | Whether to show it even there is only one page. |
| `paginatorDropdownAppendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| string \| null \| undefined \| any` | — | Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `paginatorDropdownScrollHeight` | `string` | `'200px'` | Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `currentPageReportTemplate` | `string` | `'{currentPage} of {totalPages}'` | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| `showCurrentPageReport` | `boolean \| undefined` | — | Whether to display current page report. |
| `showJumpToPageDropdown` | `boolean \| undefined` | — | Whether to display a dropdown to navigate to any page. |
| `showFirstLastIcon` | `boolean` | `true` | When enabled, icons are displayed on paginator to go first and last page. |
| `showPageLinks` | `boolean` | `true` | Whether to show page links. |
| `lazy` | `boolean \| undefined` | — | Defines if data is loaded and interacted with in lazy manner. |
| `lazyLoadOnInit` | `boolean` | `true` | Whether to call lazy loading on initialization. |
| `emptyMessage` | `string` | `''` | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `gridStyleClass` | `string` | `''` | Style class of the grid. |
| `trackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. |
| `filterBy` | `string \| undefined` | — | Comma separated list of fields in the object graph to search against. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `loading` | `boolean \| undefined` | — | Displays a loader to indicate data load is in progress. |
| `loadingIcon` | `string \| undefined` | — | The icon to show while indicating data load is in progress. |
| `first` | `number \| undefined` | `0` | Index of the first row to be displayed. |
| `sortField` | `string \| undefined` | — | Property name of data to use in sorting by default. |
| `sortOrder` | `number \| undefined` | — | Order to sort the data by default. |
| `value` | `any[] \| undefined` | — | An array of objects to display. |
| `layout` | `'list' \| 'grid'` | `'list'` | Defines the layout mode. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onLazyLoad` | `EventEmitter&lt;DataViewLazyLoadEvent&gt;` | Callback to invoke when paging, sorting or filtering happens in lazy mode. |
| `onPage` | `EventEmitter&lt;DataViewPageEvent&gt;` | Callback to invoke when pagination occurs. |
| `onSort` | `EventEmitter&lt;DataViewSortEvent&gt;` | Callback to invoke when sorting occurs. |
| `onChangeLayout` | `EventEmitter&lt;DataViewLayoutChangeEvent&gt;` | Callback to invoke when changing layout. |

## Source

[`projects/helix/dataview`](../../projects/helix/dataview)
