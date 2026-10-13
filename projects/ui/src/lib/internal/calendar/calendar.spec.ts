import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxCalendar } from './calendar';

@Component({
  imports: [HxCalendar],
  template: `<hx-calendar [(focusedDate)]="focused" [today]="today" titleId="t" locale="en-US" [disabledDates]="blocked" (picked)="picks.push($event)" />`,
})
class Host {
  focused = signal(new Date(2026, 9, 31));
  today = new Date(2026, 9, 13);
  blocked = [new Date(2026, 9, 12)];
  picks: Date[] = [];
}

describe('HxCalendar', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const day = (key: string) =>
    fixture.nativeElement.querySelector(`.hx-date-picker-date[data-date="${key}"]`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  it('focusDay focuses the button of the focused day', () => {
    fixture.debugElement.children[0].componentInstance.focusDay();
    expect(document.activeElement).toBe(day('2026-10-31'));
  });

  it('emits picked for a click, also on a disabled day', () => {
    day('2026-10-20').click();
    day('2026-10-12').click();
    expect(host.picks).toEqual([new Date(2026, 9, 20), new Date(2026, 9, 12)]);
  });

  it('moves the focus across a month boundary with the arrow key', async () => {
    day('2026-10-31').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.focused()).toEqual(new Date(2026, 10, 1));
    expect(document.activeElement).toBe(day('2026-11-1'));
  });
});
