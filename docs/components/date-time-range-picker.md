# Date time range picker

`hx-date-time-range-picker` is a date-time range in one field with one button. The field shows the range as one text
(`1/1/2026 00:00 - 1/2/2026 00:15`). The popup holds one calendar in which the range is marked (two clicks: from, then
to) and, below it, a time picker for the start and one for the end. It is built on three controls: an inline range `hx-date-picker` for the days and two inline `hx-time-picker` for the times. The value is `{ from: Date | null; to: Date | null }`
(`HxDateTimeRangeValue`); a side is `null` while it is empty. It works with `ngModel`, reactive forms (including
`disable()`) and signal forms.

```html
<hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
<hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
```

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `fromLabel`, `toLabel` | `string` | `From`, `To` | Names of the two time pickers. |
| `separator` | `string` | `-` | The text between the two dates in the field. |
| `placeholder`, `inputId` | `string` | | Of the text field. |
| `chooseLabel`, `clearLabel`, `cancelLabel`, `submitLabel` | `string` | `Choose date range`, `Clear`, `Cancel`, `Submit` | Name of the button and the popup; text of the popup's buttons. |
| `showTime` | `boolean` | `true` | The time pickers; `false` picks days only (midnight). |
| `timeOnly`, `hourFormat`, `showMinutes`, `showSeconds` | | as the time picker | See [time picker](time-picker.md). `timeOnly` shows the time pickers without the calendar. |
| `stepHour`, `stepMinute`, `stepSecond` | `number` | `1` | Step of the time columns. |
| `dateFormat`, `locale`, `firstDayOfWeek` | | as the date picker | Format of the text, names, first weekday. |
| `minDate`, `maxDate`, `disabledDates` | `Date`, `Date[]` | | Limits, compared including the time. |
| `showButtonBar` | `boolean` | `false` | A Clear button (empties the range being edited) beside Cancel and Submit. |
| `disabled`, `invalid` | `boolean` | `false` | |
| `ariaLabel`, `ariaLabelledby` | `string` | | Name of the field and the popup. |

- **Field:** read-only; click, the button, Arrow Down, Enter or Space open the popup. The popup edits a draft:
  Submit makes it the value, Cancel, Escape, a click outside or the focus leaving the control drop it.
- **Calendar:** the first click sets `from`, the second `to` (a click before `from` swaps them); a third click starts
  a new range. Days keep the times already chosen (midnight at first).
- **Order:** `to` is never before `from`: the `to` time picker starts at `from` (including the time), the `from` picker ends
  at `to`, and a day or time that crosses the other side moves it.
- **Validation:** there is no built-in required rule; use the validators of the form.
- **Accessibility:** the popup is a non-modal dialog; the calendar is the date picker's, the time pickers (`role="spinbutton"` columns) are the time picker's;
  they are named `fromLabel` / `toLabel`.
- **Time zones** are not handled: the values are local `Date`s.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
