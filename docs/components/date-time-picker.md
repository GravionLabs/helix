# Date time picker

`hx-date-time-picker` is a date and time field that opens a calendar with a time row under it (hour, minute,
optionally second and AM/PM), or with `[inline]="true"` the calendar and the time row alone. The value is one `Date`
(`HxDateTimePickerValue`, `Date | null`); clearing the field gives `null`. It works with `ngModel`, reactive forms
(including `disable()`) and signal forms (`[formField]`).

```html
<hx-date-time-picker inputId="start" showIcon showButtonBar [stepMinute]="15" [(ngModel)]="start" />
<hx-date-time-picker hourFormat="12" [minDate]="opening" [maxDate]="closing" [(value)]="visit" />
<hx-date-time-picker inline ariaLabel="Start" [(value)]="start" />
```

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `minDate`, `maxDate` | `Date` | | Earliest and latest moment, compared including the time (`new Date(2026, 9, 28, 17, 0)` closes a day at 17:00). A time outside moves to the nearest limit. |
| `disabledDates` | `Date[]` | `[]` | Days that cannot be chosen. |
| `firstDayOfWeek` | `number` | `0` | `0` Sunday … `6` Saturday. |
| `hourFormat` | `'24' \| '12'` | `'24'` | `'12'` shows hours from 1 to 12 and an AM/PM column. |
| `showMinutes` | `boolean` | `true` | `false` picks the hour only: no minute and second column, minutes and seconds are `0`. |
| `showSeconds` | `boolean` | `false` | A seconds column (ignored without `showMinutes`). |
| `stepHour`, `stepMinute`, `stepSecond` | `number` | `1` | Step of the arrow keys and buttons of a column. |
| `placeholder`, `inputId` | `string` | | Of the text field. |
| `showIcon` | `boolean` | `false` | A calendar button at the end of the field. |
| `showButtonBar` | `boolean` | `false` | Today and Clear buttons under the time row of the popup. |
| `inline` | `boolean` | `false` | Shows the calendar and the time row in the page, with no field. |
| `dateFormat` | `Intl.DateTimeFormatOptions` | numeric `dd/mm/yyyy, hh:mm` in the order of the locale | Format of the text in the field. |
| `locale` | `string` | the browser's | A BCP 47 tag for the names and the format. |
| `timeLabel`, `hourLabel`, `minuteLabel`, `secondLabel`, `periodLabel` | `string` | `Time`, `Hour`, `Minute`, `Second`, `AM/PM` | Accessible names of the row and the columns. |
| `todayLabel`, `clearLabel`, `chooseLabel` | `string` | `Today`, `Clear`, `Choose date and time` | Text of the button bar; name of the button and the popup. |
| `disabled`, `invalid` | `boolean` | `false` | |
| `ariaLabel`, `ariaLabelledby` | `string` | | Name of the field (or of the inline control) and the popup. |

- **Field:** it shows the value with `Intl.DateTimeFormat` (`10/09/2026, 14:05`). Typing parses the date in the order
  of the locale (also `yyyy-mm-dd`) and the time (`14:30`, `03:45 PM` or `3:45 pm`); with `[showMinutes]="false"` the
  time is the hour (`14`, `14:00` or `2 PM`). Enter or leaving the field commits it; an unreadable, disabled or out of
  range date and time puts the value back.
- **Value:** choosing a day keeps the time already set; setting a time with no date takes today. Time zones are not
  handled: the value is a local `Date`. Setting a time with no date does nothing when today is in `disabledDates` or outside `minDate`..`maxDate`.
- **Popup:** click, the button, Arrow Down or Alt+Arrow Up open it; it is a non-modal dialog that stays open until
  Escape, the focus leaving the control or a button of the button bar (Today, Clear). Focus moves to the selected or
  today's day and returns to the field on close.
- **Keyboard:** in the day grid the arrows move by a day or a week, Home and End to the start and end of the week, Page
  Up and Page Down by a month (with Shift by a year), Enter or Space selects. The grid is one tab stop.
- **Accessibility:** each time column is a `role="spinbutton"` (`aria-valuenow`, `aria-valuetext`): Arrow Up and Down
  change it by the step, Page Up and Page Down by a larger step, Home and End go to the first and last value. The
  arrow buttons are not in the tab order.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
