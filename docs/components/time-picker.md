# Time picker

`hx-time-picker` is a time field that opens a time row (hour, minute, optionally second and AM/PM), or with
`[inline]="true"` the time row alone. The value is a `Date` that is today at the chosen time (`HxTimePickerValue`,
`Date | null`); clearing the field gives `null`. It works with `ngModel`, reactive forms (including `disable()`) and
signal forms (`[formField]`).

```html
<hx-time-picker inputId="alarm" hourFormat="12" showIcon showButtonBar [(ngModel)]="alarm" />
<hx-time-picker [showMinutes]="false" [(value)]="opens" />
<hx-time-picker inline [stepMinute]="15" ariaLabel="Start" [(value)]="start" />
```

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `hourFormat` | `'24' \| '12'` | `'24'` | `'12'` shows hours from 1 to 12 and an AM/PM column. |
| `showMinutes` | `boolean` | `true` | A minutes column; `false` picks the hour only (minutes and seconds are `0`). |
| `showSeconds` | `boolean` | `false` | A seconds column (ignored without `showMinutes`). |
| `stepHour`, `stepMinute`, `stepSecond` | `number` | `1` | Step of the arrow keys and buttons of a column. |
| `minTime`, `maxTime` | `Date` | | Earliest and latest time of day; only the time of the dates counts. A time outside moves to the nearest limit, typed text outside is dropped. |
| `placeholder`, `inputId` | `string` | | Of the text field. |
| `showIcon` | `boolean` | `false` | A clock button at the end of the field. |
| `showButtonBar` | `boolean` | `false` | Now and Clear buttons under the time row of the popup. |
| `inline` | `boolean` | `false` | Shows the time row in the page, with no field. |
| `dateFormat` | `Intl.DateTimeFormatOptions` | numeric `hh:mm` | Format of the text in the field. |
| `locale` | `string` | the browser's | A BCP 47 tag for the format and the AM/PM names. |
| `hourLabel`, `minuteLabel`, `secondLabel`, `periodLabel`, `timeLabel` | `string` | `Hour`, `Minute`, `Second`, `AM/PM`, `Time` | Accessible names of the columns and the row. |
| `nowLabel`, `clearLabel`, `chooseLabel` | `string` | `Now`, `Clear`, `Choose time` | Text of the button bar; name of the button and the popup. |
| `disabled`, `invalid` | `boolean` | `false` | |
| `ariaLabel`, `ariaLabelledby` | `string` | | Name of the field (or of the inline row) and the popup. |

- **Field:** it shows the value with `Intl.DateTimeFormat`. Typing parses `14:30`, `14:30:05`, `2:30 PM` or, with
  `[showMinutes]="false"`, `14` or `2 PM`; Enter or leaving the field commits it, an unreadable time puts the value back.
- **Popup:** click, the button, Arrow Down or Alt+Arrow Up open it; it is a non-modal dialog that stays open until
  Escape, the focus leaving the control or a button of the button bar. Focus moves to the first column and returns to the
  field on close.
- **Value:** a column change gives today at that time (the day of a value set from outside is replaced). Time zones are
  not handled: the value is a local `Date`.
- **Accessibility:** each column is a `role="spinbutton"` (`aria-valuenow`, `aria-valuetext`): Arrow Up and Down change it
  by the step, Page Up and Page Down by a larger step, Home and End go to the first and last value. The arrow buttons
  are not in the tab order.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
