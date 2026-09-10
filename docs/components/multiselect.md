# MultiSelect

> MultiSelect is used to select multiple items from a collection.

## Import

```ts
import { MultiSelectItem, MultiSelect } from '@helix-ui/core/multiselect';
```

## Components

### MultiSelectItem

Selector: `li[hMultiSelectItem]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `option` | `any` | — | — |
| `selected` | `boolean \| undefined` | — | — |
| `label` | `string \| undefined` | — | — |
| `disabled` | `boolean \| undefined` | — | — |
| `itemSize` | `number \| undefined` | — | — |
| `focused` | `boolean \| undefined` | — | — |
| `ariaPosInset` | `string \| undefined` | — | — |
| `ariaSetSize` | `string \| undefined` | — | — |
| `variant` | `"filled" \| "outlined"` | `undefined!` | — |
| `template` | `TemplateRef&lt;MultiSelectItemTemplateContext&lt;any&gt;&gt; \| undefined` | — | — |
| `checkIconTemplate` | `TemplateRef&lt;MultiSelectItemCheckboxIconTemplateContext&gt; \| undefined` | — | — |
| `itemCheckboxIconTemplate` | `TemplateRef&lt;MultiSelectItemCheckboxIconTemplateContext&gt; \| undefined` | — | — |
| `highlightOnSelect` | `boolean \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClick` | `output&lt;any&gt;()` | — |
| `onMouseEnter` | `output&lt;any&gt;()` | — |

### MultiSelect

Selector: `h-multiSelect, h-multiselect, h-multi-select`

MultiSelect is used to select multiple items from a collection.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | Unique identifier of the component |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `panelStyle` | `any` | — | Inline style of the overlay panel. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the overlay panel element. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the component cannot be edited. |
| `group` | `boolean \| undefined` | — | Whether to display options as grouped when nested options are provided. |
| `filter` | `boolean` | `true` | When specified, displays an input field to filter the items on keyup. |
| `filterPlaceHolder` | `string \| undefined` | — | Defines placeholder of the filter input. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a value in options. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `displaySelectedLabel` | `boolean` | `true` | Whether to show labels of selected item labels or use default label. |
| `maxSelectedLabels` | `number \| null \| undefined` | `3` | Decides how many selected item labels to show at most. |
| `selectionLimit` | `number \| undefined` | — | Maximum number of selectable items. |
| `selectedItemsLabel` | `string \| undefined` | — | Label to display after exceeding max selected labels e.g. ({0} items selected), defaults "ellipsis" keyword to indicate a text-overflow. |
| `showToggleAll` | `boolean` | `true` | Whether to show the checkbox at header to toggle all items at once. |
| `emptyFilterMessage` | `string` | `''` | Text to display when filtering does not return any results. |
| `emptyMessage` | `string` | `''` | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `resetFilterOnHide` | `boolean` | `false` | Clears the filter value when hiding the dropdown. |
| `dropdownIcon` | `string \| undefined` | — | Icon class of the dropdown icon. |
| `chipIcon` | `string \| undefined` | — | Icon class of the chip icon. |
| `optionLabel` | `string \| undefined` | — | Name of the label field of an option. |
| `optionValue` | `string \| undefined` | — | Name of the value field of an option. |
| `optionDisabled` | `string \| undefined` | — | Name of the disabled field of an option. |
| `optionGroupLabel` | `string \| undefined` | `'label'` | Name of the label field of an option group. |
| `optionGroupChildren` | `string` | `'items'` | Name of the options field of an option group. |
| `showHeader` | `boolean` | `true` | Whether to show the header. |
| `filterBy` | `string \| undefined` | — | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. |
| `scrollHeight` | `string` | `'200px'` | Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `loading` | `boolean \| undefined` | `false` | Whether the multiselect is in loading state. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `loadingIcon` | `string \| undefined` | — | Icon to display in loading state. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |
| `ariaFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input. |
| `filterMatchMode` | `"in" \| "contains" \| "startsWith" \| "endsWith" \| "equals" \| "notEquals" \| "lt" \| "lte" \| "gt" \| "gte"` | `'contains'` | Defines how the items are filtered. |
| `tooltip` | `string` | `''` | Advisory information to display in a tooltip on hover. |
| `tooltipPosition` | `"left" \| "right" \| "top" \| "bottom"` | `'right'` | Position of the tooltip. |
| `tooltipPositionStyle` | `string` | `'absolute'` | Type of CSS position. |
| `tooltipStyleClass` | `string \| undefined` | — | Style class of the tooltip. |
| `autofocusFilter` | `boolean` | `false` | Applies focus to the filter element when the overlay is shown. |
| `display` | `string` | `'comma'` | Defines how the selected items are displayed. |
| `autocomplete` | `string` | `'off'` | Defines the autocomplete is active. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `placeholder` | `string \| undefined` | — | Label to display when there are no selections. |
| `options` | `any[] \| undefined` | — | An array of objects to display as the available options. |
| `filterValue` | `string \| null \| undefined` | `null` | When specified, filter displays with this value. |
| `selectAll` | `boolean \| null \| undefined` | `null` | Whether all data is selected. |
| `focusOnHover` | `boolean` | `true` | Indicates whether to focus on options when hovering over them, defaults to optionLabel. |
| `filterFields` | `any[] \| undefined` | — | Fields used when filtering the options, defaults to optionLabel. |
| `selectOnFocus` | `boolean` | `false` | Determines if the option will be selected on focus. |
| `autoOptionFocus` | `boolean` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| `highlightOnSelect` | `boolean` | `true` | Whether the selected option will be add highlight class. |
| `size` | `"large" \| "small" \| undefined` | — | Specifies the size of the component. |
| `variant` | `"filled" \| "outlined" \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `boolean \| undefined` | — | Spans 100% width of the container when enabled. |
| `appendTo` | `any` | — | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `output&lt;MultiSelectChangeEvent&gt;()` | Callback to invoke when value changes. |
| `onFilter` | `output&lt;MultiSelectFilterEvent&gt;()` | Callback to invoke when data is filtered. |
| `onFocus` | `output&lt;MultiSelectFocusEvent&gt;()` | Callback to invoke when multiselect receives focus. |
| `onBlur` | `output&lt;MultiSelectBlurEvent&gt;()` | Callback to invoke when multiselect loses focus. |
| `onClick` | `output&lt;Event&gt;()` | Callback to invoke when component is clicked. |
| `onClear` | `output&lt;void&gt;()` | Callback to invoke when input field is cleared. |
| `onPanelShow` | `output&lt;AnimationEvent&gt;()` | Callback to invoke when overlay panel becomes visible. |
| `onPanelHide` | `output&lt;AnimationEvent&gt;()` | Callback to invoke when overlay panel becomes hidden. |
| `onLazyLoad` | `output&lt;MultiSelectLazyLoadEvent&gt;()` | Callback to invoke in lazy mode to load new data. |
| `onRemove` | `output&lt;MultiSelectRemoveEvent&gt;()` | Callback to invoke in lazy mode to load new data. |
| `onSelectAllChange` | `output&lt;MultiSelectSelectAllChangeEvent&gt;()` | Callback to invoke when all data is selected. |

## Source

[`projects/core/multiselect`](../../projects/core/multiselect)
