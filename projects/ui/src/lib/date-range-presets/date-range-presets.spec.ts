import {
  type HxDateTimeRangePreset,
  hxDateRangePresets,
  resolvePreset,
} from './date-range-presets';

const preset = (from: Date, to: Date): HxDateTimeRangePreset => ({
  label: 'Test',
  from: () => from,
  to: () => to,
});
const keep = (date: Date) => date;

describe('resolvePreset', () => {
  it('returns the ends as the fit makes them', () => {
    const range = resolvePreset(
      preset(new Date(2026, 9, 8, 9, 30), new Date(2026, 9, 10, 18)),
      { firstDayOfWeek: 0 },
      (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    expect(range).toEqual({ from: new Date(2026, 9, 8), to: new Date(2026, 9, 10) });
  });

  it('orders reversed ends', () => {
    const range = resolvePreset(
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
    resolvePreset(
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
      resolvePreset(p, { firstDayOfWeek: 0 }, (d, side) => (side === 'to' ? undefined : d)),
    ).toBeUndefined();
    expect(
      resolvePreset(p, { firstDayOfWeek: 0 }, (d, side) => (side === 'to' ? null : d)),
    ).toEqual({ from: new Date(2026, 9, 1), to: null });
  });

  it('passes the context to the preset (This week follows firstDayOfWeek)', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 14, 15, 30), toFake: ['Date'] });
    try {
      const week = hxDateRangePresets().find((p) => p.label === 'This week')!;
      expect(resolvePreset(week, { firstDayOfWeek: 1 }, keep)?.from).toEqual(new Date(2026, 9, 12));
    } finally {
      vi.useRealTimers();
    }
  });
});
