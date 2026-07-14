# OrderList

> OrderList is used to manage the order of a collection.

## Import

```ts
import { OrderList } from '@gravionlabs/helix/orderlist';
```

## Components

### OrderList

Selector: `h-orderList, h-orderlist, h-order-list`

OrderList is used to manage the order of a collection.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string \| undefined` | — | Text for the caption. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that labels the input field. |
| `listStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the list element. |
| `responsive` | `boolean \| undefined` | — | A boolean value that indicates whether the component should be responsive. |
| `filterBy` | `string \| undefined` | — | When specified displays an input field to filter the items on keyup and decides which fields to search against. |
| `filterPlaceholder` | `string \| undefined` | — | Placeholder of the filter input. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `metaKeySelection` | `boolean` | `false` | When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| `dragdrop` | `boolean` | `false` | Whether to enable dragdrop based reordering. |
| `controlsPosition` | `'left' \| 'right'` | `'left'` | Defines the location of the buttons with respect to the list. |
| `ariaFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input. |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in' \| 'lt' \| 'lte' \| 'gt' \| 'gte'` | `'contains'` | Defines how the items are filtered. |
| `breakpoint` | `string` | `'960px'` | Indicates the width of the screen at which the component should change its behavior. |
| `stripedRows` | `boolean \| undefined` | — | Whether to displays rows with alternating colors. |
| `disabled` | `boolean` | — | When present, it specifies that the component should be disabled. |
| `trackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. |
| `scrollHeight` | `unknown` | `'14rem'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `autoOptionFocus` | `boolean` | `true` | Whether to focus on the first visible or selected element. |
| `dataKey` | `string \| undefined` | — | Name of the field that uniquely identifies the record in the data. |
| `buttonProps` | `ButtonProps` | `{ severity: 'secondary' }` | Used to pass all properties of the ButtonProps to the Button component. |
| `moveUpButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move up button inside the component. |
| `moveTopButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move top button inside the component. |
| `moveDownButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move down button inside the component. |
| `moveBottomButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move bottom button inside the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `selectionChange` | `EventEmitter&lt;any&gt;` | Callback to invoke on selection change. |
| `onReorder` | `EventEmitter&lt;any&gt;` | Callback to invoke when list is reordered. |
| `onSelectionChange` | `EventEmitter&lt;OrderListSelectionChangeEvent&gt;` | Callback to invoke when selection changes. |
| `onFilterEvent` | `EventEmitter&lt;OrderListFilterEvent&gt;` | Callback to invoke when filtering occurs. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list is focused |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list is blurred |

## Source

[`projects/helix/orderlist`](../../projects/helix/orderlist)
