# PickList

> PickList is used to reorder items between different lists.

## Import

```ts
import { PickList } from '@gravionlabs/helix/picklist';
```

## Components

### PickList

Selector: `h-pickList, h-picklist, h-pick-list`

PickList is used to reorder items between different lists.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `any` | `''` | — |
| `source` | `any[]` | `[]` | An array of objects for the source list. |
| `target` | `any[]` | `[]` | An array of objects for the target list. |
| `dataKey` | `string \| undefined` | — | Name of the field that uniquely identifies the options. |
| `sourceHeader` | `string \| undefined` | — | Text for the source list caption |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `rightButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to right button for accessibility. |
| `leftButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to left button for accessibility. |
| `allRightButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to all right button for accessibility. |
| `allLeftButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to all left button for accessibility. |
| `upButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to up button for accessibility. |
| `downButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to down button for accessibility. |
| `topButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to top button for accessibility. |
| `bottomButtonAriaLabel` | `string \| undefined` | — | Defines a string that labels the move to bottom button for accessibility. |
| `sourceAriaLabel` | `string \| undefined` | — | Defines a string that labels the source list. |
| `targetAriaLabel` | `string \| undefined` | — | Defines a string that labels the target list. |
| `targetHeader` | `string \| undefined` | — | Text for the target list caption |
| `responsive` | `boolean \| undefined` | — | When enabled orderlist adjusts its controls based on screen size. |
| `filterBy` | `string \| undefined` | — | When specified displays an input field to filter the items on keyup and decides which field to search (Accepts multiple fields with a comma). |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `trackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. Use sourceTrackBy or targetTrackBy in case different algorithms are needed per list. |
| `sourceTrackBy` | `Function \| undefined` | — | Function to optimize the dom operations by delegating to ngForTrackBy in source list, default algorithm checks for object identity. |
| `targetTrackBy` | `Function \| undefined` | — | Function to optimize the dom operations by delegating to ngForTrackBy in target list, default algorithm checks for object identity. |
| `showSourceFilter` | `boolean` | `true` | Whether to show filter input for source list when filterBy is enabled. |
| `showTargetFilter` | `boolean` | `true` | Whether to show filter input for target list when filterBy is enabled. |
| `metaKeySelection` | `boolean` | `false` | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically. |
| `dragdrop` | `boolean` | `false` | Whether to enable dragdrop based reordering. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `sourceStyle` | `any` | — | Inline style of the source list element. |
| `targetStyle` | `any` | — | Inline style of the target list element. |
| `showSourceControls` | `boolean` | `true` | Whether to show buttons of source list. |
| `showTargetControls` | `boolean` | `true` | Whether to show buttons of target list. |
| `sourceFilterPlaceholder` | `string \| undefined` | — | Placeholder text on source filter input. |
| `targetFilterPlaceholder` | `string \| undefined` | — | Placeholder text on target filter input. |
| `disabled` | `boolean` | — | When present, it specifies that the component should be disabled. |
| `sourceOptionDisabled` | `string \| ((item: any) =&gt; boolean) \| undefined` | — | Name of the disabled field of a target option or function to determine disabled state. |
| `targetOptionDisabled` | `string \| ((item: any) =&gt; boolean) \| undefined` | — | Name of the disabled field of a target option or function to determine disabled state. |
| `ariaSourceFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input of source list. |
| `ariaTargetFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input of target list. |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in' \| 'lt' \| 'lte' \| 'gt' \| 'gte' \| string` | `'contains'` | Defines how the items are filtered. |
| `stripedRows` | `boolean \| undefined` | — | Whether to displays rows with alternating colors. |
| `keepSelection` | `boolean` | `false` | Keeps selection on the transfer list. |
| `scrollHeight` | `string` | `'14rem'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `autoOptionFocus` | `boolean` | `true` | Whether to focus on the first visible or selected element. |
| `buttonProps` | `ButtonProps` | `{ severity: 'secondary' }` | Used to pass all properties of the ButtonProps to the Button component. |
| `moveUpButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move up button inside the component. |
| `moveTopButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move top button inside the component. |
| `moveDownButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move down button inside the component. |
| `moveBottomButtonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move bottom button inside the component. |
| `moveToTargetProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move to target button inside the component. |
| `moveAllToTargetProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move all to target button inside the component. |
| `moveToSourceProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move to source button inside the component. |
| `moveAllToSourceProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the move all to source button inside the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onMoveToSource` | `EventEmitter&lt;PickListMoveToSourceEvent&gt;` | Callback to invoke when items are moved from target to source. |
| `onMoveAllToSource` | `EventEmitter&lt;PickListMoveAllToSourceEvent&gt;` | Callback to invoke when all items are moved from target to source. |
| `onMoveAllToTarget` | `EventEmitter&lt;PickListMoveAllToTargetEvent&gt;` | Callback to invoke when all items are moved from source to target. |
| `onMoveToTarget` | `EventEmitter&lt;PickListMoveToTargetEvent&gt;` | Callback to invoke when items are moved from source to target. |
| `onSourceReorder` | `EventEmitter&lt;PickListSourceReorderEvent&gt;` | Callback to invoke when items are reordered within source list. |
| `onTargetReorder` | `EventEmitter&lt;PickListTargetReorderEvent&gt;` | Callback to invoke when items are reordered within target list. |
| `onSourceSelect` | `EventEmitter&lt;PickListSourceSelectEvent&gt;` | Callback to invoke when items are selected within source list. |
| `onTargetSelect` | `EventEmitter&lt;PickListTargetSelectEvent&gt;` | Callback to invoke when items are selected within target list. |
| `onSourceFilter` | `EventEmitter&lt;PickListSourceFilterEvent&gt;` | Callback to invoke when the source list is filtered |
| `onTargetFilter` | `EventEmitter&lt;PickListTargetFilterEvent&gt;` | Callback to invoke when the target list is filtered |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list is focused |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list is blurred |

## Source

[`projects/helix/picklist`](../../projects/helix/picklist)
