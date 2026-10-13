import {
  dateKey,
  dayKeyTarget,
  decadeOf,
  focusMonth,
  focusYear,
  isDateDisabled,
  isInRange,
  stepFocus,
} from './calendar-helpers';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

describe('calendar helpers', () => {
  it('builds the data-date key with a 1-based month', () => {
    expect(dateKey(d(2026, 9, 5))).toBe('2026-9-5');
  });

  it('disables days outside min..max and listed days, by day', () => {
    const rules = { min: d(2026, 1, 10), max: d(2026, 1, 20), disabledDates: [d(2026, 1, 15)] };
    expect(isDateDisabled(d(2026, 1, 9), rules)).toBe(true);
    expect(isDateDisabled(d(2026, 1, 10), rules)).toBe(false);
    expect(isDateDisabled(d(2026, 1, 20), rules)).toBe(false);
    expect(isDateDisabled(d(2026, 1, 21), rules)).toBe(true);
    expect(isDateDisabled(d(2026, 1, 15), rules)).toBe(true);
    expect(isDateDisabled(d(2026, 1, 12), {})).toBe(false);
  });

  it('marks only days strictly inside a complete range', () => {
    const range = [d(2026, 1, 10), d(2026, 1, 14)];
    expect(isInRange(d(2026, 1, 12), range, 'range')).toBe(true);
    expect(isInRange(d(2026, 1, 10), range, 'range')).toBe(false);
    expect(isInRange(d(2026, 1, 12), range, 'multiple')).toBe(false);
    expect(isInRange(d(2026, 1, 12), [range[0]], 'range')).toBe(false);
  });

  it('steps a month, a year or 12 years', () => {
    expect(stepFocus('day', d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
    expect(stepFocus('month', d(2026, 5, 3), -1)).toEqual(d(2025, 5, 3));
    expect(stepFocus('year', d(2026, 5, 3), 1)).toEqual(d(2038, 5, 3));
  });

  it('focuses a chosen month and year, clamping the day', () => {
    expect(focusMonth(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
    expect(focusYear(d(2026, 5, 31), 2030)).toEqual(d(2030, 5, 1));
  });

  it('pages the years in blocks of 12', () => {
    const years = decadeOf(2026);
    expect(years[0]).toBe(2016);
    expect(years[11]).toBe(2027);
    expect(decadeOf(2016)).toEqual(years);
  });

  it('maps the grid keys to a target day', () => {
    const wed = d(2026, 1, 14);
    expect(dayKeyTarget('ArrowLeft', wed, 0)).toEqual(d(2026, 1, 13));
    expect(dayKeyTarget('ArrowRight', wed, 0)).toEqual(d(2026, 1, 15));
    expect(dayKeyTarget('ArrowUp', wed, 0)).toEqual(d(2026, 1, 7));
    expect(dayKeyTarget('ArrowDown', wed, 0)).toEqual(d(2026, 1, 21));
    expect(dayKeyTarget('Home', wed, 0)).toEqual(d(2026, 1, 11));
    expect(dayKeyTarget('End', wed, 0)).toEqual(d(2026, 1, 17));
    expect(dayKeyTarget('Home', wed, 1)).toEqual(d(2026, 1, 12));
    expect(dayKeyTarget('PageDown', wed, 0)).toEqual(d(2026, 2, 14));
    expect(dayKeyTarget('PageUp', wed, 0, true)).toEqual(d(2025, 1, 14));
  });

  it('ignores other keys', () => {
    expect(dayKeyTarget('a', d(2026, 1, 14), 0)).toBeNull();
    expect(dayKeyTarget('Enter', d(2026, 1, 14), 0)).toBeNull();
  });
});
