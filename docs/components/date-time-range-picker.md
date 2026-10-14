# Date time range picker

`hx-date-time-range-picker` is a date-time range in one field with one button. The field shows the range as one text
(`1/1/2026 00:00 - 1/2/2026 00:15`). The popup holds one calendar in which the range is marked (two clicks: from, then
to) and, below it, a time picker for the start and one for the end. It is built on three controls: an inline range
`hx-date-picker` for the days and two inline `hx-time-picker` for the times. The value is `{ from: Date | null; to: Date | null }`
(`HxDateTimeRangeValue`); a side is `null` while it is empty. It works with `ngModel`, reactive forms (including
`disable()`) and signal forms.

```html
<hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
<hx-date-time-range-picker typeable [(value)]="period" />
<hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
```

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `fromLabel`, `toLabel` | `string` | `From`, `To` | Names of the two time pickers. |
| `separator` | `string` | `-` | The text between the two dates in the field. |
| `placeholder`, `inputId` | `string` | | Of the text field; the placeholder shows while the range is empty. |
| `typeable` | `boolean` | `false` | The range can be typed into the field (see Typing); otherwise the field is read-only. |
| `presets` | `HxDateTimeRangePreset[]` | `[]` | Ready-made ranges as buttons above the calendar (see below). |
| `presetsLabel` | `string` | `Presets` | Name of the preset group. |
| `chooseLabel`, `clearLabel`, `cancelLabel`, `submitLabel` | `string` | `Choose date range`, `Clear`, `Cancel`, `Submit` | Name of the button and the popup; text of the popup's buttons. |
| `showTime` | `boolean` | `true` | The time pickers; `false` picks days only (midnight). |
| `timeOnly`, `hourFormat`, `showMinutes`, `showSeconds` | | as the time picker | See [time picker](time-picker.md). `timeOnly` shows the time pickers without the calendar. |
| `stepHour`, `stepMinute`, `stepSecond` | `number` | `1` | Step of the time columns. |
| `dateFormat`, `locale`, `firstDayOfWeek` | | as the date picker | Format of the text, names, first weekday. |
| `minDate`, `maxDate`, `disabledDates` | `Date`, `Date[]` | | Limits, compared including the time. |
| `showButtonBar` | `boolean` | `false` | A Clear button (empties the range being edited) beside Cancel and Submit. |
| `disabled`, `invalid` | `boolean` | `false` | |
| `ariaLabel`, `ariaLabelledby` | `string` | | Name of the field and the popup. |

- **Presets:** each `{ label, from: () => Date, to: () => Date }` (`HxDateTimeRangePreset`) is a button in the popup; the
  functions run when it is chosen, so `now` stays current. A preset fills the draft (calendar and time pickers show it);
  Submit applies it, Cancel drops it. No list is shown without presets. A preset is taken as the picker shows it: a
  reversed one is swapped, `[showTime]="false"` keeps its days (midnight), `timeOnly` keeps its times on the days of the
  range being edited (or today), `minDate`..`maxDate` move it inside, and a side on a day in `disabledDates` refuses it.

  ```ts
  readonly presets: HxDateTimeRangePreset[] = [
    { label: 'Last 6 hours', from: () => new Date(Date.now() - 6 * 3_600_000), to: () => new Date() },
    { label: 'Last 7 days', from: () => new Date(Date.now() - 7 * 86_400_000), to: () => new Date() },
  ];
  ```

  ```html
  <hx-date-time-range-picker placeholder="Pick a range" [presets]="presets" [(value)]="range" />
  ```
- **Field:** read-only unless `typeable`; click, the button, Arrow Down, Enter or Space open the popup. The popup edits a draft:
  Submit makes it the value, Cancel, Escape, a click outside or the focus leaving the control drop it.
- **Typing** (`typeable`): the field takes the range as it shows it, `from separator to` (`10/12/2026 08:30 - 10/14/2026 16:45`).
  Each side is read like the [date time picker](date-time-picker.md)'s field: the date in the order of the locale (also
  `yyyy-mm-dd`) and the time (`14:30`, `3:45 PM`; the hour alone with `[showMinutes]="false"`, the date alone with
  `[showTime]="false"`, the time alone with `timeOnly`, on the day of the value or today). Enter or leaving the field
  commits it (Enter does not submit a surrounding form), Escape drops the typed text and shows the value again; a range
  typed while the popup is open is also what the popup edits. A typed range equal to the value changes nothing; a side
  may be empty (`10/12/2026 08:30 -`), a text without the separator is `from`, an empty text empties the range and a
  reversed range is put in order. An unreadable side, a day in `disabledDates` or a time outside
  `minDate`..`maxDate` puts the value back; a value set from outside drops the typed text. Only the numeric default
  format reads back: with a `dateFormat` that writes month names, typing is refused. The field opens the popup with the
  button, Arrow Down or Alt+Arrow Up (click, Enter and Space are for typing); it keeps its label and `aria-*`.
- **Calendar:** the first click sets `from`, the second `to` (a click before `from` swaps them); a third click starts
  a new range. Days keep the times already chosen (midnight at first).
- **Order:** `to` is never before `from`: the `to` time picker starts at `from` (including the time), the `from` picker ends
  at `to`, and a day or time that crosses the other side moves it.
- **Validation:** there is no built-in required rule; use the validators of the form.
- **Accessibility:** the popup is a non-modal dialog; the calendar is the date picker's, the two time pickers are inline `hx-time-picker`s (a group with `role="spinbutton"` columns) named
  `fromLabel` / `toLabel`.
- **Time zones** are not handled: the values are local `Date`s.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
