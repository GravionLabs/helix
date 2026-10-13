import {
  applyUnit,
  buildTimeColumns,
  jumpKeyTarget,
  nextUnitValue,
  type TimeColumn,
  unitValues,
} from './time-row-helpers';

const labels = { hour: 'Hour', minute: 'Minute', second: 'Second', period: 'AM/PM' };
const steps = { hour: 1, minute: 15, second: 1 };
const opts = { hour12: false, showMinutes: true, showSeconds: false, locale: 'en-US', labels };
const column = (partial: Partial<TimeColumn>): TimeColumn => ({
  unit: 'minute',
  label: 'Minute',
  now: 0,
  min: 0,
  max: 59,
  text: '00',
  valueText: '0',
  ...partial,
});

describe('time row helpers', () => {
  it('builds hour and minute columns for 24 h', () => {
    const cols = buildTimeColumns({ hours: 9, minutes: 5, seconds: 0 }, opts);
    expect(cols.map((c) => c.unit)).toEqual(['hour', 'minute']);
    expect(cols[0]).toMatchObject({ now: 9, min: 0, max: 23, text: '09' });
  });

  it('adds seconds only with minutes, and AM/PM for 12 h', () => {
    const time = { hours: 15, minutes: 30, seconds: 4 };
    const full = buildTimeColumns(time, { ...opts, hour12: true, showSeconds: true });
    expect(full.map((c) => c.unit)).toEqual(['hour', 'minute', 'second', 'period']);
    expect(full[0]).toMatchObject({ now: 3, min: 1, max: 12 });
    expect(full[3]).toMatchObject({ now: 1, text: 'PM' });
    const hourOnly = buildTimeColumns(time, { ...opts, showMinutes: false, showSeconds: true });
    expect(hourOnly.map((c) => c.unit)).toEqual(['hour']);
  });

  it('shows midnight as 12 AM in 12 h', () => {
    const cols = buildTimeColumns({ hours: 0, minutes: 0, seconds: 0 }, { ...opts, hour12: true });
    expect(cols[0].now).toBe(12);
    expect(cols[2]).toMatchObject({ now: 0, text: 'AM' });
  });

  it('lists the values of a step and guards against a step below 1', () => {
    expect(unitValues(column({}), steps)).toEqual([0, 15, 30, 45]);
    expect(unitValues(column({ min: 0, max: 3 }), { ...steps, minute: 0 })).toEqual([0, 1, 2, 3]);
    expect(unitValues(column({ unit: 'period', min: 0, max: 1 }), steps)).toEqual([0, 1]);
  });

  it('steps to the next value and wraps around', () => {
    expect(nextUnitValue(column({ now: 20 }), steps, 1)).toBe(30);
    expect(nextUnitValue(column({ now: 45 }), steps, 1)).toBe(0);
    expect(nextUnitValue(column({ now: 20 }), steps, -1)).toBe(15);
    expect(nextUnitValue(column({ now: 0 }), steps, -1)).toBe(45);
  });

  it('sets a unit and keeps the period in 12 h', () => {
    const t = { hours: 15, minutes: 30, seconds: 0 };
    expect(applyUnit(t, 'hour', 4, true).hours).toBe(16);
    expect(applyUnit(t, 'hour', 12, true).hours).toBe(12);
    expect(applyUnit(t, 'hour', 4, false).hours).toBe(4);
    expect(applyUnit(t, 'minute', 5, false).minutes).toBe(5);
    expect(applyUnit(t, 'second', 7, false).seconds).toBe(7);
    expect(applyUnit(t, 'period', 0, true).hours).toBe(3);
    expect(applyUnit({ ...t, hours: 3 }, 'period', 1, true).hours).toBe(15);
  });

  it('jumps with Page, Home and End to values of the step', () => {
    expect(jumpKeyTarget('PageUp', column({ now: 0 }), steps)).toBe(15);
    expect(jumpKeyTarget('PageDown', column({ now: 30 }), steps)).toBe(15);
    expect(jumpKeyTarget('Home', column({ now: 30 }), steps)).toBe(0);
    expect(jumpKeyTarget('End', column({ now: 30 }), steps)).toBe(45);
  });

  it('ignores other keys', () => {
    expect(jumpKeyTarget('a', column({}), steps)).toBeNull();
  });
});
