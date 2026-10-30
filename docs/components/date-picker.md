# Date picker

`hx-date-picker` is a date field that opens a calendar, or with `[inline]="true"` the calendar alone, to choose a day, a
range or several days. Clicking the month or the year in the header opens the month and year views. Names of months and weekdays come from
`Intl.DateTimeFormat` for the `locale`. The value is a `Date` at the start of the day (`single`) or a `Date[]` (`multiple`; with `range`
one date while the range is open and two when it is complete). It works with `ngModel`, reactive forms
(including `disable()`) and signal forms. For a time use [time picker](time-picker.md), [date-time picker](date-time-picker.md) or [date-time range picker](date-time-range-picker.md).

```html
<label for="arrival">Arrival</label>
<hx-date-picker inputId="arrival" showIcon showButtonBar [(ngModel)]="arrival" />
<hx-date-picker inline ariaLabel="Arrival" [(ngModel)]="arrival" />
<hx-date-picker inline selectionMode="range" [minDate]="today" [firstDayOfWeek]="1" [(value)]="stay" />
<hx-date-picker selectionMode="range" showIcon [presets]="dayPresets" presetDisplay="select" [(ngModel)]="stay" />
```

```ts
import { HX_DATE_RANGE_DAY_PRESETS } from '@gravionlabs/helix-ui';

readonly dayPresets = HX_DATE_RANGE_DAY_PRESETS; // Today, Last 7 days, This month
```

| Input                         | Type                                | Default                                  | Description                                                                   |
| ----------------------------- | ----------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| `inline`                      | `boolean`                           | `false`                                  | The calendar in the page, without a field.                                    |
| `showIcon`                    | `boolean`                           | `false`                                  | A calendar button at the end of the field.                                    |
| `showButtonBar`               | `boolean`                           | `false`                                  | Today and Clear under the calendar of the popup (`todayLabel`, `clearLabel`). |
| `dateFormat`                  | `Intl.DateTimeFormatOptions`        | numeric `dd/mm/yyyy` order of the locale | Format of the text in the field.                                              |
| `placeholder`, `inputId`      | `string`                            |                                          | Of the text field.                                                            |
| `selectionMode`               | `'single' \| 'range' \| 'multiple'` | `'single'`                               | What the value holds.                                                         |
| `minDate`, `maxDate`          | `Date \| null`                      | `null`                                   | Earliest and latest day.                                                      |
| `disabledDates`               | `Date[]`                            | `[]`                                     | Days that cannot be chosen.                                                   |
| `firstDayOfWeek`              | `number`                            | `0`                                      | `0` Sunday … `6` Saturday.                                                    |
| `locale`                      | `string`                            | browser's                                | BCP 47 tag for the names.                                                     |
| `ariaLabel`, `ariaLabelledby` | `string`                            | `Calendar`                               | Name of the calendar.                                                         |
| `presets`                     | `HxDateTimeRangePreset[]`           | `[]`                                     | Ready-made ranges above the calendar, with `selectionMode="range"` only.      |
| `presetDisplay`               | `'buttons' \| 'select'`             | `'buttons'`                              | The presets as a row of buttons or in a select.                               |
| `presetsLabel`                | `string`                            | `'Presets'`                              | Name of the preset group and the select's placeholder.                        |
| `presetRefusedLabel`          | `string`                            | `'This range cannot be chosen.'`         | Message shown when a preset is refused.                                       |

- **Range presets:** with `selectionMode="range"`, `presets` lists ready-made ranges above the calendar. They are
  opt-in: the list is empty by default, so no preset shows until you pass one (for the built-in day presets,
  `[presets]="dayPresets"` with `dayPresets = HX_DATE_RANGE_DAY_PRESETS`: Today, Last 7 days, This month). Presets are
  ignored in `single` and `multiple`. You can also take `hxDateRangePresets({ ... })` (localized labels; `This week`
  follows `firstDayOfWeek`), add your own `{ label, from, to }` or replace the list entirely.
- **Choosing a preset** sets the value at once to the days of its two ends: midnight (the time is dropped), in order
  when the ends are reversed. A preset that overlaps `minDate`..`maxDate` is cut to the limits; one that lies wholly
  outside them (both ends before `minDate` or both after `maxDate`) or has an end on a day in `disabledDates` is
  refused: the value stays, the popup stays open and an inline message (`presetRefusedLabel`, `role="alert"`, named by
  the preset buttons or the select through `aria-describedby`) says so until the next choice, edit or opening. A taken
  preset closes the popup and the focus returns to the field.
- **Preset select:** `presetDisplay="select"` shows the presets in a compact `hx-select` (named by `presetsLabel`)
  instead of buttons. It shows the chosen preset while the value still holds its days (a new `presets` array with an
  entry of the same label keeps it); a value written from outside (`ngModel`, `setValue`/`reset`, `[value]`) shows the
  placeholder again, and the same preset can be chosen again.
- **Preset keyboard and state:** the preset buttons are native buttons before the calendar in the tab order; the select
  works as `hx-select` (Arrow Down opens, the arrows move, Enter chooses, Escape closes only the list and leaves the
  popup open). Presets are disabled with the picker (`disabled`, a disabled form control). Times of day, a draft with
  Submit live in [date-time range picker](date-time-range-picker.md) (`presets`,
  `presetDisplay`; with `[showTime]="false"` it picks days only).
- **Field:** it shows the value with `Intl.DateTimeFormat`. Typing a date parses it in the order the locale writes
  numbers (also `yyyy-mm-dd`); unreadable or disabled dates put the value back. A range reads as `a – b`, several days
  as `a, b`. The popup opens by click, by the button or Arrow Down; a range keeps it open until the second date.
- **Keyboard:** in the day grid the arrows move by a day or a week, Home and End to the start and end of the week, Page
  Up and Page Down by a month (with Shift by a year), Enter or Space selects. The grid is one tab stop.
- **Accessibility:** the popup is a non-modal dialog (`role="dialog"`, `aria-modal="false"`, labelled from the field);
  focus moves to the selected or today's day when it opens and returns to the field when it closes (Escape closes).
  The calendar is the WAI-ARIA date grid: `role="grid"` with column headers (`abbr` is the full weekday name),
  `role="gridcell"` with `aria-selected`, today has `aria-current="date"`, and every day button is named with the
  full date ("Friday, October 9, 2026"). Days outside `minDate`/`maxDate` or in `disabledDates` are `aria-disabled`.

## Tokens

The look comes from the design tokens `--h-datepicker-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
