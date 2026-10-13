# Date picker

`hx-date-picker` is a date field that opens a calendar, or with `[inline]="true"` the calendar alone, to choose a day, a
range or several days. Clicking the month or the year in the header opens the month and year views. Names of months and weekdays come from
`Intl.DateTimeFormat` for the `locale`. The value is a `Date` (`single`) or a `Date[]` (`multiple`; with `range`
one date while the range is open and two when it is complete). It works with `ngModel`, reactive forms
(including `disable()`) and signal forms.

```html
<label for="arrival">Arrival</label>
<hx-date-picker inputId="arrival" showIcon showButtonBar [(ngModel)]="arrival" />
<hx-date-picker inline ariaLabel="Arrival" [(ngModel)]="arrival" />
<hx-date-picker inline selectionMode="range" [minDate]="today" [firstDayOfWeek]="1" [(value)]="stay" />
<hx-date-picker showTime [stepMinute]="15" [(ngModel)]="start" />
<hx-date-picker timeOnly hourFormat="12" [(ngModel)]="alarm" />
```

| Input                   | Type                                  | Default    | Description                                       |
| ----------------------- | ------------------------------------- | ---------- | ------------------------------------------------- |
| `inline`                | `boolean`                             | `false`    | The calendar in the page, without a field.        |
| `showIcon`              | `boolean`                             | `false`    | A calendar button at the end of the field.        |
| `showButtonBar`         | `boolean`                             | `false`    | Today and Clear under the calendar of the popup (`todayLabel`, `clearLabel`). |
| `dateFormat`            | `Intl.DateTimeFormatOptions`          | numeric `dd/mm/yyyy` order of the locale, plus `hh:mm` with the time | Format of the text in the field. |
| `showTime`              | `boolean`                             | `false`    | A time row under the calendar (popup and `inline`). |
| `timeOnly`              | `boolean`                             | `false`    | The time row without the calendar.                |
| `hourFormat`            | `'24' \| '12'`                        | `'24'`     | `'12'` adds an AM/PM column.                      |
| `showSeconds`           | `boolean`                             | `false`    | A seconds column.                                 |
| `stepHour`, `stepMinute`, `stepSecond` | `number`               | `1`        | Step of the arrow keys and buttons of the column. |
| `timeLabel`, `hourLabel`, `minuteLabel`, `secondLabel`, `periodLabel` | `string` | `Time`, `Hour`, `Minute`, `Second`, `AM/PM` | Accessible names of the time row and its columns. |
| `placeholder`, `inputId` | `string`                             |            | Of the text field.                                |
| `selectionMode`         | `'single' \| 'range' \| 'multiple'`   | `'single'` | What the value holds.                             |
| `minDate`, `maxDate`    | `Date \| null`                        | `null`     | Earliest and latest day.                          |
| `disabledDates`         | `Date[]`                              | `[]`       | Days that cannot be chosen.                       |
| `firstDayOfWeek`        | `number`                              | `0`        | `0` Sunday … `6` Saturday.                        |
| `locale`                | `string`                              | browser's  | BCP 47 tag for the names.                         |
| `ariaLabel`, `ariaLabelledby` | `string`                        | `Calendar` | Name of the calendar.                             |

- **Field:** it shows the value with `Intl.DateTimeFormat`. Typing a date parses it in the order the locale writes
  numbers (also `yyyy-mm-dd`); unreadable or disabled dates put the value back. A range reads as `a – b`, several days
  as `a, b`. The popup opens by click, by the button or Arrow Down; a range keeps it open until the second date.
- **Time:** `showTime` adds a row with one column per unit (hour, minute, optionally second and AM/PM) and arrow
  buttons; `timeOnly` shows that row alone. The value stays a `Date`, so forms work unchanged. Choosing a day keeps the
  time already set; setting a time with no date takes today. `minDate`/`maxDate` are compared including the time
  (pass `new Date(2026, 9, 28, 17, 0)` to close a day at 17:00), and a time outside them moves to the nearest limit.
  With `showTime` a day click does not close the popup: Escape, the focus leaving the control or the button bar
  (Today, Clear) close it; without `showTime` nothing changes. The field shows and parses the date and time (`10/09/2026,
  14:05`, `03:45 PM` or `3:45 pm` with AM/PM). Time applies to `selectionMode="single"`; `range` and `multiple` ignore `showTime`
  and `timeOnly`. Time zones are not handled: the value is a local `Date`.
- **Keyboard:** in the day grid the arrows move by a day or a week, Home and End to the start and end of the week, Page
  Up and Page Down by a month (with Shift by a year), Enter or Space selects. The grid is one tab stop. Each time column is a `role="spinbutton"` (`aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`, `aria-valuetext`, named Hour, Minute …) and a tab stop: Arrow Up and Down change it
  by its step (wrapping around), Page Up and Down by 6 (hours) or 10, Home and End go to the first and last value.
- **Accessibility:** the popup is a non-modal dialog (`role="dialog"`, `aria-modal="false"`, labelled from the field);
  focus moves to the selected or today's day when it opens and returns to the field when it closes (Escape closes).
  The calendar is the WAI-ARIA date grid: `role="grid"` with column headers (`abbr` is the full weekday name),
  `role="gridcell"` with `aria-selected`, today has `aria-current="date"`, and every day button is named with the
  full date ("Friday, October 9, 2026"). Days outside `minDate`/`maxDate` or in `disabledDates` are `aria-disabled`.

## Tokens

The look comes from the design tokens `--h-datepicker-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
