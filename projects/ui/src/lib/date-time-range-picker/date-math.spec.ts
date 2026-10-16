import { hxParseDateMath, hxRelativeRangeExpressions } from './date-math';

describe('hxParseDateMath', () => {
  // Wednesday 2026-03-18 14:35:20.500 local time.
  const now = new Date(2026, 2, 18, 14, 35, 20, 500);
  const parse = (expression: string, extra = {}) => hxParseDateMath(expression, { now, ...extra });

  it('resolves now to a copy of the injected now', () => {
    const result = parse('now');
    expect(result).toEqual(now);
    expect(result).not.toBe(now);
  });

  it('defaults now to the current time', () => {
    const before = Date.now();
    const result = hxParseDateMath('now')!.getTime();
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(Date.now());
  });

  it.each([
    ['now-30s', new Date(2026, 2, 18, 14, 34, 50, 500)],
    ['now-15m', new Date(2026, 2, 18, 14, 20, 20, 500)],
    ['now+2h', new Date(2026, 2, 18, 16, 35, 20, 500)],
    ['now+2d', new Date(2026, 2, 20, 14, 35, 20, 500)],
    ['now-1w', new Date(2026, 2, 11, 14, 35, 20, 500)],
    ['now-1M', new Date(2026, 1, 18, 14, 35, 20, 500)],
    ['now+1y', new Date(2027, 2, 18, 14, 35, 20, 500)],
    ['now-0d', now],
  ])('shifts %s', (expression, expected) => {
    expect(parse(expression)).toEqual(expected);
  });

  it.each([
    ['now/s', new Date(2026, 2, 18, 14, 35, 20)],
    ['now/m', new Date(2026, 2, 18, 14, 35)],
    ['now/h', new Date(2026, 2, 18, 14)],
    ['now/d', new Date(2026, 2, 18)],
    ['now/M', new Date(2026, 2, 1)],
    ['now/y', new Date(2026, 0, 1)],
  ])('rounds down %s', (expression, expected) => {
    expect(parse(expression)).toEqual(expected);
  });

  it('rounds up to the last millisecond of the unit with roundUp', () => {
    expect(parse('now/d', { roundUp: true })).toEqual(new Date(2026, 2, 18, 23, 59, 59, 999));
    expect(parse('now/M', { roundUp: true })).toEqual(new Date(2026, 2, 31, 23, 59, 59, 999));
    expect(parse('now/y', { roundUp: true })).toEqual(new Date(2026, 11, 31, 23, 59, 59, 999));
    expect(parse('now/h', { roundUp: true })).toEqual(new Date(2026, 2, 18, 14, 59, 59, 999));
  });

  it('combines shifts and rounding left to right', () => {
    expect(parse('now-1d/d')).toEqual(new Date(2026, 2, 17));
    expect(parse('now-1d/d', { roundUp: true })).toEqual(new Date(2026, 2, 17, 23, 59, 59, 999));
    expect(parse('now/d+6h')).toEqual(new Date(2026, 2, 18, 6));
    expect(parse('now-1M/M')).toEqual(new Date(2026, 1, 1));
    expect(parse('now+1d-2h')).toEqual(new Date(2026, 2, 19, 12, 35, 20, 500));
  });

  describe('/w and firstDayOfWeek', () => {
    it('starts on Sunday by default', () => {
      expect(parse('now/w')).toEqual(new Date(2026, 2, 15));
    });

    it('starts on Monday with firstDayOfWeek 1', () => {
      expect(parse('now/w', { firstDayOfWeek: 1 })).toEqual(new Date(2026, 2, 16));
      expect(parse('now/w', { firstDayOfWeek: 1, roundUp: true })).toEqual(
        new Date(2026, 2, 22, 23, 59, 59, 999),
      );
    });

    it('stays on the same day when now is the first day of the week', () => {
      expect(parse('now/w', { firstDayOfWeek: 3 })).toEqual(new Date(2026, 2, 18));
    });

    it('crosses month boundaries', () => {
      const sunday = new Date(2026, 2, 1, 10);
      expect(hxParseDateMath('now/w', { now: sunday, firstDayOfWeek: 1 })).toEqual(
        new Date(2026, 1, 23),
      );
    });
  });

  describe('calendar edges', () => {
    it('clamps a month shift to the end of a shorter month', () => {
      const date = new Date(2026, 2, 31, 9);
      expect(hxParseDateMath('now-1M', { now: date })).toEqual(new Date(2026, 1, 28, 9));
      expect(hxParseDateMath('now+11M', { now: new Date(2026, 0, 31) })).toEqual(
        new Date(2026, 11, 31),
      );
    });

    it('clamps 29 Feb of a leap year when shifting years', () => {
      expect(hxParseDateMath('now+1y', { now: new Date(2028, 1, 29) })).toEqual(
        new Date(2029, 1, 28),
      );
    });

    it('crosses year boundaries', () => {
      expect(hxParseDateMath('now+1M', { now: new Date(2026, 11, 15) })).toEqual(
        new Date(2027, 0, 15),
      );
      expect(hxParseDateMath('now-1d', { now: new Date(2026, 0, 1, 8) })).toEqual(
        new Date(2025, 11, 31, 8),
      );
    });

    it('rounds up February in a leap year', () => {
      expect(hxParseDateMath('now/M', { now: new Date(2028, 1, 10), roundUp: true })).toEqual(
        new Date(2028, 1, 29, 23, 59, 59, 999),
      );
    });

    it('keeps the wall-clock time when day shifts cross a DST change', () => {
      // Whatever the runner time zone, a calendar day shift lands on the same local time.
      for (const month of [2, 9, 10]) {
        for (let day = 1; day <= 31; day += 3) {
          const date = new Date(2026, month, day, 12, 30);
          const result = hxParseDateMath('now+1d', { now: date })!;
          expect(result.getHours()).toBe(12);
          expect(result.getMinutes()).toBe(30);
          const back = hxParseDateMath('now-1w/d', { now: date })!;
          expect(back.getHours()).toBe(0);
        }
      }
    });
  });

  it('ignores surrounding whitespace', () => {
    expect(parse('  now-15m ')).toEqual(parse('now-15m'));
  });

  it.each([
    '',
    ' ',
    'foo',
    'Now',
    'now-',
    'now-m',
    'now-15',
    'now-15x',
    'now-15 m',
    'now - 15m',
    'now--15m',
    'now-1.5d',
    'now/',
    'now/x',
    'now/D',
    'now-15mm',
    '2026-03-18',
    'now-15m now',
    'now-99999999999999999999y',
  ])('returns null for the invalid expression %j', (expression) => {
    expect(parse(expression)).toBeNull();
  });

  it('returns null for a non-string expression', () => {
    expect(hxParseDateMath(undefined as unknown as string)).toBeNull();
    expect(hxParseDateMath(null as unknown as string)).toBeNull();
  });

  it('returns null for an invalid now', () => {
    expect(hxParseDateMath('now', { now: new Date(NaN) })).toBeNull();
  });
});

describe('hxRelativeRangeExpressions', () => {
  it('builds a Last N range ending now', () => {
    expect(hxRelativeRangeExpressions('last', 15, 'm')).toEqual({ from: 'now-15m', to: 'now' });
  });

  it('builds a Next N range starting now', () => {
    expect(hxRelativeRangeExpressions('next', 2, 'd')).toEqual({ from: 'now', to: 'now+2d' });
  });

  it('produces expressions the parser accepts', () => {
    const now = new Date(2026, 2, 18, 12);
    const range = hxRelativeRangeExpressions('last', 3, 'M')!;
    expect(hxParseDateMath(range.from, { now })).toEqual(new Date(2025, 11, 18, 12));
    expect(hxParseDateMath(range.to, { now })).toEqual(now);
  });

  it.each([0, -1, 1.5, NaN, Infinity, 1e21, Number.MAX_SAFE_INTEGER + 1])(
    'returns null for the amount %s',
    (amount) => {
      expect(hxRelativeRangeExpressions('last', amount, 'd')).toBeNull();
    },
  );
});
