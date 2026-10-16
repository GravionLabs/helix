import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HX_DATE_RANGE_PRESETS, hxDateRangePresets } from './date-range-presets';
import {
  HxDateTimeRangePicker,
  type HxDateTimeRangePreset,
  type HxDateTimeRangeValue,
} from './date-time-range-picker';
import type { HxDateRangeExpression } from './quick-select';

@Component({
  imports: [HxDateTimeRangePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-time-range-picker
      id="basic"
      locale="en-US"
      ariaLabel="Shift"
      inputId="shift"
      placeholder="Pick a range"
      showButtonBar
      [stepMinute]="15"
      [(value)]="basic"
    />
    <hx-date-time-range-picker
      id="limits"
      locale="en-US"
      [minDate]="min"
      [maxDate]="max"
      [(value)]="limits"
    />
    <hx-date-time-range-picker
      id="twelve"
      locale="en-US"
      hourFormat="12"
      showSeconds
      [stepSecond]="15"
      [(value)]="twelve"
    />
    <hx-date-time-range-picker
      id="blocked"
      locale="en-US"
      [disabledDates]="blockedDays"
      [(value)]="blocked"
    />
    <hx-date-time-range-picker
      id="today"
      locale="en-US"
      [disabledDates]="[today]"
      [(value)]="empty"
    />
    <hx-date-time-range-picker
      id="clock"
      locale="en-US"
      timeOnly
      [showMinutes]="false"
      [(value)]="clock"
    />
    <hx-date-time-range-picker
      id="off"
      locale="en-US"
      [disabled]="true"
      [(value)]="basic"
    />
    <hx-date-time-range-picker
      id="labels"
      locale="en-US"
      fromLabel="Start"
      toLabel="End"
      separator="to"
      [(value)]="labels"
    />
    <hx-date-time-range-picker
      id="model"
      locale="en-US"
      [(ngModel)]="modelValue"
    />
    <hx-date-time-range-picker
      id="reactive"
      locale="en-US"
      [formControl]="control"
    />
    <hx-date-time-range-picker
      id="presets"
      locale="en-US"
      [presets]="presetList"
      [(value)]="withPresets"
    />
    <hx-date-time-range-picker
      id="presetsDays"
      locale="en-US"
      presetsLabel="Quick ranges"
      [showTime]="false"
      [disabledDates]="blockedDays"
      [presets]="dayPresets"
      [(value)]="presetDays"
    />
    <hx-date-time-range-picker
      id="presetSelect"
      locale="en-US"
      presetDisplay="select"
      presetsLabel="Quick ranges"
      [presets]="presetList"
      [(value)]="selectValue"
    />
    <hx-date-time-range-picker
      id="presetSelectDays"
      locale="en-US"
      presetDisplay="select"
      [showTime]="false"
      [presets]="builtIn"
      [(value)]="selectDays"
    />
    <hx-date-time-range-picker
      id="presetsClock"
      locale="en-US"
      timeOnly
      [presets]="clockPresets"
      [(value)]="presetClock"
    />
    <hx-date-time-range-picker id="typed" locale="en-US" typeable [(value)]="typed" />
    <hx-date-time-range-picker
      id="typedSep"
      locale="en-US"
      typeable
      [separator]="sep()"
      [(value)]="typedSep"
    />
    <hx-date-time-range-picker
      id="typedOff"
      locale="en-US"
      typeable
      [disabled]="true"
      [(value)]="typed"
    />
    <hx-date-time-range-picker
      id="typedDays"
      locale="en-US"
      typeable
      [showTime]="false"
      [(value)]="typedDays"
    />
    <hx-date-time-range-picker
      id="typedLimits"
      locale="en-US"
      typeable
      [minDate]="min"
      [maxDate]="max"
      [disabledDates]="blockedDays"
      [(value)]="typedLimits"
    />
    <hx-date-time-range-picker
      id="typedClock"
      locale="en-US"
      typeable
      timeOnly
      [showMinutes]="false"
      [(value)]="typedClock"
    />
    <hx-date-time-range-picker
      id="signal"
      locale="en-US"
      [formField]="f.span"
    />
    <hx-date-time-range-picker
      id="quick"
      locale="en-US"
      quickSelect
      typeable
      recentStorageKey="hx-test-recent"
      [presets]="presetList"
      [(value)]="quick"
      [(expression)]="quickExpr"
    />
    <hx-date-time-range-picker
      id="quickLimits"
      locale="en-US"
      quickSelect
      [recentStorageKey]="null"
      [minDate]="min"
      [maxDate]="max"
      [(value)]="quickLimits"
    />
    <hx-date-time-range-picker
      id="quickDays"
      locale="en-US"
      quickSelect
      [recentStorageKey]="null"
      [showTime]="false"
      [disabledDates]="blockedDays"
      [quickSelectLabels]="{ quickSelect: 'Schnellauswahl', apply: 'Anwenden' }"
      [commonlyUsed]="[{ label: 'Heute', from: 'now/d', to: 'now/d' }]"
      [(value)]="quickDays"
    />
    <hx-date-time-range-picker id="quickModel" locale="en-US" quickSelect [(ngModel)]="quickModel" />
    <hx-date-time-range-picker
      id="quickReactive"
      locale="en-US"
      quickSelect
      [formControl]="quickControl"
    />
    <hx-date-time-range-picker
      id="quickSignal"
      locale="en-US"
      quickSelect
      [formField]="f.span"
    />
    <hx-date-time-range-picker id="quickOff" locale="en-US" quickSelect [disabled]="true" />
  `,
})
class Host {
  presetList: HxDateTimeRangePreset[] = [
    {
      label: 'Morning',
      from: () => new Date(2026, 9, 7, 6, 0),
      to: () => new Date(2026, 9, 7, 12, 30),
    },
    {
      label: 'Two days',
      from: () => new Date(2026, 9, 8, 0, 0),
      to: () => new Date(2026, 9, 10, 0, 0),
    },
    {
      label: 'Reversed',
      from: () => new Date(2026, 9, 20, 18, 0),
      to: () => new Date(2026, 9, 19, 8, 15),
    },
  ];
  dayPresets: HxDateTimeRangePreset[] = [
    {
      label: 'Late days',
      from: () => new Date(2026, 9, 7, 6, 30),
      to: () => new Date(2026, 9, 9, 18, 45),
    },
    {
      label: 'Over a blocked day',
      from: () => new Date(2026, 9, 13, 9, 0),
      to: () => new Date(2026, 9, 14, 9, 0),
    },
  ];
  builtIn = hxDateRangePresets({ today: 'Heute', last7Days: 'Letzte 7 Tage' });
  selectValue = signal<HxDateTimeRangeValue>({ from: null, to: null });
  selectDays = signal<HxDateTimeRangeValue>({ from: null, to: null });
  presetDays = signal<HxDateTimeRangeValue>({ from: null, to: null });
  clockPresets: HxDateTimeRangePreset[] = [
    {
      label: 'Early',
      from: () => new Date(2025, 0, 1, 6, 0),
      to: () => new Date(2025, 0, 3, 7, 30),
    },
  ];
  presetClock = signal<HxDateTimeRangeValue>({
    from: new Date(2026, 9, 9, 9, 0),
    to: new Date(2026, 9, 10, 17, 0),
  });
  sep = signal('.');
  typedSep = signal<HxDateTimeRangeValue>({ from: null, to: null });
  typed = signal<HxDateTimeRangeValue>({
    from: new Date(2026, 9, 9, 9, 0),
    to: new Date(2026, 9, 10, 17, 0),
  });
  typedDays = signal<HxDateTimeRangeValue>({ from: null, to: null });
  typedLimits = signal<HxDateTimeRangeValue>({ from: null, to: null });
  typedClock = signal<HxDateTimeRangeValue>({
    from: new Date(2026, 9, 9, 9, 0),
    to: new Date(2026, 9, 9, 17, 0),
  });
  withPresets = signal<HxDateTimeRangeValue>({ from: null, to: null });
  min = new Date(2026, 9, 5, 8, 0);
  max = new Date(2026, 9, 28, 17, 0);
  basic = signal<HxDateTimeRangeValue>({ from: null, to: null });
  limits = signal<HxDateTimeRangeValue>({ from: null, to: null });
  clock = signal<HxDateTimeRangeValue>({ from: null, to: null });
  twelve = signal<HxDateTimeRangeValue>({ from: null, to: null });
  blockedDays = [new Date(2026, 9, 13)];
  blocked = signal<HxDateTimeRangeValue>({ from: null, to: null });
  today = new Date();
  empty = signal<HxDateTimeRangeValue>({ from: null, to: null });
  labels = signal<HxDateTimeRangeValue>({
    from: new Date(2026, 0, 1, 0, 0),
    to: new Date(2026, 0, 2, 0, 15),
  });
  modelValue: HxDateTimeRangeValue = {
    from: new Date(2026, 9, 9, 9, 0),
    to: null,
  };
  control = new FormControl<HxDateTimeRangeValue>({
    from: new Date(2026, 9, 3, 12, 0),
    to: null,
  });
  state = signal<{ span: HxDateTimeRangeValue }>({
    span: { from: null, to: null },
  });
  f = form(this.state);
  quick = signal<HxDateTimeRangeValue>({ from: null, to: null });
  quickExpr = signal<HxDateRangeExpression | null>(null);
  quickLimits = signal<HxDateTimeRangeValue>({ from: null, to: null });
  quickDays = signal<HxDateTimeRangeValue>({ from: null, to: null });
  quickModel: HxDateTimeRangeValue = { from: null, to: null };
  quickControl = new FormControl<HxDateTimeRangeValue>({ from: null, to: null });
}

describe('HxDateTimeRangePicker', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () =>
    document.querySelector('.hx-date-time-range-picker-popup') as HTMLElement | null;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const open = async (id: string) => {
    el(id).querySelector<HTMLButtonElement>('.hx-date-picker-trigger')?.click();
    await settle();
  };
  const day = (d: number, month = 10) =>
    popup()?.querySelector<HTMLButtonElement>(
      `.hx-date-picker-date[data-date="2026-${month}-${d}"]`,
    ) as HTMLButtonElement;
  const click = async (button: HTMLElement) => {
    button.click();
    await settle();
  };
  const submit = async () =>
    click(popup()?.querySelector('.hx-date-time-range-picker-submit') as HTMLElement);
  const spin = (side: 'from' | 'to', name: string) =>
    popup()?.querySelector(
      `.hx-date-time-range-picker-${side} [role=spinbutton][aria-label="${name}"]`,
    ) as HTMLElement;
  const now = (side: 'from' | 'to', name: string) => spin(side, name).getAttribute('aria-valuenow');
  const press = async (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await settle();
  };

  const type = async (id: string, text: string, commit: 'change' | 'Enter' = 'change') => {
    input(id).value = text;
    input(id).dispatchEvent(new Event('input'));
    if (commit === 'change') input(id).dispatchEvent(new Event('change'));
    else await press(input(id), 'Enter');
    await settle();
  };

  const close = async () => {
    popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
  };

  beforeEach(async () => {
    // jsdom has no layout: the CDK listbox of the preset select scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('is one read-only field with one button', () => {
    expect(el('basic').querySelectorAll('input').length).toBe(1);
    expect(el('basic').querySelectorAll('button').length).toBe(1);
    expect(input('basic').readOnly).toBe(true);
    expect(input('basic').id).toBe('shift');
    expect(input('basic').placeholder).toBe('Pick a range');
    expect(input('basic').getAttribute('aria-label')).toBe('Shift');
  });

  it('shows the placeholder only while empty', async () => {
    expect(input('basic').value).toBe('');
    expect(input('basic').matches(':placeholder-shown')).toBe(true);
    expect(input('labels').placeholder).toBe('');
    host.basic.set({ from: new Date(2026, 9, 12, 8, 0), to: null });
    await settle();
    expect(input('basic').value).toBe('10/12/2026 08:00 -');
    expect(input('basic').matches(':placeholder-shown')).toBe(false);
  });

  it('renders no preset list without presets', async () => {
    await open('basic');
    expect(popup()?.querySelector('.hx-date-time-range-picker-presets')).toBeNull();
  });

  it('applies a preset to from and to on submit', async () => {
    await open('presets');
    const buttons = [
      ...popup()!.querySelectorAll<HTMLElement>('.hx-date-time-range-picker-preset'),
    ];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['Morning', 'Two days', 'Reversed']);
    await click(buttons[0]);
    expect(host.withPresets()).toEqual({ from: null, to: null });
    expect(now('from', 'Hour')).toBe('6');
    expect(now('to', 'Minute')).toBe('30');
    await submit();
    expect(host.withPresets()).toEqual({
      from: new Date(2026, 9, 7, 6, 0),
      to: new Date(2026, 9, 7, 12, 30),
    });
    expect(input('presets').value).toBe('10/7/2026 06:00 - 10/7/2026 12:30');
  });

  const preset = (label: string) =>
    [...popup()!.querySelectorAll<HTMLElement>('.hx-date-time-range-picker-preset')].find(
      (b) => b.textContent?.trim() === label,
    ) as HTMLElement;
  const marked = () =>
    [
      ...popup()!.querySelectorAll(
        '[role=gridcell][aria-selected=true] button, .hx-date-picker-date-in-range',
      ),
    ]
      .map((b) => b.textContent?.trim())
      .sort();

  it('drops a chosen preset on cancel', async () => {
    host.withPresets.set({
      from: new Date(2026, 9, 21, 10, 0),
      to: new Date(2026, 9, 22, 11, 45),
    });
    await settle();
    await open('presets');
    await click(preset('Two days'));
    expect(now('to', 'Minute')).toBe('0');
    await click(popup()!.querySelector('.hx-date-time-range-picker-cancel') as HTMLElement);
    expect(host.withPresets()).toEqual({
      from: new Date(2026, 9, 21, 10, 0),
      to: new Date(2026, 9, 22, 11, 45),
    });
    await open('presets');
    expect(now('from', 'Hour')).toBe('10');
    expect(now('to', 'Hour')).toBe('11');
    expect(now('to', 'Minute')).toBe('45');
    expect(marked()).toEqual(['21', '22']);
  });

  it('swaps a preset whose to is before its from', async () => {
    await open('presets');
    await click(preset('Reversed'));
    await submit();
    expect(host.withPresets()).toEqual({
      from: new Date(2026, 9, 19, 8, 15),
      to: new Date(2026, 9, 20, 18, 0),
    });
  });

  it('replaces a chosen preset with the next one', async () => {
    await open('presets');
    await click(preset('Morning'));
    await click(preset('Two days'));
    await submit();
    expect(host.withPresets()).toEqual({
      from: new Date(2026, 9, 8, 0, 0),
      to: new Date(2026, 9, 10, 0, 0),
    });
  });

  it('shows a chosen preset in the to time picker and the calendar', async () => {
    await open('presets');
    await click(preset('Two days'));
    expect(now('to', 'Hour')).toBe('0');
    expect(marked()).toEqual(['10', '8', '9']);
    await click(preset('Morning'));
    expect(now('to', 'Hour')).toBe('12');
    expect(now('to', 'Minute')).toBe('30');
    expect(marked()).toEqual(['7']);
  });

  it('names the preset group with presetsLabel and lists native buttons', async () => {
    await open('presets');
    expect(
      popup()?.querySelector('.hx-date-time-range-picker-presets')?.getAttribute('aria-label'),
    ).toBe('Presets');
    // a native `type=button` is activated by Enter and Space by the browser (synthetic keys do not activate it)
    expect(preset('Morning').tagName).toBe('BUTTON');
    expect(preset('Morning').getAttribute('type')).toBe('button');
    preset('Morning').focus();
    expect(document.activeElement).toBe(preset('Morning'));
    await close();
    await open('presetsDays');
    expect(
      popup()?.querySelector('.hx-date-time-range-picker-presets')?.getAttribute('aria-label'),
    ).toBe('Quick ranges');
  });

  const option = (label: string) =>
    [...document.querySelectorAll<HTMLElement>('.hx-select-option')].find(
      (o) => o.textContent?.trim() === label,
    ) as HTMLElement;
  const selectTrigger = () => popup()!.querySelector('.hx-select-trigger') as HTMLButtonElement;

  it('shows the presets in a select with presetDisplay select', async () => {
    await open('presetSelect');
    expect(popup()!.querySelector('.hx-date-time-range-picker-preset')).toBeNull();
    expect(selectTrigger().getAttribute('aria-label')).toBe('Quick ranges');
    await click(selectTrigger());
    expect(
      [...document.querySelectorAll('.hx-select-option')].map((o) => o.textContent?.trim()),
    ).toEqual(['Morning', 'Two days', 'Reversed']);
  });

  it('fills the draft with a preset chosen in the select and keeps the popup open', async () => {
    await open('presetSelect');
    await click(selectTrigger());
    await click(option('Morning'));
    expect(popup()).not.toBeNull();
    expect(selectTrigger().textContent?.trim()).toBe('Morning');
    expect(now('from', 'Hour')).toBe('6');
    expect(now('to', 'Minute')).toBe('30');
    expect(host.selectValue()).toEqual({ from: null, to: null });
    await submit();
    expect(host.selectValue()).toEqual({
      from: new Date(2026, 9, 7, 6, 0),
      to: new Date(2026, 9, 7, 12, 30),
    });
  });

  it('keeps the buttons by default', async () => {
    await open('presets');
    expect(popup()!.querySelector('hx-select')).toBeNull();
  });

  it('starts the select empty each time the popup opens', async () => {
    await open('presetSelect');
    await click(selectTrigger());
    await click(option('Two days'));
    await click(popup()!.querySelector('.hx-date-time-range-picker-cancel') as HTMLElement);
    await open('presetSelect');
    expect(selectTrigger().textContent?.trim()).toBe('Quick ranges');
  });

  it('lists the built-in presets with a localizable label', () => {
    expect(HX_DATE_RANGE_PRESETS.map((p) => p.label)).toEqual([
      'Last 15 minutes',
      'Last 1 hour',
      'Last 6 hours',
      'Last 24 hours',
      'Last 7 days',
      'Last 30 days',
      'Today',
      'Yesterday',
      'This week',
      'This month',
    ]);
    expect(host.builtIn.map((p) => p.label)).toContain('Letzte 7 Tage');
    expect(host.builtIn.map((p) => p.label)).toContain('Heute');
    expect(host.builtIn.map((p) => p.label)).toContain('Last 24 hours');
  });

  describe('built-in ranges', () => {
    beforeEach(() =>
      vi.useFakeTimers({ now: new Date(2026, 9, 14, 15, 30, 20), toFake: ['Date'] }),
    );
    afterEach(() => vi.useRealTimers());
    const range = (label: string) => {
      const p = HX_DATE_RANGE_PRESETS.find((x) => x.label === label)!;
      return { from: p.from(), to: p.to() };
    };

    it('resolves relative ranges against the current time', () => {
      expect(range('Last 15 minutes')).toEqual({
        from: new Date(2026, 9, 14, 15, 15, 20),
        to: new Date(2026, 9, 14, 15, 30, 20),
      });
      expect(range('Last 24 hours').from).toEqual(new Date(2026, 9, 13, 15, 30, 20));
    });

    it('resolves the calendar ranges', () => {
      expect(range('Today').from).toEqual(new Date(2026, 9, 14));
      expect(range('Yesterday')).toEqual({
        from: new Date(2026, 9, 13),
        to: new Date(2026, 9, 13, 23, 59, 59),
      });
      expect(range('Last 7 days').from).toEqual(new Date(2026, 9, 8));
      expect(range('Last 30 days').from).toEqual(new Date(2026, 8, 15));
      expect(range('This week')).toEqual({
        from: new Date(2026, 9, 11),
        to: new Date(2026, 9, 17, 23, 59, 59),
      });
      expect(range('This month')).toEqual({
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 31, 23, 59, 59),
      });
    });

    it('starts This week on the given first day of the week', () => {
      const week = HX_DATE_RANGE_PRESETS.find((x) => x.label === 'This week')!;
      expect(week.from({ firstDayOfWeek: 1 })).toEqual(new Date(2026, 9, 12));
      expect(week.to({ firstDayOfWeek: 1 })).toEqual(new Date(2026, 9, 18, 23, 59, 59));
      expect(week.from({ firstDayOfWeek: 4 })).toEqual(new Date(2026, 9, 8));
    });

    it('keeps midnight for a built-in preset in date-only mode', async () => {
      await open('presetSelectDays');
      await click(selectTrigger());
      expect(
        [...document.querySelectorAll('.hx-select-option')].map((o) => o.textContent?.trim()),
      ).toContain('Heute');
      await click(option('This month'));
      await submit();
      expect(host.selectDays()).toEqual({
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 31),
      });
      await open('presetSelectDays');
      await click(selectTrigger());
      await click(option('Letzte 7 Tage'));
      await submit();
      expect(host.selectDays()).toEqual({ from: new Date(2026, 9, 8), to: new Date(2026, 9, 14) });
    });
  });

  it('takes the days of a preset without the time pickers', async () => {
    await open('presetsDays');
    await click(preset('Late days'));
    await submit();
    expect(host.presetDays()).toEqual({
      from: new Date(2026, 9, 7),
      to: new Date(2026, 9, 9),
    });
  });

  it('refuses a preset with a side on a day in disabledDates', async () => {
    await open('presetsDays');
    await click(preset('Over a blocked day'));
    await submit();
    expect(host.presetDays()).toEqual({ from: null, to: null });
  });

  it('puts the times of a preset on the days of the value with timeOnly', async () => {
    await open('presetsClock');
    await click(preset('Early'));
    await submit();
    expect(host.presetClock()).toEqual({
      from: new Date(2026, 9, 9, 6, 0),
      to: new Date(2026, 9, 10, 7, 30),
    });
  });

  it('shows the range as one text', () => {
    expect(input('labels').value).toBe('1/1/2026 00:00 to 1/2/2026 00:15');
    expect(input('basic').value).toBe('');
  });

  it('opens one calendar with a time picker for from and for to', async () => {
    await open('basic');
    expect(popup()?.getAttribute('role')).toBe('dialog');
    expect(popup()?.querySelectorAll('[role=grid]').length).toBe(1);
    expect(spin('from', 'Hour')).not.toBeNull();
    expect(spin('to', 'Hour')).not.toBeNull();
    expect(popup()?.querySelector('.hx-date-time-range-picker-to [role=grid]')).toBeNull();
  });

  it('names the time pickers and disables them with the control', async () => {
    await open('labels');
    const names = ['from', 'to'].map((side) =>
      popup()
        ?.querySelector(`hx-time-picker.hx-date-time-range-picker-${side} [role=group]`)
        ?.getAttribute('aria-label'),
    );
    expect(names).toEqual(['Start', 'End']);
    expect(spin('from', 'Hour').getAttribute('aria-disabled')).toBeNull();
  });

  it('takes the labels of the time pickers', async () => {
    await open('labels');
    const captions = [...popup()!.querySelectorAll('.hx-date-time-range-picker-caption')];
    expect(captions.map((c) => c.textContent?.trim())).toEqual(['Start', 'End']);
  });

  it('chooses the range with two day clicks and applies it with Submit', async () => {
    await open('basic');
    await click(day(12));
    await click(day(15));
    expect(host.basic()).toEqual({ from: null, to: null });
    expect(input('basic').value).toBe('');
    await submit();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 0, 0),
      to: new Date(2026, 9, 15, 0, 0),
    });
    expect(input('basic').value).toBe('10/12/2026 00:00 - 10/15/2026 00:00');
    expect(popup()).toBeNull();
  });

  it('drops the changes with Cancel', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await click(day(20));
    await click(day(22));
    await click(popup()!.querySelector('.hx-date-time-range-picker-cancel') as HTMLElement);
    expect(popup()).toBeNull();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await open('basic');
    expect(
      day(12).getAttribute('aria-selected') ?? day(12).parentElement?.getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('drops the changes with Escape', async () => {
    await open('basic');
    await click(day(12));
    await click(day(15));
    popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(host.basic()).toEqual({ from: null, to: null });
  });
  it('marks the range in the calendar', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 14, 9, 0),
    });
    await settle();
    await open('basic');
    const selected = [
      ...popup()!.querySelectorAll(
        '[role=gridcell][aria-selected=true] button, .hx-date-picker-date-in-range',
      ),
    ];
    expect(selected.map((b) => b.textContent?.trim()).sort()).toEqual(['12', '13', '14']);
  });

  it('keeps the times when the days change', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 45),
      to: new Date(2026, 9, 13, 17, 30),
    });
    await settle();
    await open('basic');
    await click(day(20));
    await click(day(22));
    await submit();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 20, 8, 45),
      to: new Date(2026, 9, 22, 17, 30),
    });
  });

  it('changes the time of each end with its time picker', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await press(spin('from', 'Minute'), 'ArrowUp');
    expect(now('from', 'Minute')).toBe('15');
    expect(host.basic().from).toEqual(new Date(2026, 9, 12, 8, 0));
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    expect(host.basic().to).toEqual(new Date(2026, 9, 13, 10, 0));
  });

  it('starts from at midnight of the to day when only to is changed on an empty range', async () => {
    await open('basic');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    const { from, to } = host.basic();
    expect(to).not.toBeNull();
    expect(from).toEqual(new Date(to!.getFullYear(), to!.getMonth(), to!.getDate(), 0, 0, 0));
    expect(input('basic').value.trim().startsWith('-')).toBe(false);
  });

  it('keeps to from going before from on the same day', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 12, 9, 0),
    });
    await settle();
    await open('basic');
    await press(spin('to', 'Hour'), 'ArrowDown');
    await press(spin('to', 'Hour'), 'ArrowDown');
    await submit();
    const { from, to } = host.basic();
    expect(from).toEqual(new Date(2026, 9, 12, 8, 0));
    expect(to).toEqual(new Date(2026, 9, 12, 8, 0));
  });

  it('keeps from from going after to on the same day', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 12, 9, 0),
    });
    await settle();
    await open('basic');
    await press(spin('from', 'Hour'), 'ArrowUp');
    await press(spin('from', 'Hour'), 'ArrowUp');
    await submit();
    const { from, to } = host.basic();
    expect(from).toEqual(new Date(2026, 9, 12, 9, 0));
    expect(to).toEqual(new Date(2026, 9, 12, 9, 0));
  });

  it('puts an empty to on the day of from', async () => {
    host.basic.set({ from: new Date(2026, 9, 12, 8, 0), to: null });
    await settle();
    await open('basic');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    // the empty to picker starts at 00:00: the first press (1:00) is held at from (8:00), the next two count on from there
    expect(host.basic().to).toEqual(new Date(2026, 9, 12, 10, 0));
  });

  it('puts an empty from on the day of to', async () => {
    host.basic.set({ from: null, to: new Date(2026, 9, 12, 8, 0) });
    await settle();
    await open('basic');
    await press(spin('from', 'Hour'), 'ArrowUp');
    await submit();
    expect(host.basic().from).toEqual(new Date(2026, 9, 12, 1, 0));
  });

  it('does not set a time on a day in disabledDates', async () => {
    host.blocked.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('blocked');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await press(spin('from', 'Hour'), 'ArrowUp');
    await submit();
    expect(host.blocked().to).toEqual(new Date(2026, 9, 13, 9, 0));
    expect(host.blocked().from).toEqual(new Date(2026, 9, 12, 9, 0));
  });

  it('shows the old time again when a time on a disabled day is refused', async () => {
    host.blocked.set({
      from: new Date(2026, 9, 13, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('blocked');
    await press(spin('from', 'Hour'), 'ArrowUp');
    await press(spin('to', 'Hour'), 'ArrowUp');
    expect(now('from', 'Hour')).toBe('8');
    expect(now('to', 'Hour')).toBe('9');
  });

  it('shows midnight again when a time on a disabled day is refused and the range is empty', async () => {
    await open('today');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await press(spin('from', 'Hour'), 'ArrowUp');
    expect(now('to', 'Hour')).toBe('0');
    expect(now('from', 'Hour')).toBe('0');
    await submit();
    expect(host.empty()).toEqual({ from: null, to: null });
  });

  it('moves from to to when a day click is the same day with an earlier to time', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 7, 0),
    });
    await settle();
    await open('basic');
    await click(day(18));
    await click(day(18));
    await submit();
    const { from, to } = host.basic();
    expect(from?.getDate()).toBe(18);
    expect(to && from && to >= from).toBe(true);
  });

  it('applies minDate and maxDate to the days and the times', async () => {
    await open('limits');
    expect(day(4).getAttribute('aria-disabled')).toBe('true');
    expect(day(29).getAttribute('aria-disabled')).toBe('true');
    await click(day(5));
    await submit();
    expect(host.limits().from).toEqual(new Date(2026, 9, 5, 8, 0));
  });

  it('keeps the times of the time pickers inside minDate and maxDate', async () => {
    host.limits.set({
      from: new Date(2026, 9, 5, 9, 0),
      to: new Date(2026, 9, 28, 16, 0),
    });
    await settle();
    await open('limits');
    for (let i = 0; i < 3; i++) await press(spin('from', 'Hour'), 'ArrowDown');
    for (let i = 0; i < 3; i++) await press(spin('to', 'Hour'), 'ArrowUp');
    expect(now('from', 'Hour')).toBe('8');
    expect(now('to', 'Hour')).toBe('17');
    await submit();
    expect(host.limits().from).toEqual(new Date(2026, 9, 5, 8, 0));
    expect(host.limits().to).toEqual(new Date(2026, 9, 28, 17, 0));
  });

  it('shows 12 hours with AM/PM and seconds in the time pickers', async () => {
    host.twelve.set({
      from: new Date(2026, 9, 12, 9, 0, 0),
      to: new Date(2026, 9, 13, 10, 0, 0),
    });
    await settle();
    await open('twelve');
    await press(spin('from', 'AM/PM'), 'ArrowUp');
    await press(spin('to', 'Second'), 'ArrowUp');
    await submit();
    expect(host.twelve().from).toEqual(new Date(2026, 9, 12, 21, 0, 0));
    expect(host.twelve().to).toEqual(new Date(2026, 9, 13, 10, 0, 15));
  });

  it('moves the focus into the popup when it opens', async () => {
    await open('basic');
    expect(popup()?.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(input('basic'));
  });

  it('shows only the time pickers with timeOnly', async () => {
    await open('clock');
    expect(popup()?.querySelector('[role=grid]')).toBeNull();
    expect(spin('from', 'Minute')).toBeNull();
    await press(spin('from', 'Hour'), 'ArrowUp');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    const { from, to } = host.clock();
    expect([from?.getMinutes(), to?.getMinutes()]).toEqual([0, 0]);
    expect(input('clock').value).toMatch(/\d - \d/);
  });

  it('focuses the first time spinbutton with timeOnly', async () => {
    await open('clock');
    expect(document.activeElement).toBe(spin('from', 'Hour'));
  });

  it('clears the draft with the Clear button, applied with Submit', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await click(popup()!.querySelector('.hx-date-picker-button') as HTMLElement);
    expect(host.basic().from).not.toBeNull();
    await submit();
    expect(host.basic()).toEqual({ from: null, to: null });
    expect(popup()).toBeNull();
  });
  it('closes with Escape and returns the focus to the field', async () => {
    await open('basic');
    popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(popup()).toBeNull();
    expect(document.activeElement).toBe(input('basic'));
  });

  it('opens with Arrow Down on the field', async () => {
    input('basic').dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(popup()).not.toBeNull();
  });

  it('is disabled as a whole', async () => {
    expect(input('off').disabled).toBe(true);
    expect(el('off').querySelector<HTMLButtonElement>('button')?.disabled).toBe(true);
    await open('off');
    expect(popup()).toBeNull();
  });

  it('works with ngModel', async () => {
    expect(input('model').value).toBe('9/9/2026'.replace('9/9', '10/9') + ' 09:00 -');
    await open('model');
    await click(day(12));
    await submit();
    expect(host.modelValue).toEqual({
      from: new Date(2026, 9, 9, 9, 0),
      to: new Date(2026, 9, 12, 9, 0),
    });
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(input('reactive').value).toBe('10/3/2026 12:00 -');
    host.control.disable();
    await settle();
    expect(input('reactive').disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    host.state.set({
      span: {
        from: new Date(2026, 9, 6, 7, 0),
        to: new Date(2026, 9, 7, 7, 0),
      },
    });
    await settle();
    expect(input('signal').value).toBe('10/6/2026 07:00 - 10/7/2026 07:00');
    await open('signal');
    await click(day(10));
    await click(day(11));
    await submit();
    expect(host.state().span).toEqual({
      from: new Date(2026, 9, 10, 7, 0),
      to: new Date(2026, 9, 11, 7, 0),
    });
  });

  it('keeps the field readonly unless typeable', async () => {
    expect(input('basic').readOnly).toBe(true);
    expect(input('typed').readOnly).toBe(false);
    // a read-only field takes no typing: an input event (as from a script) changes nothing
    input('labels').value = '1/5/2026 00:00 to 1/6/2026 00:00';
    input('labels').dispatchEvent(new Event('input'));
    input('labels').dispatchEvent(new Event('change'));
    await settle();
    expect(host.labels()).toEqual({
      from: new Date(2026, 0, 1, 0, 0),
      to: new Date(2026, 0, 2, 0, 15),
    });
  });

  it('commits a typed range', async () => {
    await type('typed', '10/12/2026 08:30 - 10/14/2026 16:45');
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 12, 8, 30),
      to: new Date(2026, 9, 14, 16, 45),
    });
    expect(input('typed').value).toBe('10/12/2026 08:30 - 10/14/2026 16:45');
  });

  it('commits a typed range with Enter without opening the popup', async () => {
    await type('typed', '2026-10-20 7:05 - 2026-10-21 3:15 PM', 'Enter');
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 20, 7, 5),
      to: new Date(2026, 9, 21, 15, 15),
    });
    expect(popup()).toBeNull();
  });

  it('orders a typed range whose to is before its from', async () => {
    await type('typed', '10/14/2026 10:00 - 10/12/2026 09:00');
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 12, 9, 0),
      to: new Date(2026, 9, 14, 10, 0),
    });
  });

  it('takes a typed side alone and empties the range for an empty text', async () => {
    await type('typed', '10/12/2026 08:00 -');
    expect(host.typed()).toEqual({ from: new Date(2026, 9, 12, 8, 0), to: null });
    expect(input('typed').value).toBe('10/12/2026 08:00 -');
    await type('typed', '   ');
    expect(host.typed()).toEqual({ from: null, to: null });
    expect(input('typed').value).toBe('');
  });

  it('reverts invalid typed text', async () => {
    const before = host.typed();
    for (const text of [
      'soon',
      '10/12/2026 08:00 - later',
      '2/31/2026 08:00 - 3/1/2026 08:00',
      '10/12/2026 25:00 - 10/14/2026 08:00',
      '10/12/2026 08:00 - 10/13/2026 08:00 - 10/14/2026 08:00',
    ]) {
      await type('typed', text);
      expect(host.typed()).toBe(before);
      expect(input('typed').value).toBe('10/9/2026 09:00 - 10/10/2026 17:00');
    }
  });

  it('types days only without the time pickers', async () => {
    await type('typedDays', '2026-10-12 - 2026-10-14');
    expect(host.typedDays()).toEqual({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 14),
    });
    expect(input('typedDays').value).toBe('10/12/2026 - 10/14/2026');
  });

  it('refuses a typed time when the time pickers are hidden', async () => {
    await type('typedDays', '10/12/2026 - 10/14/2026');
    await type('typedDays', '10/20/2026 08:00 - 10/21/2026');
    expect(host.typedDays()).toEqual({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 14),
    });
    expect(input('typedDays').value).toBe('10/12/2026 - 10/14/2026');
  });

  it('types hours on the day of the value with timeOnly', async () => {
    await type('typedClock', '8 - 18');
    expect(host.typedClock()).toEqual({
      from: new Date(2026, 9, 9, 8, 0),
      to: new Date(2026, 9, 9, 18, 0),
    });
  });

  it('refuses a typed side on a disabled day or outside minDate and maxDate', async () => {
    for (const text of [
      '10/13/2026 09:00 - 10/14/2026 09:00',
      '10/5/2026 07:59 - 10/6/2026 09:00',
      '10/27/2026 09:00 - 10/28/2026 17:01',
    ]) {
      await type('typedLimits', text);
      expect(host.typedLimits()).toEqual({ from: null, to: null });
      expect(input('typedLimits').value).toBe('');
    }
    await type('typedLimits', '10/5/2026 08:00 - 10/28/2026 17:00');
    expect(host.typedLimits()).toEqual({
      from: new Date(2026, 9, 5, 8, 0),
      to: new Date(2026, 9, 28, 17, 0),
    });
  });

  it('drops the typed text when the value changes from outside', async () => {
    input('typed').value = '10/12/2026 08:';
    input('typed').dispatchEvent(new Event('input'));
    await settle();
    host.typed.set({ from: new Date(2026, 9, 1, 6, 0), to: null });
    await settle();
    expect(input('typed').value).toBe('10/1/2026 06:00 -');
    input('typed').dispatchEvent(new Event('change'));
    await settle();
    expect(host.typed()).toEqual({ from: new Date(2026, 9, 1, 6, 0), to: null });
  });

  it('reverts the typed text with Escape', async () => {
    input('typed').value = '10/12/2026 08:';
    input('typed').dispatchEvent(new Event('input'));
    await settle();
    await press(input('typed'), 'Escape');
    expect(input('typed').value).toBe('10/9/2026 09:00 - 10/10/2026 17:00');
    input('typed').dispatchEvent(new Event('change'));
    await settle();
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 9, 9, 0),
      to: new Date(2026, 9, 10, 17, 0),
    });
  });

  it('keeps a surrounding form from submitting on Enter', async () => {
    input('typed').value = '10/12/2026 08:00 - 10/14/2026 09:00';
    input('typed').dispatchEvent(new Event('input'));
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input('typed').dispatchEvent(enter);
    await settle();
    expect(enter.defaultPrevented).toBe(true);
    expect(host.typed().from).toEqual(new Date(2026, 9, 12, 8, 0));
  });

  it('puts a range typed while the popup is open into the draft', async () => {
    await press(input('typed'), 'ArrowDown');
    await type('typed', '10/12/2026 08:00 - 10/14/2026 09:00', 'Enter');
    expect(now('from', 'Hour')).toBe('8');
    await submit();
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 14, 9, 0),
    });
  });

  it('does not emit when the typed range is the value', async () => {
    const before = host.typed();
    const changes: HxDateTimeRangeValue[] = [];
    const picker = fixture.debugElement.query(By.css('#typed'))
      .componentInstance as HxDateTimeRangePicker;
    picker.value.subscribe((v) => changes.push(v));
    await type('typed', '10/9/2026 9:00 - 10/10/2026 5:00 PM');
    expect(host.typed()).toBe(before);
    expect(changes).toEqual([]);
  });

  it('splits on a separator with regex characters only where it stands alone', async () => {
    await type('typedSep', '10/12/2026 08:00 . 10/14/2026 09:00');
    expect(host.typedSep()).toEqual({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 14, 9, 0),
    });
    await type('typedSep', '10/15/2026 08:00 x 10/16/2026 09:00');
    expect(host.typedSep().from).toEqual(new Date(2026, 9, 12, 8, 0));
    host.sep.set('|');
    await settle();
    await type('typedSep', '10/20/2026 08:00 | 10/21/2026 09:00');
    expect(host.typedSep()).toEqual({
      from: new Date(2026, 9, 20, 8, 0),
      to: new Date(2026, 9, 21, 9, 0),
    });
    expect(input('typedSep').value).toBe('10/20/2026 08:00 | 10/21/2026 09:00');
  });

  it('takes a typed text without the separator as from', async () => {
    await type('typed', '10/12/2026 08:00');
    expect(host.typed()).toEqual({ from: new Date(2026, 9, 12, 8, 0), to: null });
  });

  it('puts a typed to time on the day of to, else of from, with timeOnly', async () => {
    host.typedClock.set({ from: new Date(2026, 9, 9, 9, 0), to: new Date(2026, 9, 11, 17, 0) });
    await settle();
    await type('typedClock', '8 - 18');
    expect(host.typedClock()).toEqual({
      from: new Date(2026, 9, 9, 8, 0),
      to: new Date(2026, 9, 11, 18, 0),
    });
    host.typedClock.set({ from: new Date(2026, 9, 9, 9, 0), to: null });
    await settle();
    await type('typedClock', '8 - 18');
    expect(host.typedClock()).toEqual({
      from: new Date(2026, 9, 9, 8, 0),
      to: new Date(2026, 9, 9, 18, 0),
    });
  });

  it('takes no typing while disabled', async () => {
    expect(input('typedOff').disabled).toBe(true);
    await type('typedOff', '10/12/2026 08:00 - 10/14/2026 09:00');
    expect(host.typed()).toEqual({
      from: new Date(2026, 9, 9, 9, 0),
      to: new Date(2026, 9, 10, 17, 0),
    });
  });

  it('opens a typeable field with Alt+Arrow Up', async () => {
    input('typed').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true, bubbles: true }),
    );
    await settle();
    expect(popup()).not.toBeNull();
  });

  it('opens a read-only field with a click, Enter and Space', async () => {
    await click(input('basic'));
    expect(popup()).not.toBeNull();
    await close();
    expect(popup()).toBeNull();
    await press(input('basic'), 'Enter');
    expect(popup()).not.toBeNull();
    await close();
    await press(input('basic'), ' ');
    expect(popup()).not.toBeNull();
  });

  it('opens a typeable field with the button or Arrow Down, not with a click or Space', async () => {
    await click(input('typed'));
    await press(input('typed'), ' ');
    expect(popup()).toBeNull();
    await press(input('typed'), 'ArrowDown');
    expect(popup()).not.toBeNull();
  });

  it('marks ngModel touched when the focus leaves', async () => {
    el('model').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('model').classList).toContain('ng-touched');
  });

  describe('quick select', () => {
    const NOW = new Date(2026, 9, 14, 15, 30, 20);
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
      localStorage.clear();
    });
    const q = <T extends Element = HTMLElement>(selector: string) =>
      popup()!.querySelector(selector) as T;
    const choose = async (selectClass: string, label: string) => {
      await click(q(`.${selectClass} .hx-select-trigger`));
      const opt = [...document.querySelectorAll<HTMLElement>('.hx-select-option')].find(
        (o) => o.textContent?.trim() === label,
      );
      if (!opt) throw new Error(`no option ${label}`);
      await click(opt);
    };
    const fill = async (field: HTMLInputElement, text: string) => {
      field.value = text;
      field.dispatchEvent(new Event('input'));
      field.dispatchEvent(new Event('change'));
      await settle();
    };
    const listed = (cls: string) =>
      [...popup()!.querySelectorAll(`.${cls} button`)].map((b) => b.textContent?.trim());
    const rangeButton = (cls: string, label: string) =>
      [...popup()!.querySelectorAll<HTMLElement>(`.${cls} button`)].find(
        (b) => b.textContent?.trim() === label,
      ) as HTMLElement;
    const tabs = (side: 'from' | 'to') => [
      ...popup()!.querySelectorAll<HTMLElement>(
        `.hx-date-time-range-picker-side-${side} [role=tab]`,
      ),
    ];
    const tab = (side: 'from' | 'to', label: string) =>
      tabs(side).find((t) => t.textContent?.trim() === label) as HTMLElement;
    const sidePanel = (side: 'from' | 'to') =>
      q(`.hx-date-time-range-picker-side-${side} [role=tabpanel]`);
    const applyQuick = () => click(q('.hx-date-time-range-picker-quick-apply'));

    it('is off by default: the popup stays as it was', async () => {
      await open('basic');
      expect(popup()!.querySelector('.hx-date-time-range-picker-quick')).toBeNull();
      expect(popup()!.querySelector('[role=tablist]')).toBeNull();
    });

    it('shows the quick select above the calendar and focuses its first control', async () => {
      await open('quick');
      expect(q('.hx-date-time-range-picker-quick')).not.toBeNull();
      expect(q('.hx-date-time-range-picker-days')).not.toBeNull();
      expect(document.activeElement).toBe(
        q('.hx-date-time-range-picker-quick-direction .hx-select-trigger'),
      );
      expect(listed('hx-date-time-range-picker-common')).toEqual([
        'Today',
        'This week',
        'Last 15 minutes',
        'Last 30 minutes',
        'Last 1 hour',
        'Last 24 hours',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last 1 year',
      ]);
      // nothing applied yet: no Recently used list
      expect(popup()!.querySelector('.hx-date-time-range-picker-recent')).toBeNull();
    });

    it('applies Last 15 minutes against the current time and sets the expression', async () => {
      await open('quick');
      await applyQuick();
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 14, 15, 15, 20),
        to: new Date(2026, 9, 14, 15, 30, 20),
      });
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(input('quick'));
    });

    it('applies Next N unit chosen with the selects and the amount', async () => {
      await open('quick');
      await choose('hx-date-time-range-picker-quick-direction', 'Next');
      // the select list is its own overlay: choosing in it keeps the popup open
      expect(popup()).not.toBeNull();
      await fill(q<HTMLInputElement>('.hx-date-time-range-picker-quick-amount'), '2');
      await choose('hx-date-time-range-picker-quick-unit', 'days');
      await applyQuick();
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 14, 15, 30, 20),
        to: new Date(2026, 9, 16, 15, 30, 20),
      });
      expect(host.quickExpr()).toEqual({ from: 'now', to: 'now+2d' });
    });

    it('resolves the expression when applied, not when the popup opened', async () => {
      await open('quick');
      vi.setSystemTime(new Date(2026, 9, 14, 16, 0, 0));
      await applyQuick();
      expect(host.quick().to).toEqual(new Date(2026, 9, 14, 16, 0, 0));
    });

    it('applies nothing for an amount that is not a positive whole number', async () => {
      await open('quick');
      for (const amount of ['0', '-3', '1.5', '']) {
        await fill(q<HTMLInputElement>('.hx-date-time-range-picker-quick-amount'), amount);
        await applyQuick();
        expect(popup()).not.toBeNull();
      }
      expect(host.quick()).toEqual({ from: null, to: null });
      expect(host.quickExpr()).toBeNull();
    });

    it('applies the quick range with Enter in the amount field', async () => {
      await open('quick');
      await fill(q<HTMLInputElement>('.hx-date-time-range-picker-quick-amount'), '30');
      await press(q('.hx-date-time-range-picker-quick-amount'), 'Enter');
      expect(host.quickExpr()).toEqual({ from: 'now-30m', to: 'now' });
    });

    it('applies a commonly used range, rounding the end up', async () => {
      await open('quick');
      await click(rangeButton('hx-date-time-range-picker-common', 'Today'));
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
      expect(host.quickExpr()).toEqual({ from: 'now/d', to: 'now/d' });
    });

    it('lists recently used ranges, newest first, de-duplicated, at most five', async () => {
      const apply = async (label: string) => {
        await open('quick');
        await click(rangeButton('hx-date-time-range-picker-common', label));
      };
      for (const label of [
        'Today',
        'Last 1 hour',
        'Today',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last 1 year',
      ]) {
        await apply(label);
      }
      await open('quick');
      expect(listed('hx-date-time-range-picker-recent')).toEqual([
        'Last 1 year',
        'Last 90 days',
        'Last 30 days',
        'Last 7 days',
        'Today',
      ]);
      expect(JSON.parse(localStorage.getItem('hx-test-recent')!)[0]).toEqual({
        from: 'now-1y',
        to: 'now',
      });
    });

    it('reads the recently used ranges from localStorage and applies one', async () => {
      localStorage.setItem(
        'hx-test-recent',
        JSON.stringify([
          { from: 'now-45m', to: 'now' },
          {
            from: new Date(2026, 9, 1, 8, 0).toISOString(),
            to: new Date(2026, 9, 2, 8, 0).toISOString(),
          },
        ]),
      );
      await open('quick');
      expect(listed('hx-date-time-range-picker-recent')).toEqual([
        'Last 45 minutes',
        '10/1/2026 08:00 - 10/2/2026 08:00',
      ]);
      await click(rangeButton('hx-date-time-range-picker-recent', 'Last 45 minutes'));
      expect(host.quick().from).toEqual(new Date(2026, 9, 14, 14, 45, 20));
      await open('quick');
      await click(
        popup()!.querySelectorAll<HTMLElement>('.hx-date-time-range-picker-recent button')[1],
      );
      // an absolute recent range is applied as is and clears the expression
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 1, 8, 0),
        to: new Date(2026, 9, 2, 8, 0),
      });
      expect(host.quickExpr()).toBeNull();
    });

    it('works when the storage is blocked', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
      await open('quick');
      await applyQuick();
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
      // the list cannot be read back: the in-memory list of the session stays
      await open('quick');
      expect(listed('hx-date-time-range-picker-recent')).toEqual(['Last 15 minutes']);
      await click(rangeButton('hx-date-time-range-picker-common', 'Today'));
      await open('quick');
      expect(listed('hx-date-time-range-picker-recent')).toEqual(['Today', 'Last 15 minutes']);
    });

    it('keeps the recently used list in memory without a storage key', async () => {
      await open('quickLimits');
      await click(rangeButton('hx-date-time-range-picker-common', 'Last 1 hour'));
      await open('quickLimits');
      expect(listed('hx-date-time-range-picker-recent')).toEqual(['Last 1 hour']);
      expect(localStorage.length).toBe(0);
    });

    it('has a tab list per side with the ARIA roles', async () => {
      await open('quick');
      for (const side of ['from', 'to'] as const) {
        const list = q(`.hx-date-time-range-picker-side-${side} [role=tablist]`);
        expect(list.getAttribute('aria-labelledby')).toBeTruthy();
        expect(tabs(side).map((t) => t.textContent?.trim())).toEqual([
          'Absolute',
          'Relative',
          'Now',
        ]);
        expect(tabs(side).map((t) => t.getAttribute('aria-selected'))).toEqual([
          'true',
          'false',
          'false',
        ]);
        expect(tabs(side).map((t) => t.tabIndex)).toEqual([0, -1, -1]);
        expect(tabs(side)[0].getAttribute('aria-controls')).toBe(sidePanel(side).id);
        expect(sidePanel(side).getAttribute('aria-labelledby')).toBe(tabs(side)[0].id);
      }
      expect(
        document.getElementById(
          q('.hx-date-time-range-picker-side-from').getAttribute('aria-labelledby')!,
        )?.textContent,
      ).toBe('Start');
    });

    it('moves between the tabs with the arrow keys, Home and End', async () => {
      await open('quick');
      tabs('from')[0].focus();
      await press(tabs('from')[0], 'ArrowRight');
      expect(tab('from', 'Relative').getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tab('from', 'Relative'));
      expect(sidePanel('from').getAttribute('aria-labelledby')).toBe(tab('from', 'Relative').id);
      await press(tab('from', 'Relative'), 'End');
      expect(document.activeElement).toBe(tab('from', 'Now'));
      await press(tab('from', 'Now'), 'ArrowRight');
      expect(document.activeElement).toBe(tab('from', 'Absolute'));
      await press(tab('from', 'Absolute'), 'ArrowLeft');
      expect(document.activeElement).toBe(tab('from', 'Now'));
      await press(tab('from', 'Now'), 'Home');
      expect(document.activeElement).toBe(tab('from', 'Absolute'));
      // the other side keeps its tab
      expect(tab('to', 'Absolute').getAttribute('aria-selected')).toBe('true');
      // other keys are left alone
      await press(tab('from', 'Absolute'), 'ArrowDown');
      expect(tab('from', 'Absolute').getAttribute('aria-selected')).toBe('true');
    });

    it('applies a relative start and a Now end with Submit', async () => {
      await open('quick');
      await click(tab('from', 'Relative'));
      await fill(q<HTMLInputElement>('.hx-date-time-range-picker-side-amount'), '3');
      await choose('hx-date-time-range-picker-side-unit', 'Hours ago');
      await click(q('.hx-date-time-range-picker-side-round input'));
      expect(q('.hx-date-time-range-picker-side-round').textContent?.trim()).toBe(
        'Round to the hour',
      );
      expect(q('.hx-date-time-range-picker-expression').textContent).toBe('now-3h/h');
      // the calendar and the time pickers show the relative side until it is applied
      expect(now('from', 'Hour')).toBe('12');
      await click(tab('to', 'Now'));
      expect(sidePanel('to').textContent).toContain('current time');
      vi.setSystemTime(new Date(2026, 9, 14, 17, 10, 0));
      await submit();
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 14, 14, 0, 0),
        to: new Date(2026, 9, 14, 17, 10, 0),
      });
      expect(host.quickExpr()).toEqual({ from: 'now-3h/h', to: 'now' });
      expect(popup()).toBeNull();
    });

    it('keeps an absolute side as an ISO date next to a relative one', async () => {
      host.quick.set({ from: null, to: new Date(2026, 9, 20, 12, 0) });
      await settle();
      await open('quick');
      await click(tab('from', 'Now'));
      await submit();
      expect(host.quick()).toEqual({ from: NOW, to: new Date(2026, 9, 20, 12, 0) });
      expect(host.quickExpr()).toEqual({
        from: 'now',
        to: new Date(2026, 9, 20, 12, 0).toISOString(),
      });
    });

    const error = () => popup()!.querySelector('.hx-date-time-range-picker-error');
    const submitButton = () => q('.hx-date-time-range-picker-submit');

    it('shows an error linked to Submit for a relative side next to an empty absolute side', async () => {
      await open('quick');
      expect(error()).toBeNull();
      expect(submitButton().hasAttribute('aria-describedby')).toBe(false);
      await click(tab('from', 'Now'));
      await submit();
      expect(popup()).not.toBeNull();
      expect(host.quick()).toEqual({ from: null, to: null });
      expect(error()?.getAttribute('role')).toBe('alert');
      expect(error()?.textContent?.trim()).toBe('Choose a start and an end that can be applied.');
      expect(submitButton().getAttribute('aria-describedby')).toBe(error()!.id);
      // a new attempt drops the error
      await click(tab('to', 'Now'));
      expect(error()).toBeNull();
      expect(submitButton().hasAttribute('aria-describedby')).toBe(false);
      await submit();
      expect(host.quick()).toEqual({ from: NOW, to: NOW });
    });

    it('shows the error when Submit is refused on a day in disabledDates', async () => {
      vi.setSystemTime(new Date(2026, 9, 13, 10, 0));
      await open('quickDays');
      await click(tab('from', 'Now'));
      await click(tab('to', 'Now'));
      await submit();
      expect(error()).not.toBeNull();
      expect(host.quickDays()).toEqual({ from: null, to: null });
      // the error is gone when the popup opens again
      await close();
      await open('quickDays');
      expect(error()).toBeNull();
    });

    it('resets the tabs to Absolute when a preset is chosen', async () => {
      host.quickExpr.set({ from: 'now-1d/d', to: 'now' });
      await settle();
      await open('quick');
      expect(tab('from', 'Relative').getAttribute('aria-selected')).toBe('true');
      expect(tab('to', 'Now').getAttribute('aria-selected')).toBe('true');
      await click(preset('Morning'));
      expect(tab('from', 'Absolute').getAttribute('aria-selected')).toBe('true');
      expect(tab('to', 'Absolute').getAttribute('aria-selected')).toBe('true');
      await submit();
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 7, 6, 0),
        to: new Date(2026, 9, 7, 12, 30),
      });
      expect(host.quickExpr()).toBeNull();
    });

    it('sets up the tabs from the expression model', async () => {
      host.quickExpr.set({ from: 'now-1d/d', to: 'now' });
      await settle();
      await open('quick');
      expect(tab('from', 'Relative').getAttribute('aria-selected')).toBe('true');
      expect(q<HTMLInputElement>('.hx-date-time-range-picker-side-amount').value).toBe('1');
      expect(q('.hx-date-time-range-picker-side-unit .hx-select-trigger').textContent?.trim()).toBe(
        'Days ago',
      );
      expect(q<HTMLInputElement>('.hx-date-time-range-picker-side-round input').checked).toBe(true);
      expect(tab('to', 'Now').getAttribute('aria-selected')).toBe('true');
      await submit();
      expect(host.quick()).toEqual({ from: new Date(2026, 9, 13), to: NOW });
    });

    it('clears the expression when an absolute range is picked', async () => {
      host.quickExpr.set({ from: 'now-15m', to: 'now' });
      await settle();
      await open('quick');
      // a day click makes both sides absolute
      await click(day(20));
      await click(day(22));
      expect(tab('from', 'Absolute').getAttribute('aria-selected')).toBe('true');
      expect(tab('to', 'Absolute').getAttribute('aria-selected')).toBe('true');
      await submit();
      expect(host.quick()).toEqual({ from: new Date(2026, 9, 20), to: new Date(2026, 9, 22) });
      expect(host.quickExpr()).toBeNull();
      // the absolute range is remembered too
      await open('quick');
      expect(listed('hx-date-time-range-picker-recent')).toHaveLength(1);
    });

    it('clears the expression when a range is typed into the field', async () => {
      await open('quick');
      await applyQuick();
      expect(host.quickExpr()).not.toBeNull();
      await type('quick', '10/1/2026 08:00 - 10/2/2026 08:00');
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 1, 8, 0),
        to: new Date(2026, 9, 2, 8, 0),
      });
      expect(host.quickExpr()).toBeNull();
    });

    it('types a date on the Absolute tab and refuses an unreadable or crossing one', async () => {
      host.quick.set({ from: new Date(2026, 9, 10, 9, 0), to: new Date(2026, 9, 12, 9, 0) });
      await settle();
      await open('quick');
      const from = q<HTMLInputElement>('.hx-date-time-range-picker-side-from input');
      expect(from.value).toBe('10/10/2026 09:00');
      expect(from.getAttribute('aria-label')).toBe('Start Date');
      await fill(from, '10/11/2026 07:30');
      expect(now('from', 'Hour')).toBe('7');
      await fill(from, 'soon');
      expect(from.value).toBe('10/11/2026 07:30');
      await fill(from, '10/13/2026 07:30');
      expect(from.value).toBe('10/11/2026 07:30');
      await submit();
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 11, 7, 30),
        to: new Date(2026, 9, 12, 9, 0),
      });
    });

    it('keeps an applied range inside minDate and maxDate', async () => {
      await open('quickLimits');
      await click(rangeButton('hx-date-time-range-picker-common', 'Last 30 days'));
      expect(host.quickLimits()).toEqual({ from: host.min, to: NOW });
      await open('quickLimits');
      await choose('hx-date-time-range-picker-quick-direction', 'Next');
      await fill(q<HTMLInputElement>('.hx-date-time-range-picker-quick-amount'), '1');
      await choose('hx-date-time-range-picker-quick-unit', 'months');
      await applyQuick();
      expect(host.quickLimits()).toEqual({ from: NOW, to: host.max });
    });

    it('keeps midnight without the time pickers and takes labels and commonly used ranges', async () => {
      await open('quickDays');
      expect(
        q('.hx-date-time-range-picker-quick-section .hx-date-time-range-picker-caption')
          .textContent,
      ).toBe('Schnellauswahl');
      expect(q('.hx-date-time-range-picker-quick-apply').textContent).toBe('Anwenden');
      expect(listed('hx-date-time-range-picker-common')).toEqual(['Heute']);
      await click(rangeButton('hx-date-time-range-picker-common', 'Heute'));
      expect(host.quickDays()).toEqual({ from: new Date(2026, 9, 14), to: new Date(2026, 9, 14) });
      await open('quickDays');
      await applyQuick();
      expect(host.quickDays()).toEqual({ from: new Date(2026, 9, 14), to: new Date(2026, 9, 14) });
    });

    it('refuses a range with a side on a day in disabledDates', async () => {
      vi.setSystemTime(new Date(2026, 9, 13, 10, 0));
      await open('quickDays');
      await click(rangeButton('hx-date-time-range-picker-common', 'Heute'));
      expect(popup()).not.toBeNull();
      expect(host.quickDays()).toEqual({ from: null, to: null });
    });

    it('works with ngModel, a reactive FormControl and a signal form field', async () => {
      await open('quickModel');
      await applyQuick();
      expect(host.quickModel).toEqual({
        from: new Date(2026, 9, 14, 15, 15, 20),
        to: NOW,
      });
      await open('quickReactive');
      await click(rangeButton('hx-date-time-range-picker-common', 'Last 1 hour'));
      expect(host.quickControl.value).toEqual({ from: new Date(2026, 9, 14, 14, 30, 20), to: NOW });
      expect(host.quickControl.dirty).toBe(true);
      await open('quickSignal');
      await click(rangeButton('hx-date-time-range-picker-common', 'Today'));
      expect(host.state().span).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
    });

    it('does not open while disabled', async () => {
      await open('quickOff');
      expect(popup()).toBeNull();
      host.quickControl.disable();
      await settle();
      await open('quickReactive');
      expect(popup()).toBeNull();
    });

    it('closes with Escape without applying', async () => {
      await open('quick');
      await click(tab('from', 'Now'));
      await close();
      expect(popup()).toBeNull();
      expect(host.quick()).toEqual({ from: null, to: null });
      expect(host.quickExpr()).toBeNull();
    });
  });
});
