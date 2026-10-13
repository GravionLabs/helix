import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTimeRow } from './time-row';
import type { TimeOfDay } from './time-row-helpers';

@Component({
  imports: [HxTimeRow],
  template: `<hx-time-row [time]="time()" [disabled]="disabled()" [hour12]="hour12()" [showSeconds]="seconds()" [stepMinute]="15" locale="en-US" (timeChange)="changes.push($event)" />`,
})
class Host {
  time = signal<TimeOfDay>({ hours: 9, minutes: 30, seconds: 0 });
  disabled = signal(false);
  hour12 = signal(false);
  seconds = signal(false);
  changes: TimeOfDay[] = [];
}

describe('HxTimeRow', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const spins = () =>
    [...fixture.nativeElement.querySelectorAll('.hx-date-picker-time-spin')] as HTMLElement[];
  const press = (spin: HTMLElement, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    spin.dispatchEvent(event);
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits the whole time on Arrow keys', () => {
    const [hour, minute] = spins();
    press(hour, 'ArrowUp');
    press(minute, 'ArrowDown');
    expect(host.changes).toEqual([
      { hours: 10, minutes: 30, seconds: 0 },
      { hours: 9, minutes: 15, seconds: 0 },
    ]);
  });

  it('emits on the jump keys', () => {
    const [hour, minute] = spins();
    press(hour, 'End');
    press(minute, 'Home');
    press(hour, 'PageDown');
    expect(host.changes.map((t) => [t.hours, t.minutes])).toEqual([
      [23, 30],
      [9, 0],
      [3, 30],
    ]);
  });

  it('prevents the default only on handled keys', () => {
    const [hour] = spins();
    expect(press(hour, 'ArrowUp').defaultPrevented).toBe(true);
    expect(press(hour, 'End').defaultPrevented).toBe(true);
    expect(press(hour, 'Tab').defaultPrevented).toBe(false);
    expect(press(hour, 'a').defaultPrevented).toBe(false);
    expect(host.changes).toHaveLength(2);
  });

  it('ignores keys while disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const [hour] = spins();
    expect(hour.getAttribute('aria-disabled')).toBe('true');
    const event = press(hour, 'ArrowUp');
    expect(event.defaultPrevented).toBe(false);
    expect(host.changes).toEqual([]);
  });

  it('describes each column as a spinbutton', () => {
    const [hour, minute] = spins();
    expect(hour.getAttribute('aria-label')).toBe('Hour');
    expect(hour.getAttribute('aria-valuenow')).toBe('9');
    expect(hour.getAttribute('aria-valuemin')).toBe('0');
    expect(hour.getAttribute('aria-valuemax')).toBe('23');
    expect(minute.getAttribute('aria-label')).toBe('Minute');
    expect(minute.getAttribute('aria-valuenow')).toBe('30');
    expect(minute.getAttribute('aria-valuemax')).toBe('59');
    expect(fixture.nativeElement.querySelector('[role=group]').getAttribute('aria-label')).toBe(
      'Time',
    );
  });

  it('shows an AM/PM column in 12 hour mode and seconds on request', () => {
    expect(spins().map((s) => s.getAttribute('aria-label'))).toEqual(['Hour', 'Minute']);
    host.hour12.set(true);
    host.seconds.set(true);
    fixture.detectChanges();
    const labels = spins().map((s) => s.getAttribute('aria-label'));
    expect(labels).toEqual(['Hour', 'Minute', 'Second', 'AM/PM']);
    expect(spins()[0].getAttribute('aria-valuemax')).toBe('12');
    expect(spins()[3].textContent?.trim()).toBe('AM');
  });

  it('focuses the first spinbutton', () => {
    fixture.debugElement.children[0].componentInstance.focus();
    expect(document.activeElement).toBe(spins()[0]);
  });
});
