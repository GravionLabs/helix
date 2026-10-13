import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTimeRow } from './time-row';
import type { TimeOfDay } from './time-row-helpers';

@Component({
  imports: [HxTimeRow],
  template: `<hx-time-row [time]="time()" [disabled]="disabled()" [stepMinute]="15" locale="en-US" (timeChange)="changes.push($event)" />`,
})
class Host {
  time = signal<TimeOfDay>({ hours: 9, minutes: 30, seconds: 0 });
  disabled = signal(false);
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

  it('focuses the first spinbutton', () => {
    fixture.debugElement.children[0].componentInstance.focus();
    expect(document.activeElement).toBe(spins()[0]);
  });
});
