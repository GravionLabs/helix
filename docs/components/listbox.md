# Listbox

> ListBox is used to select one or more values from a list of items.

## Import

```ts
import { Listbox } from '@gravionlabs/helix/listbox';
```

## Components

### Listbox

Selector: `h-listbox, h-listBox, h-list-box`

ListBox is used to select one or more values from a list of items.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `any` | `''` | — |
| `id` | `string \| undefined` | — | Unique identifier of the component. |
| `searchMessage` | `string \| undefined` | — | Text to display when the search is active. Defaults to global value in i18n translation configuration. |
| `emptySelectionMessage` | `string \| undefined` | — | Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration. |
| `selectionMessage` | `string \| undefined` | — | Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration. |
| `autoOptionFocus` | `boolean \| undefined` | `true` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `selectOnFocus` | `boolean \| undefined` | — | When enabled, the focused option is selected. |
| `searchLocale` | `boolean \| undefined` | — | Locale to use in searching. The default locale is the host environment's current locale. |
| `focusOnHover` | `boolean \| undefined` | `true` | When enabled, the hovered option will be focused. |
| `filterMessage` | `string \| undefined` | — | Text to display when filtering. |
| `filterFields` | `any[] \| undefined` | — | Fields used when filtering the options, defaults to optionLabel. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `scrollHeight` | `string` | `'14rem'` | Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `multiple` | `boolean \| undefined` | — | When specified, allows selecting multiple values. |
| `styleClass` | `string \| undefined` | — | Style class of the container. |
| `listStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the list element. |
| `listStyleClass` | `string \| undefined` | — | Style class of the list element. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the element value cannot be changed. |
| `checkbox` | `boolean` | `false` | When specified, allows selecting items with checkboxes. |
| `filter` | `boolean` | `false` | When specified, displays a filter input at header. |
| `filterBy` | `string \| undefined` | — | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in' \| 'lt' \| 'lte' \| 'gt' \| 'gte' \| string` | `'contains'` | Defines how the items are filtered. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `metaKeySelection` | `boolean` | `false` | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a value in options. |
| `showToggleAll` | `boolean` | `true` | Whether header checkbox is shown in multiple mode. |
| `optionLabel` | `string \| undefined` | — | Name of the label field of an option. |
| `optionValue` | `string \| undefined` | — | Name of the value field of an option. |
| `optionGroupChildren` | `string \| undefined` | `'items'` | Name of the options field of an option group. |
| `optionGroupLabel` | `string \| undefined` | `'label'` | Name of the label field of an option group. |
| `optionDisabled` | `string \| ((item: any) =&gt; boolean) \| undefined` | — | Name of the disabled field of an option or function to determine disabled state. |
| `ariaFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input. |
| `filterPlaceHolder` | `string \| undefined` | — | Defines placeholder of the filter input. |
| `emptyFilterMessage` | `string \| undefined` | — | Text to display when filtering does not return any results. |
| `emptyMessage` | `string \| undefined` | — | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `group` | `boolean \| undefined` | — | Whether to display options as grouped when nested options are provided. |
| `striped` | `boolean \| undefined` | `false` | Whether to displays rows with alternating colors. |
| `highlightOnSelect` | `boolean` | `true` | Whether the selected option will be add highlight class. |
| `checkmark` | `boolean` | `false` | Whether the selected option will be shown with a check mark. |
| `dragdrop` | `boolean` | `false` | Whether to enable dragdrop based reordering. |
| `dropListData` | `any[] \| undefined` | — | Array to use for CDK drop list data binding. When not provided, uses options array. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;ListboxChangeEvent&gt;` | Callback to invoke on value change. |
| `onClick` | `EventEmitter&lt;ListboxClickEvent&gt;` | Callback to invoke when option is clicked. |
| `onDblClick` | `EventEmitter&lt;ListboxDoubleClickEvent&gt;` | Callback to invoke when option is double clicked. |
| `onFilter` | `EventEmitter&lt;ListboxFilterEvent&gt;` | Callback to invoke when data is filtered. |
| `onFocus` | `EventEmitter&lt;FocusEvent&gt;` | Callback to invoke when component receives focus. |
| `onBlur` | `EventEmitter&lt;FocusEvent&gt;` | Callback to invoke when component loses focus. |
| `onSelectAllChange` | `EventEmitter&lt;ListboxSelectAllChangeEvent&gt;` | Callback to invoke when all data is selected. |
| `onLazyLoad` | `EventEmitter&lt;ScrollerLazyLoadEvent&gt;` | Emits on lazy load. |
| `onDrop` | `EventEmitter&lt;CdkDragDrop&lt;string[]&gt;&gt;` | Emits on item is dropped. |

## Source

[`projects/helix/listbox`](../../projects/helix/listbox)
