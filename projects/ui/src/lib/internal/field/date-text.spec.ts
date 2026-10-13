import { parseDateText, parseDateTimeText } from './date-text';

const base = {
  locale: 'en-US',
  showMinutes: true,
  timeOnly: false,
  fallbackDay: new Date(2026, 5, 1),
};

describe('parseDateText', () => {
  it('reads the numbers in the order of the locale', () => {
    expect(parseDateText('09/10/2026', 'en-US')).toEqual(new Date(2026, 8, 10));
    expect(parseDateText('10.09.2026', 'de-DE')).toEqual(new Date(2026, 8, 10));
  });

  it('reads yyyy-mm-dd and two-digit years', () => {
    expect(parseDateText('2026-09-10', 'de-DE')).toEqual(new Date(2026, 8, 10));
    expect(parseDateText('1/2/26', 'en-US')).toEqual(new Date(2026, 0, 2));
  });

  it('rejects text without three numbers and dates that do not exist', () => {
    expect(parseDateText('hello', 'en-US')).toBeNull();
    expect(parseDateText('1/2', 'en-US')).toBeNull();
    expect(parseDateText('02/30/2026', 'en-US')).toBeNull();
  });
});

describe('parseDateTimeText', () => {
  it('reads a date with a 24 h or 12 h time', () => {
    expect(parseDateTimeText('09/10/2026, 14:30', base)).toEqual(new Date(2026, 8, 10, 14, 30));
    expect(parseDateTimeText('09/10/2026 3:45:10 PM', base)).toEqual(
      new Date(2026, 8, 10, 15, 45, 10),
    );
    expect(parseDateTimeText('09/10/2026 12:00 am', base)).toEqual(new Date(2026, 8, 10, 0, 0));
  });

  it('reads a time alone for timeOnly, on the fallback day', () => {
    expect(parseDateTimeText('07:05', { ...base, timeOnly: true })).toEqual(
      new Date(2026, 5, 1, 7, 5),
    );
  });

  it('reads the hour only without minutes', () => {
    const opts = { ...base, showMinutes: false };
    expect(parseDateTimeText('09/10/2026 14', opts)).toEqual(new Date(2026, 8, 10, 14));
    expect(parseDateTimeText('09/10/2026 2 PM', opts)).toEqual(new Date(2026, 8, 10, 14));
  });

  it('rejects out of range times, stray letters and a missing date', () => {
    expect(parseDateTimeText('09/10/2026 25:00', base)).toBeNull();
    expect(parseDateTimeText('09/10/2026 10:75', base)).toBeNull();
    expect(parseDateTimeText('09/10/2026 13:00 PM', base)).toBeNull();
    expect(parseDateTimeText('abc 09/10/2026 10:00', base)).toBeNull();
    expect(parseDateTimeText('10:00', base)).toBeNull();
    expect(parseDateTimeText('09/10/2026', base)).toBeNull();
  });
});
