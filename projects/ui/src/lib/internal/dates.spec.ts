import { addDays, addMonths, compareDays, daysInMonth, isSameDay, monthCells } from './dates';

describe('dates', () => {
  it('moves by days across month ends', () => {
    expect(addDays(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 1));
    expect(addDays(new Date(2026, 2, 1), -1)).toEqual(new Date(2026, 1, 28));
  });

  it('moves by months and clamps the day', () => {
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29));
    expect(addMonths(new Date(2026, 11, 15), 1)).toEqual(new Date(2027, 0, 15));
    expect(addMonths(new Date(2026, 0, 15), -1)).toEqual(new Date(2025, 11, 15));
  });

  it('knows month lengths, equality and order by day', () => {
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(isSameDay(new Date(2026, 5, 1, 3), new Date(2026, 5, 1, 22))).toBe(true);
    expect(isSameDay(new Date(2026, 5, 1), null)).toBe(false);
    expect(compareDays(new Date(2026, 5, 1, 23), new Date(2026, 5, 2, 1))).toBeLessThan(0);
  });

  it('lays a month out in weeks from the first day of the week', () => {
    // October 2026 starts on a Thursday
    const sunday = monthCells(2026, 9, 0);
    expect(sunday[0].map((d) => d?.getDate() ?? null)).toEqual([null, null, null, null, 1, 2, 3]);
    expect(sunday.every((row) => row.length === 7)).toBe(true);
    const monday = monthCells(2026, 9, 1);
    expect(monday[0].map((d) => d?.getDate() ?? null)).toEqual([null, null, null, 1, 2, 3, 4]);
    expect(sunday.flat().filter(Boolean).length).toBe(31);
  });
});
