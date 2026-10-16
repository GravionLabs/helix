import {
  type HxDateTimeRangePreset,
  hxDateRangePresets,
  hxResolvePreset,
} from './date-range-presets';

const preset = (from: Date, to: Date): HxDateTimeRangePreset => ({
  label: 'Test',
  from: () => from,
  to: () => to,
});
const keep = (date: Date) => date;

describe('hxResolvePreset', () => {
  it('returns the ends as the fit makes them', () => {
    const range = hxResolvePreset(
      preset(new Date(2026, 9, 8, 9, 30), new Date(2026, 9, 10, 18)),
      { firstDayOfWeek: 0 },
      (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    expect(range).toEqual({ from: new Date(2026, 9, 8), to: new Date(2026, 9, 10) });
  });

  it('orders reversed ends', () => {
    const range = hxResolvePreset(
      preset(new Date(2026, 9, 20), new Date(2026, 9, 16)),
      {
        firstDayOfWeek: 0,
      },
      keep,
    );
    expect(range).toEqual({ from: new Date(2026, 9, 16), to: new Date(2026, 9, 20) });
  });

  it('tells the fit which end it reads', () => {
    const sides: string[] = [];
    hxResolvePreset(
      preset(new Date(2026, 9, 1), new Date(2026, 9, 2)),
      { firstDayOfWeek: 0 },
      (d, side) => {
        sides.push(side);
        return d;
      },
    );
    expect(sides).toEqual(['from', 'to']);
  });

  it('is undefined when the fit refuses an end, and keeps an empty end', () => {
    const p = preset(new Date(2026, 9, 1), new Date(2026, 9, 2));
    expect(
      hxResolvePreset(p, { firstDayOfWeek: 0 }, (d, side) => (side === 'to' ? undefined : d)),
    ).toBeUndefined();
    expect(
      hxResolvePreset(p, { firstDayOfWeek: 0 }, (d, side) => (side === 'to' ? null : d)),
    ).toEqual({ from: new Date(2026, 9, 1), to: null });
  });

  it('passes the context to the preset (This week follows firstDayOfWeek)', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 14, 15, 30), toFake: ['Date'] });
    try {
      const week = hxDateRangePresets().find((p) => p.label === 'This week')!;
      expect(hxResolvePreset(week, { firstDayOfWeek: 1 }, keep)?.from).toEqual(
        new Date(2026, 9, 12),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('built-in presets', () => {
  const NOW = new Date(2026, 9, 14, 15, 30, 20, 500);
  const by = (label: string, firstDayOfWeek = 0) => {
    const p = hxDateRangePresets().find((x) => x.label === label)!;
    return { from: p.from({ firstDayOfWeek }), to: p.to({ firstDayOfWeek }) };
  };

  beforeEach(() => vi.useFakeTimers({ now: NOW, toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  it('lists the presets in order with English labels', () => {
    expect(hxDateRangePresets().map((p) => p.label)).toEqual([
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
  });

  it('Yesterday spans the whole previous day, ending at .999', () => {
    expect(by('Yesterday')).toEqual({
      from: new Date(2026, 9, 13),
      to: new Date(2026, 9, 13, 23, 59, 59, 999),
    });
  });

  it('Last 30 days starts at midnight 29 days back and ends now', () => {
    expect(by('Last 30 days')).toEqual({ from: new Date(2026, 8, 15), to: NOW });
  });

  it('Last N minutes and hours count back from now', () => {
    expect(by('Last 15 minutes')).toEqual({
      from: new Date(2026, 9, 14, 15, 15, 20, 500),
      to: NOW,
    });
    expect(by('Last 1 hour').from).toEqual(new Date(2026, 9, 14, 14, 30, 20, 500));
    expect(by('Last 6 hours').from).toEqual(new Date(2026, 9, 14, 9, 30, 20, 500));
    expect(by('Last 24 hours').from).toEqual(new Date(2026, 9, 13, 15, 30, 20, 500));
  });

  it('ends This week and This month at .999 of their last day', () => {
    expect(by('This week', 1)).toEqual({
      from: new Date(2026, 9, 12),
      to: new Date(2026, 9, 18, 23, 59, 59, 999),
    });
    expect(by('This month')).toEqual({
      from: new Date(2026, 9, 1),
      to: new Date(2026, 9, 31, 23, 59, 59, 999),
    });
  });

  it('takes the given label and falls back to English for the others', () => {
    const labels = hxDateRangePresets({ today: 'Heute', yesterday: 'Gestern' }).map((p) => p.label);
    expect(labels.slice(6, 8)).toEqual(['Heute', 'Gestern']);
    expect(labels[0]).toBe('Last 15 minutes');
    expect(labels[9]).toBe('This month');
  });
});
