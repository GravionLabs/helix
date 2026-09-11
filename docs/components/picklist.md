# PickList

> PickList is used to reorder items between different lists.

## Import

```ts
import { PickList } from '@helix-ui/core/picklist';
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
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `sourceStyle` | `any` | — | Inline style of the source list element. |
| `targetStyle` | `any` | — | Inline style of the target list element. |
| `showSourceControls` | `boolean` | `true` | Whether to show buttons of source list. |
| `showTargetControls` | `boolean` | `true` | Whether to show buttons of target list. |
| `sourceFilterPlaceholder` | `string \| undefined` | — | Placeholder text on source filter input. |
| `targetFilterPlaceholder` | `string \| undefined` | — | Placeholder text on target filter input. |
| `disabled` | `boolean` | `undefined!` | When present, it specifies that the component should be disabled. |
| `sourceOptionDisabled` | `string \| ((item: any) =&gt; boolean) \| undefined` | — | Name of the disabled field of a target option or function to determine disabled state. |
| `targetOptionDisabled` | `string \| ((item: any) =&gt; boolean) \| undefined` | — | Name of the disabled field of a target option or function to determine disabled state. |
| `ariaSourceFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input of source list. |
| `ariaTargetFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input of target list. |
| `filterMatchMode` | `string` | `'contains'` | Defines how the items are filtered. |
| `stripedRows` | `boolean \| undefined` | — | Whether to displays rows with alternating colors. |
| `keepSelection` | `boolean` | `false` | Keeps selection on the transfer list. |
| `scrollHeight` | `string` | `'14rem'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `autoOptionFocus` | `boolean` | `true` | Whether to focus on the first visible or selected element. |
| `buttonProps` | `ButtonProps` | `{ severity: 'secondary' }` | Used to pass all properties of the ButtonProps to the Button component. |
| `moveUpButtonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move up button inside the component. |
| `moveTopButtonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move top button inside the component. |
| `moveDownButtonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move down button inside the component. |
| `moveBottomButtonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move bottom button inside the component. |
| `moveToTargetProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move to target button inside the component. |
| `moveAllToTargetProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move all to target button inside the component. |
| `moveToSourceProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move to source button inside the component. |
| `moveAllToSourceProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the move all to source button inside the component. |
| `breakpoint` | `string` | `'960px'` | Indicates the width of the screen at which the component should change its behavior. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onMoveToSource` | `output&lt;PickListMoveToSourceEvent&gt;()` | Callback to invoke when items are moved from target to source. |
| `onMoveAllToSource` | `output&lt;PickListMoveAllToSourceEvent&gt;()` | Callback to invoke when all items are moved from target to source. |
| `onMoveAllToTarget` | `output&lt;PickListMoveAllToTargetEvent&gt;()` | Callback to invoke when all items are moved from source to target. |
| `onMoveToTarget` | `output&lt;PickListMoveToTargetEvent&gt;()` | Callback to invoke when items are moved from source to target. |
| `onSourceReorder` | `output&lt;PickListSourceReorderEvent&gt;()` | Callback to invoke when items are reordered within source list. |
| `onTargetReorder` | `output&lt;PickListTargetReorderEvent&gt;()` | Callback to invoke when items are reordered within target list. |
| `onSourceSelect` | `output&lt;PickListSourceSelectEvent&gt;()` | Callback to invoke when items are selected within source list. |
| `onTargetSelect` | `output&lt;PickListTargetSelectEvent&gt;()` | Callback to invoke when items are selected within target list. |
| `onSourceFilter` | `output&lt;PickListSourceFilterEvent&gt;()` | Callback to invoke when the source list is filtered |
| `onTargetFilter` | `output&lt;PickListTargetFilterEvent&gt;()` | Callback to invoke when the target list is filtered |
| `onFocus` | `output&lt;Event&gt;()` | Callback to invoke when the list is focused |
| `onBlur` | `output&lt;Event&gt;()` | Callback to invoke when the list is blurred |

## Source

[`projects/core/picklist`](../../projects/core/picklist)
