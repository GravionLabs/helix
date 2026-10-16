import {
  addRecentRange,
  DEFAULT_SIDE,
  describeRange,
  HX_QUICK_SELECT_COMMONLY_USED,
  HX_QUICK_SELECT_LABELS,
  hxResolveRangeExpression,
  hxResolveRangeSide,
  readRecentRanges,
  sideExpression,
  sideFromExpression,
  writeRecentRanges,
} from './quick-select';

describe('quick select helpers', () => {
  const now = new Date(2026, 9, 14, 15, 30, 20);

  describe('sideFromExpression / sideExpression', () => {
    it('reads now as the Now tab', () => {
      expect(sideFromExpression('now').mode).toBe('now');
      expect(sideExpression({ ...DEFAULT_SIDE, mode: 'now' })).toBe('now');
    });

    it('reads a shift with an optional rounding in the same unit into the fields', () => {
      expect(sideFromExpression('now-15m')).toEqual({
        mode: 'relative',
        amount: 15,
        unit: 'm',
        direction: 'ago',
        round: false,
        raw: null,
      });
      expect(sideFromExpression(' now+2d/d ')).toEqual({
        mode: 'relative',
        amount: 2,
        unit: 'd',
        direction: 'fromNow',
        round: true,
        raw: null,
      });
      expect(sideFromExpression('now/w')).toMatchObject({ amount: 0, unit: 'w', round: true });
    });

    it('keeps other valid date math as raw and treats anything else as absolute', () => {
      expect(sideFromExpression('now-1d/d+2h')).toMatchObject({
        mode: 'relative',
        raw: 'now-1d/d+2h',
      });
      expect(sideFromExpression('now-1h/d')).toMatchObject({ mode: 'relative', raw: 'now-1h/d' });
      expect(sideFromExpression('2026-10-14T10:00:00.000Z').mode).toBe('absolute');
      expect(sideFromExpression('garbage').mode).toBe('absolute');
    });

    it('writes the expression of the fields', () => {
      const side = { ...DEFAULT_SIDE, mode: 'relative' as const };
      expect(sideExpression(side)).toBe('now-15m');
      expect(sideExpression({ ...side, amount: 3, unit: 'h', round: true })).toBe('now-3h/h');
      expect(sideExpression({ ...side, amount: 2, unit: 'M', direction: 'fromNow' })).toBe(
        'now+2M',
      );
      expect(sideExpression({ ...side, amount: 0, unit: 'd', round: true })).toBe('now/d');
      expect(sideExpression({ ...side, raw: 'now-1d/d+2h' })).toBe('now-1d/d+2h');
      expect(sideExpression({ ...side, amount: Number.NaN })).toBe('now');
      expect(sideExpression(DEFAULT_SIDE)).toBeNull();
    });
  });

  describe('hxResolveRangeExpression', () => {
    it('rounds from down and to up', () => {
      expect(hxResolveRangeExpression({ from: 'now/d', to: 'now/d' }, { now })).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
    });

    it('follows firstDayOfWeek and takes an ISO side', () => {
      expect(
        hxResolveRangeExpression(
          { from: 'now/w', to: '2026-10-20T08:00:00.000Z' },
          { now, firstDayOfWeek: 1 },
        ),
      ).toEqual({ from: new Date(2026, 9, 12), to: new Date('2026-10-20T08:00:00.000Z') });
    });

    it('gives null for an unreadable side', () => {
      expect(hxResolveRangeSide('later', { now })).toBeNull();
      expect(hxResolveRangeSide('2026-13-45', { now })).toBeNull();
      expect(hxResolveRangeSide('', { now })).toBeNull();
    });
  });

  describe('describeRange', () => {
    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const label = (from: string, to: string) =>
      describeRange({ from, to }, HX_QUICK_SELECT_LABELS, HX_QUICK_SELECT_COMMONLY_USED, format);

    it('names commonly used and Last/Next ranges', () => {
      expect(label('now/d', 'now/d')).toBe('Today');
      expect(label('now-45m', 'now')).toBe('Last 45 minutes');
      expect(label('now', 'now+1d')).toBe('Next 1 day');
      expect(label('now', 'now+2w')).toBe('Next 2 weeks');
    });

    it('lists both sides otherwise, absolute ones formatted', () => {
      expect(label('now-1d/d', 'now')).toBe('now-1d/d - now');
      expect(label('2026-10-01T00:00:00', '2026-10-02T00:00:00')).toBe('10/1/2026 - 10/2/2026');
      expect(label('bad', 'now')).toBe('bad - now');
    });

    it('takes localized labels', () => {
      const labels = {
        ...HX_QUICK_SELECT_LABELS,
        lastRange: 'Letzte {n} {unit}',
        units: { ...HX_QUICK_SELECT_LABELS.units, m: 'Minuten' },
      };
      expect(describeRange({ from: 'now-5m', to: 'now' }, labels, [], format)).toBe(
        'Letzte 5 Minuten',
      );
    });
  });

  describe('recently used', () => {
    const key = 'hx-test-quick-select';
    beforeEach(() => localStorage.clear());
    afterEach(() => {
      vi.restoreAllMocks();
      localStorage.clear();
    });

    it('puts a range first, without duplicates, at most five', () => {
      const r = (n: number) => ({ from: `now-${n}m`, to: 'now' });
      let list = [r(1), r(2), r(3)];
      list = addRecentRange(list, r(2));
      expect(list).toEqual([r(2), r(1), r(3)]);
      for (const n of [4, 5, 6, 7]) list = addRecentRange(list, r(n));
      expect(list).toEqual([r(7), r(6), r(5), r(4), r(2)]);
    });

    it('writes and reads the list', () => {
      writeRecentRanges(key, [{ from: 'now-15m', to: 'now' }]);
      expect(JSON.parse(localStorage.getItem(key)!)).toEqual([{ from: 'now-15m', to: 'now' }]);
      expect(readRecentRanges(key)).toEqual([{ from: 'now-15m', to: 'now' }]);
    });

    it('reads an empty list for nothing stored or damaged data, null without a key', () => {
      expect(readRecentRanges(key)).toEqual([]);
      expect(readRecentRanges(null)).toBeNull();
      localStorage.setItem(key, '{not json');
      expect(readRecentRanges(key)).toEqual([]);
      localStorage.setItem(key, JSON.stringify({ from: 'now', to: 'now' }));
      expect(readRecentRanges(key)).toEqual([]);
      localStorage.setItem(key, JSON.stringify([{ from: 1 }, { from: 'now-1h', to: 'now', x: 1 }]));
      expect(readRecentRanges(key)).toEqual([{ from: 'now-1h', to: 'now' }]);
    });

    it('is safe when the storage is blocked', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('full', 'QuotaExceededError');
      });
      expect(readRecentRanges(key)).toBeNull();
      expect(() => writeRecentRanges(key, [{ from: 'now', to: 'now' }])).not.toThrow();
    });

    it('writes nothing without a key', () => {
      writeRecentRanges(null, [{ from: 'now', to: 'now' }]);
      expect(localStorage.length).toBe(0);
    });
  });
});
