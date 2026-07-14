# AutoComplete

> AutoComplete is an input component that provides real-time suggestions when being typed.

## Import

```ts
import { AutoComplete } from '@gravionlabs/helix/autocomplete';
```

## Components

### AutoComplete

Selector: `h-autoComplete, h-autocomplete, h-auto-complete`

AutoComplete is an input component that provides real-time suggestions when being typed.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `minLength` | `number` | `1` | Minimum number of characters to initiate a search. |
| `minQueryLength` | `number \| undefined` | — | Minimum number of characters to initiate a search. |
| `delay` | `number` | `300` | Delay between keystrokes to wait before sending a query. |
| `panelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the overlay panel element. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the overlay panel element. |
| `inputStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the input field. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `inputStyleClass` | `string \| undefined` | — | Inline style of the input field. |
| `placeholder` | `string \| undefined` | — | Hint text for the input field. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the input cannot be typed. |
| `scrollHeight` | `string` | `'200px'` | Maximum height of the suggestions panel. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of an item in the list for VirtualScrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `autoHighlight` | `boolean \| undefined` | — | When enabled, highlights the first item in the list by default. |
| `forceSelection` | `boolean \| undefined` | — | When present, autocomplete clears the manual input if it does not match of the suggestions to force only accepting values from the suggestions. |
| `type` | `string` | `'text'` | Type of the input, defaults to "text". |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `dropdownAriaLabel` | `string \| undefined` | — | Defines a string that labels the dropdown button for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that labels the input field. |
| `dropdownIcon` | `string \| undefined` | — | Icon class of the dropdown icon. |
| `unique` | `boolean` | `true` | Ensures uniqueness of selected items on multiple mode. |
| `group` | `boolean \| undefined` | — | Whether to display options as grouped when nested options are provided. |
| `completeOnFocus` | `boolean` | `false` | Whether to run a query when input receives focus. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `dropdown` | `boolean \| undefined` | — | Displays a button next to the input field when enabled. |
| `showEmptyMessage` | `boolean \| undefined` | `true` | Whether to show the empty message or not. |
| `dropdownMode` | `string` | `'blank'` | Specifies the behavior dropdown button. Default "blank" mode sends an empty string and "current" mode sends the input value. |
| `multiple` | `boolean \| undefined` | — | Specifies if multiple values can be selected. |
| `addOnTab` | `boolean` | `false` | When enabled, the input value is added to the selected items on tab key press when multiple is true and typeahead is false. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a value in options. |
| `emptyMessage` | `string \| undefined` | — | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `autocomplete` | `string` | `'off'` | Used to define a string that autocomplete attribute the current element. |
| `optionGroupChildren` | `string \| undefined` | `'items'` | Name of the options field of an option group. |
| `optionGroupLabel` | `string \| undefined` | `'label'` | Name of the label field of an option group. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Options for the overlay element. |
| `optionLabel` | `string \| ((item: any) =&gt; string) \| undefined` | — | Property name or getter function to use as the label of an option. |
| `optionValue` | `string \| ((item: any) =&gt; string) \| undefined` | — | Property name or getter function to use as the value of an option. |
| `id` | `string \| undefined` | — | Unique identifier of the component. |
| `searchMessage` | `string \| undefined` | — | Text to display when the search is active. Defaults to global value in i18n translation configuration. |
| `emptySelectionMessage` | `string \| undefined` | — | Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration. |
| `selectionMessage` | `string \| undefined` | — | Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration. |
| `autoOptionFocus` | `boolean \| undefined` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| `selectOnFocus` | `boolean \| undefined` | — | When enabled, the focused option is selected. |
| `searchLocale` | `boolean \| undefined` | — | Locale to use in searching. The default locale is the host environment's current locale. |
| `optionDisabled` | `string \| ((item: any) =&gt; string) \| undefined` | — | Property name or getter function to use as the disabled flag of an option, defaults to false when not defined. |
| `focusOnHover` | `boolean \| undefined` | `true` | When enabled, the hovered option will be focused. |
| `typeahead` | `boolean` | `true` | Whether typeahead is active or not. |
| `addOnBlur` | `boolean` | `false` | Whether to add an item on blur event if the input has value and typeahead is false with multiple mode. |
| `separator` | `string \| RegExp \| undefined` | — | Separator char to add item when typeahead is false and multiple mode is enabled. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `completeMethod` | `EventEmitter&lt;AutoCompleteCompleteEvent&gt;` | Callback to invoke to search for suggestions. |
| `onSelect` | `EventEmitter&lt;AutoCompleteSelectEvent&gt;` | Callback to invoke when a suggestion is selected. |
| `onUnselect` | `EventEmitter&lt;AutoCompleteUnselectEvent&gt;` | Callback to invoke when a selected value is removed. |
| `onAdd` | `EventEmitter&lt;AutoCompleteAddEvent&gt;` | Callback to invoke when an item is added via addOnBlur or separator features. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component loses focus. |
| `onDropdownClick` | `EventEmitter&lt;AutoCompleteDropdownClickEvent&gt;` | Callback to invoke to when dropdown button is clicked. |
| `onClear` | `EventEmitter&lt;Event \| undefined&gt;` | Callback to invoke when clear button is clicked. |
| `onInputKeydown` | `EventEmitter&lt;KeyboardEvent&gt;` | Callback to invoke on input key down. |
| `onKeyUp` | `EventEmitter&lt;KeyboardEvent&gt;` | Callback to invoke on input key up. |
| `onShow` | `EventEmitter&lt;Event&gt;` | Callback to invoke on overlay is shown. |
| `onHide` | `EventEmitter&lt;Event&gt;` | Callback to invoke on overlay is hidden. |
| `onLazyLoad` | `EventEmitter&lt;AutoCompleteLazyLoadEvent&gt;` | Callback to invoke on lazy load data. |

## Source

[`projects/helix/autocomplete`](../../projects/helix/autocomplete)
