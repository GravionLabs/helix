# Select

> Select is used to choose an item from a collection of options.

## Import

```ts
import { Select, SelectItem } from '@gravionlabs/helix/select';
```

## Components

### Select

Selector: `h-select`

Select is used to choose an item from a collection of options.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | Unique identifier of the component |
| `scrollHeight` | `string` | `'200px'` | Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `filter` | `boolean \| undefined` | — | When specified, displays an input field to filter the items on keyup. |
| `panelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the overlay panel element. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the overlay panel element. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the component cannot be edited. |
| `editable` | `boolean \| undefined` | — | When present, custom value instead of predefined options can be entered using the editable input field. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `loadingIcon` | `string \| undefined` | — | Icon to display in loading state. |
| `filterPlaceholder` | `string \| undefined` | — | Placeholder text to show when filter input is empty. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `inputId` | `string \| undefined` | — | Identifier of the accessible input element. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a value in options. |
| `filterBy` | `string \| undefined` | — | When filtering is enabled, filterBy decides which field or fields (comma separated) to search against. |
| `filterFields` | `any[] \| undefined` | — | Fields used when filtering the options, defaults to optionLabel. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `resetFilterOnHide` | `boolean` | `false` | Clears the filter value when hiding the select. |
| `checkmark` | `boolean` | `false` | Whether the selected option will be shown with a check mark. |
| `dropdownIcon` | `string \| undefined` | — | Icon class of the select icon. |
| `loading` | `boolean \| undefined` | `false` | Whether the select is in loading state. |
| `optionLabel` | `string \| undefined` | — | Name of the label field of an option. |
| `optionValue` | `string \| undefined` | — | Name of the value field of an option. |
| `optionDisabled` | `string \| undefined` | — | Name of the disabled field of an option. |
| `optionGroupLabel` | `string \| undefined` | `'label'` | Name of the label field of an option group. |
| `optionGroupChildren` | `string` | `'items'` | Name of the options field of an option group. |
| `group` | `boolean \| undefined` | — | Whether to display options as grouped when nested options are provided. |
| `showClear` | `boolean \| undefined` | — | When enabled, a clear icon is displayed to clear the value. |
| `emptyFilterMessage` | `string` | `''` | Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration. |
| `emptyMessage` | `string` | `''` | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |
| `ariaFilterLabel` | `string \| undefined` | — | Defines a string that labels the filter input. |
| `ariaLabel` | `string \| undefined` | — | Used to define a aria label attribute the current element. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in' \| 'lt' \| 'lte' \| 'gt' \| 'gte'` | `'contains'` | Defines how the items are filtered. |
| `tooltip` | `string` | `''` | Advisory information to display in a tooltip on hover. |
| `tooltipPosition` | `'top' \| 'left' \| 'right' \| 'bottom'` | `'right'` | Position of the tooltip. |
| `tooltipPositionStyle` | `string` | `'absolute'` | Type of CSS position. |
| `tooltipStyleClass` | `string \| undefined` | — | Style class of the tooltip. |
| `focusOnHover` | `boolean` | `true` | Fields used when filtering the options, defaults to optionLabel. |
| `selectOnFocus` | `boolean` | `false` | Determines if the option will be selected on focus. |
| `autoOptionFocus` | `boolean` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| `autofocusFilter` | `boolean` | `true` | Applies focus to the filter element when the overlay is shown. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;SelectChangeEvent&gt;` | Callback to invoke when value of select changes. |
| `onFilter` | `EventEmitter&lt;SelectFilterEvent&gt;` | Callback to invoke when data is filtered. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when select gets focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when select loses focus. |
| `onClick` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when component is clicked. |
| `onShow` | `EventEmitter&lt;AnimationEvent&gt;` | Callback to invoke when select overlay gets visible. |
| `onHide` | `EventEmitter&lt;AnimationEvent&gt;` | Callback to invoke when select overlay gets hidden. |
| `onClear` | `EventEmitter&lt;Event&gt;` | Callback to invoke when select clears the value. |
| `onLazyLoad` | `EventEmitter&lt;SelectLazyLoadEvent&gt;` | Callback to invoke in lazy mode to load new data. |

### SelectItem

Selector: `h-selectItem`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | — |
| `option` | `any` | — | — |
| `selected` | `boolean \| undefined` | — | — |
| `focused` | `boolean \| undefined` | — | — |
| `label` | `string \| undefined` | — | — |
| `disabled` | `boolean \| undefined` | — | — |
| `visible` | `boolean \| undefined` | — | — |
| `itemSize` | `number \| undefined` | — | — |
| `ariaPosInset` | `string \| undefined` | — | — |
| `ariaSetSize` | `string \| undefined` | — | — |
| `template` | `TemplateRef&lt;any&gt; \| undefined` | — | — |
| `checkmark` | `boolean` | — | — |
| `index` | `number \| undefined` | — | — |
| `scrollerOptions` | `any` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClick` | `EventEmitter&lt;any&gt;` | — |
| `onMouseEnter` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/select`](../../projects/helix/select)
