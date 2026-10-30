# Date range quick select

`hx-date-range-quick-select` is a Kibana-style quick select for a date range: one read-only field with a button that
opens a compact popup. The field shows the range as text (`Last 15 minutes`, or two dates for an absolute range). The
popup holds a **Quick select** row (Last / Next, an amount, a unit, Apply), a **Commonly used** list, a **Recently
used** list and one summary line each for the start and the end. The value is `{ from: Date | null; to: Date | null }`
(`HxDateRangeQuickSelectValue`); a side is `null` while it is empty. It works with `ngModel`, reactive forms (including
`disable()`) and signal forms (`[formField]`).

```html
<hx-date-range-quick-select [(ngModel)]="range" [(expression)]="expression" />
<hx-date-range-quick-select [(value)]="period" recentStorageKey="reports-recent" />
<hx-date-range-quick-select [formControl]="control" [commonlyUsed]="ranges" />
```

| Input                         | Type                                   | Default                         | Description                                                                           |
| ----------------------------- | -------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `expression` (model)          | `HxDateRangeExpression \| null`        | `null`                          | The applied range as text (`{ from: 'now-15m', to: 'now' }`); see Expression model.   |
| `commonlyUsed`                | `HxQuickSelectRange[]`                 | `HX_QUICK_SELECT_COMMONLY_USED` | The "Commonly used" list: `{ label, from, to }` with date math or ISO sides.          |
| `recentStorageKey`            | `string \| null`                       | `hx-date-range-recent`          | `localStorage` key of the "Recently used" list; `null` keeps it in memory only.       |
| `labels`                      | `Partial<HxQuickSelectLabels>`         | English                         | Texts of the control, merged over the defaults.                                       |
| `minDate`, `maxDate`          | `Date`                                 |                                 | Limits; the resolved range is moved inside.                                           |
| `firstDayOfWeek`              | `number`                               | `0`                             | `0` Sunday … `6` Saturday; `/w` in date math and the calendar start on it.            |
| `locale`, `dateFormat`        | `string`, `Intl.DateTimeFormatOptions` | the browser's                   | Names and format of the absolute dates in the field, the summary and the recent list. |
| `separator`                   | `string`                               | `-`                             | The text between the two dates in the field.                                          |
| `placeholder`, `inputId`      | `string`                               |                                 | Of the text field; the placeholder shows while the range is empty.                    |
| `chooseLabel`                 | `string`                               | `Choose date range`             | Name of the button and (without `ariaLabel`) the popup.                               |
| `disabled`, `invalid`         | `boolean`                              | `false`                         |                                                                                       |
| `ariaLabel`, `ariaLabelledby` | `string`                               |                                 | Name of the field and the popup.                                                      |

## Exports

`@gravionlabs/helix-ui` exports the component and these types, lists and functions:

| Export                                                                                                 | Description                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `HxDateRangeQuickSelect`                                                                               | The component.                                                                              |
| `HxDateRangeQuickSelectValue`                                                                          | The value, `{ from: Date \| null; to: Date \| null }`.                                      |
| `HxDateRangeExpression`                                                                                | The `expression` model, `{ from: string; to: string }`.                                     |
| `hxResolveRangeExpression(expression, { now?, firstDayOfWeek? })`                                      | Resolves an expression to `{ from, to }`; the end rounds up.                                |
| `hxResolveRangeSide(text, { now?, firstDayOfWeek?, roundUp? })`                                        | Resolves one side (date math, an ISO date-time, or a date-only ISO text as local midnight). |
| `hxParseDateMath`, `hxRelativeRangeExpressions`                                                        | Date math (see below).                                                                      |
| `HxQuickSelectLabels`, `HX_QUICK_SELECT_LABELS`, `HxQuickSelectRange`, `HX_QUICK_SELECT_COMMONLY_USED` | The texts and the "Commonly used" list.                                                     |

## When to use which

- Use the **quick select** for time windows that move with the clock ("Last 15 minutes", "Next 7 days", "This week"),
  as in dashboards, logs and monitoring: the range is kept as text and resolved again when you need it.
- Use the [date time range picker](date-time-range-picker.md) for a fixed range of days and times chosen on a calendar
  (a shift, a booking, a reporting period), with optional ready-made presets and a Submit / Cancel draft.

## Behaviour

- **Quick select:** the row "Last / Next, amount, unit, Apply" (for example Last 15 minutes) applies at once and
  closes the popup. An amount that is empty, not a whole number, not positive or too large for a date keeps the popup
  open with an inline message.
- **Commonly used:** a list of `{ label, from, to }` (`HxQuickSelectRange`); the default is `HX_QUICK_SELECT_COMMONLY_USED`
  (Today, This week, Last 15 minutes … Last 1 year). A click applies the range at once and closes the popup.

  ```ts
  readonly ranges: HxQuickSelectRange[] = [
    { label: 'Last 2 hours', from: 'now-2h', to: 'now' },
    { label: 'Yesterday', from: 'now-1d/d', to: 'now-1d/d' },
  ];
  ```
