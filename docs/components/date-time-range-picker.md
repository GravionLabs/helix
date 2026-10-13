# Date time range picker

`hx-date-time-range-picker` is a from and a to date-time field in one control. It is two [date pickers](date-picker.md)
with `showTime`, so the time options are the same, and `timeOnly` gives a range of times of day. The value is
`{ from: Date | null; to: Date | null }` (`HxDateTimeRangeValue`); a side is `null` while it is empty. It works with
`ngModel`, reactive forms (including `disable()`) and signal forms.

```html
<hx-date-time-range-picker [stepMinute]="15" [(ngModel)]="shift" />
<hx-date-time-range-picker timeOnly [showMinutes]="false" [(value)]="opening" />
```

| Input | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `fromLabel`, `toLabel` | `string` | `From`, `To` | Placeholders and accessible names of the two fields. |
| `separator` | `string` | `–` | The text between the fields (hidden below one container width of 375 px). |
| `inputId` | `string` | | The `id` of the from field, for a `<label for>`. |
| `showTime` | `boolean` | `true` | A time row under the calendar. |
| `timeOnly`, `hourFormat`, `showMinutes`, `showSeconds` | | as the date picker | See [date picker](date-picker.md). |
| `stepHour`, `stepMinute`, `stepSecond` | `number` | `1` | Step of the time columns. |
| `dateFormat`, `locale`, `firstDayOfWeek` | | as the date picker | Format of the text, names, first weekday. |
| `minDate`, `maxDate`, `disabledDates` | `Date`, `Date[]` | | Limits, compared including the time. |
| `showIcon`, `showButtonBar` | `boolean` | `false` | Calendar button, Today and Clear. |
| `disabled`, `invalid` | `boolean` | `false` | Both fields. |
| `ariaLabel`, `ariaLabelledby` | `string` | | Name of the group of the two fields. |

- **Order:** `to` is never before `from`. The `to` field takes `from` (including the time) as its earliest value and
  the `from` field takes `to` as its latest. A `from` set later than `to` moves `to` to `from`, and a `to` set before
  `from` moves to `from`. Clearing one side keeps the other. The `to` calendar opens on the month of `from`.
- **Validation:** there is no built-in required rule; use the validators of the form.
- **Layout:** the fields sit side by side and stack below a container width of 375 px.
- **Accessibility:** the two fields are a `role="group"` named by `ariaLabel` / `ariaLabelledby`; each is named
  `fromLabel` / `toLabel`. Keyboard and time columns are those of the date picker.
- **Time zones** are not handled: the values are local `Date`s.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
