# DatePicker

> DatePicker is a form component to work with dates.

## Import

```ts
import { DatePicker } from '@gravionlabs/helix/datepicker';
```

## Components

### DatePicker

Selector: `h-datePicker, h-datepicker, h-date-picker`

DatePicker is a form component to work with dates.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `iconDisplay` | `'input' \| 'button'` | `'button'` | — |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `inputStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the input field. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `inputStyleClass` | `string \| undefined` | — | Style class of the input field. |
| `placeholder` | `string \| undefined` | — | Placeholder text for the input. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `iconAriaLabel` | `string \| undefined` | — | Defines a string that labels the icon button for accessibility. |
| `multipleSeparator` | `string` | `','` | Separator for multiple selection mode. |
| `rangeSeparator` | `string` | `'-'` | Separator for joining start and end dates on range selection mode. |
| `inline` | `boolean` | `false` | When enabled, displays the datepicker as inline. Default is false for popup mode. |
| `showOtherMonths` | `boolean` | `true` | Whether to display dates in other months (non-selectable) at the start or end of the current month. To make these days selectable use the selectOtherMonths option. |
| `selectOtherMonths` | `boolean \| undefined` | — | Whether days in other months shown before or after the current month are selectable. This only applies if the showOtherMonths option is set to true. |
| `showIcon` | `boolean \| undefined` | — | When enabled, displays a button with icon next to input. |
| `icon` | `string \| undefined` | — | Icon of the datepicker button. |
| `readonlyInput` | `boolean \| undefined` | — | When specified, prevents entering the date manually with keyboard. |
| `shortYearCutoff` | `any` | `'+10'` | The cutoff year for determining the century for a date. |
| `timeOnly` | `boolean \| undefined` | — | Whether to display timepicker only. |
| `stepHour` | `number` | `1` | Hours to change per step. |
| `stepMinute` | `number` | `1` | Minutes to change per step. |
| `stepSecond` | `number` | `1` | Seconds to change per step. |
| `showSeconds` | `boolean` | `false` | Whether to show the seconds in time picker. |
| `showOnFocus` | `boolean` | `true` | When disabled, datepicker will not be visible with input focus. |
| `showWeek` | `boolean` | `false` | When enabled, datepicker will show week numbers. |
| `startWeekFromFirstDayOfYear` | `boolean` | `false` | When enabled, datepicker will start week numbers from first day of the year. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `dataType` | `string` | `'date'` | Type of the value to write back to ngModel, default is date and alternative is string. |
| `selectionMode` | `'single' \| 'multiple' \| 'range' \| undefined` | `'single'` | Defines the quantity of the selection, valid values are "single", "multiple" and "range". |
| `maxDateCount` | `number \| undefined` | — | Maximum number of selectable dates in multiple mode. |
| `showButtonBar` | `boolean \| undefined` | — | Whether to display today and clear buttons at the footer |
| `todayButtonStyleClass` | `string \| undefined` | — | Style class of the today button. |
| `clearButtonStyleClass` | `string \| undefined` | — | Style class of the clear button. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the datetimepicker container element. |
| `panelStyle` | `any` | — | Inline style of the datetimepicker container element. |
| `keepInvalid` | `boolean` | `false` | Keep invalid value when input blur. |
| `hideOnDateTimeSelect` | `boolean` | `true` | Whether to hide the overlay on date selection. |
| `touchUI` | `boolean \| undefined` | — | When enabled, datepicker overlay is displayed as optimized for touch devices. |
| `timeSeparator` | `string` | `':'` | Separator of time selector. |
| `focusTrap` | `boolean` | `true` | When enabled, can only focus on elements inside the datepicker. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke on focus of input field. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke on blur of input field. |
| `onClose` | `EventEmitter&lt;HTMLElement&gt;` | Callback to invoke when date panel closed. |
| `onSelect` | `EventEmitter&lt;Date&gt;` | Callback to invoke on date select. |
| `onClear` | `EventEmitter&lt;any&gt;` | Callback to invoke when input field cleared. |
| `onInput` | `EventEmitter&lt;any&gt;` | Callback to invoke when input field is being typed. |
| `onTodayClick` | `EventEmitter&lt;Date&gt;` | Callback to invoke when today button is clicked. |
| `onClearClick` | `EventEmitter&lt;any&gt;` | Callback to invoke when clear button is clicked. |
| `onMonthChange` | `EventEmitter&lt;DatePickerMonthChangeEvent&gt;` | Callback to invoke when a month is changed using the navigators. |
| `onYearChange` | `EventEmitter&lt;DatePickerYearChangeEvent&gt;` | Callback to invoke when a year is changed using the navigators. |
| `onClickOutside` | `EventEmitter&lt;any&gt;` | Callback to invoke when clicked outside of the date panel. |
| `onShow` | `EventEmitter&lt;HTMLElement&gt;` | Callback to invoke when datepicker panel is shown. |

## Source

[`projects/helix/datepicker`](../../projects/helix/datepicker)