- **Recently used:** the last 5 applied ranges, newest first, without duplicates, kept in `localStorage` under
  `recentStorageKey` (if storage is blocked, or the key is `null`, the list lives in memory for the session). A range
  is added when it is applied by Apply, a list entry or, when the popup closes, an edit of a side. A click applies it
  again.
- **Progressive disclosure:** the popup shows one summary line for the start and one for the end (`15 minutes ago`,
  `now`, `Oct 12, 2026, 08:30`). A click on a line opens the editor of that side alone, with the tabs **Absolute** (a
  typed date and a calendar), **Relative** (an amount, a unit with "ago" or "from now", "Round to the unit", and the
  resolved date) and **Now**; a click on the line again closes it. One editor is open at a time. An edit in the editor
  commits that side at once and keeps the popup open. An edit that puts the start after the end swaps the two ends, as
  Apply and the lists do (the editor moves with the edited side, so a start typed after the end becomes the end). An
  edit that cannot be applied (an empty amount, an unreadable date, a date outside `minDate`..`maxDate`) keeps the last
  applied range and shows an inline message until the side changes or its editor closes.
- **Expression model:** after a relative apply, `expression` is `{ from: 'now-15m', to: 'now' }`; an absolute side is
  an ISO string, and an absolute range gives `null`. A value set from outside (`ngModel`, `setValue`/`reset`, a signal
  form, a new `[value]`) to a different range sets it to `null` unless a new expression is set with it. A value with
  the same times as the last one, or with the times the expression resolves to now (within a second), keeps it. Setting
  it from outside changes the field's text and the summary but not `value`; resolve it yourself with
  `hxResolveRangeExpression`. When the resolved ends are reversed (`now+1d` to `now`), the value is put in order and
  the expression is swapped with it.

  ```ts
  readonly expression = signal<HxDateRangeExpression | null>(null);
  // later: resolve it again, e.g. to refresh a dashboard
  const { from, to } = hxResolveRangeExpression(this.expression()!, { firstDayOfWeek: 1 });
  ```

  To restore a persisted expression (after a reload), set the value resolved from it together with it.
  `ngModel` writes its value a moment later than the `expression` binding; the expression survives that write
  because the value is what it resolves to. A stored value from an earlier session is a different range and drops
  the expression.

  ```ts
  // <hx-date-range-quick-select [(ngModel)]="range" [(expression)]="expression" />
  readonly expression = signal<HxDateRangeExpression | null>(
    JSON.parse(localStorage.getItem('range-expression') ?? 'null'),
  );
  // the range the expression stands for now
  range = this.expression() ? hxResolveRangeExpression(this.expression()!) : { from: null, to: null };
  ```
- **Date math:** `hxParseDateMath(expression, { now?, firstDayOfWeek?, roundUp? })` returns a `Date`, or `null` for an
  invalid text (it never throws). Grammar: `now`, then any number of `+N<unit>` or `-N<unit>` (shift) and `/<unit>`
  (round down to the start of the unit; to its last millisecond with `roundUp`). Units are case-sensitive: `s`, `m`,
  `h`, `d`, `w`, `M` (month), `y`. Day, week, month and year shifts follow the calendar (DST-safe, a month shift clamps
  the day). `/w` starts on `firstDayOfWeek`. The end of a range rounds up, so `now/d` to `now/d` is the whole day.

  | Expression | Meaning                                                   |
  | ---------- | --------------------------------------------------------- |
  | `now`      | The moment of the call.                                   |
  | `now-15m`  | 15 minutes ago.                                           |
  | `now-1d/d` | Start of yesterday (end of yesterday with `roundUp`).     |
  | `now/w`    | Start of this week (the end of this week with `roundUp`). |
  | `now+1M/M` | Start of next month.                                      |
- **Forms:** with `ngModel` and reactive forms the control value is `{ from, to }`; with signal forms bind
  `[formField]`. There is no built-in required rule; use the validators of the form. `disabled` (also a disabled form
  control) disables the field, the button and the popup.

  ```html
  <hx-date-range-quick-select [formField]="filterForm.period" [(expression)]="expression" />
  ```
- **Keyboard:** the field is read-only; click, the button, Arrow Down, Enter or Space open the popup. Tab moves through
  the quick select row, the lists and the summary lines; the tabs of a side editor follow the tab pattern. Escape closes
  the innermost open layer: a calendar or select list, then the side editor, then the popup. The focus leaving the
  control closes the popup.
- **Accessibility:** the popup is a non-modal dialog named by `ariaLabel` (or `chooseLabel`). The side editor has a
  `tablist` with `role="tab"` buttons and a `tabpanel`; the summary lines are buttons with `aria-expanded`. An error
  message is a `role="alert"` and is named by the Apply button and the edited fields through `aria-describedby`.
- **Time zones** are not handled: the values are local `Date`s.

## Tokens

The look comes from the design tokens `--h-datepicker-*` and `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
