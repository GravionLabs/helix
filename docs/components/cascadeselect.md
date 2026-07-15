# CascadeSelect

> CascadeSelect is a form component to select a value from a nested structure of options.

## Import

```ts
import { CascadeSelect, CascadeSelectSub } from '@gravionlabs/helix/cascadeselect';
```

## Components

### CascadeSelect

Selector: `h-cascadeSelect, h-cascadeselect, h-cascade-select`

CascadeSelect is a form component to select a value from a nested structure of options.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | Unique identifier of the component |
| `searchMessage` | `string \| undefined` | — | Text to display when the search is active. Defaults to global value in i18n translation configuration. |
| `emptyMessage` | `string \| undefined` | — | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `selectionMessage` | `string \| undefined` | — | Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration. |
| `emptySearchMessage` | `string \| undefined` | — | Text to display when filtering does not return any results. Defaults to value from Helix locale configuration. |
| `emptySelectionMessage` | `string \| undefined` | — | Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration. |
| `searchLocale` | `string \| undefined` | — | Locale to use in searching. The default locale is the host environment's current locale. |
| `optionDisabled` | `any` | — | Name of the disabled field of an option. |
| `focusOnHover` | `boolean` | `true` | Fields used when filtering the options, defaults to optionLabel. |
| `selectOnFocus` | `boolean` | `false` | Determines if the option will be selected on focus. |
| `autoOptionFocus` | `boolean` | `false` | Whether to focus on the first visible or selected element when the overlay panel is shown. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `options` | `string[] \| string \| undefined` | — | An array of selectitems to display as the available options. |
| `optionLabel` | `string \| undefined` | — | Property name or getter function to use as the label of an option. |
| `optionValue` | `string \| undefined` | — | Property name or getter function to use as the value of an option, defaults to the option itself when not defined. |
| `optionGroupLabel` | `string \| undefined` | — | Property name or getter function to use as the label of an option group. |
| `optionGroupChildren` | `string[] \| string \| undefined \| null` | — | Property name or getter function to retrieve the items of a group. |
| `placeholder` | `string \| undefined` | — | Default text to display when no option is selected. |
| `value` | `string \| undefined \| null` | — | Selected value of the component. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify an option. |
| `inputId` | `string \| undefined` | — | Identifier of the underlying input element. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `inputLabel` | `string \| undefined` | — | Label of the input for accessibility. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the overlay panel. |
| `panelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the overlay panel. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `loading` | `boolean \| undefined` | `false` | Whether the dropdown is in loading state. |
| `loadingIcon` | `string \| undefined` | — | Icon to display in loading state. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;CascadeSelectChangeEvent&gt;` | Callback to invoke on value change. |
| `onGroupChange` | `EventEmitter&lt;Event&gt;` | Callback to invoke when a group changes. |
| `onShow` | `EventEmitter&lt;CascadeSelectShowEvent&gt;` | Callback to invoke when the overlay is shown. |
| `onHide` | `EventEmitter&lt;CascadeSelectHideEvent&gt;` | Callback to invoke when the overlay is hidden. |
| `onClear` | `EventEmitter&lt;any&gt;` | Callback to invoke when the clear token is clicked. |
| `onBeforeShow` | `EventEmitter&lt;CascadeSelectBeforeShowEvent&gt;` | Callback to invoke before overlay is shown. |
| `onBeforeHide` | `EventEmitter&lt;CascadeSelectBeforeHideEvent&gt;` | Callback to invoke before overlay is hidden. |
| `onFocus` | `EventEmitter&lt;FocusEvent&gt;` | Callback to invoke when input receives focus. |
| `onBlur` | `EventEmitter&lt;FocusEvent&gt;` | Callback to invoke when input loses focus. |

### CascadeSelectSub

Selector: `ul[hCascadeSelectSub]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectId` | `string \| undefined` | — | — |
| `activeOptionPath` | `any[]` | — | — |
| `optionDisabled` | `any[]` | — | — |
| `focusedOptionId` | `string \| undefined` | — | — |
| `options` | `any[] \| string[] \| string \| undefined \| null` | — | — |
| `optionGroupChildren` | `string[] \| string \| undefined \| null` | — | — |
| `optionTemplate` | `Nullable&lt;TemplateRef&lt;any&gt;&gt;` | — | — |
| `groupicon` | `Nullable&lt;TemplateRef&lt;any&gt;&gt;` | — | — |
| `level` | `number` | `0` | — |
| `optionLabel` | `string \| undefined` | — | — |
| `optionValue` | `string \| undefined` | — | — |
| `optionGroupLabel` | `string \| undefined` | — | — |
| `dirty` | `boolean \| undefined` | — | — |
| `root` | `boolean \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;any&gt;` | — |
| `onFocusChange` | `EventEmitter&lt;any&gt;` | — |
| `onFocusEnterChange` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/cascadeselect`](../../projects/helix/cascadeselect)
