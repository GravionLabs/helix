import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { HxTimelineAlign, HxTimelineLayout } from './timeline';
import { HxTimeline, HxTimelineContent, HxTimelineMarker, HxTimelineOpposite } from './timeline';

interface Ev {
  status: string;
  date: string;
}

@Component({
  imports: [HxTimeline, HxTimelineContent, HxTimelineOpposite, HxTimelineMarker],
  template: `
    <hx-timeline id="t" [value]="events()" [align]="align()" [layout]="layout()">
      <ng-template hxTimelineContent let-event let-index="index"><b>{{ index }}:{{ event.status }}</b></ng-template>
      <ng-template hxTimelineOpposite let-event><small>{{ event.date }}</small></ng-template>
    </hx-timeline>
    <hx-timeline id="custom" [value]="events()">
      <ng-template hxTimelineContent let-event>{{ event.status }}</ng-template>
      <ng-template hxTimelineMarker let-event><i class="mark">{{ event.status[0] }}</i></ng-template>
    </hx-timeline>
    <hx-timeline id="empty" [value]="[]" />
  `,
})
class Host {
  events = signal<Ev[]>([
    { status: 'Ordered', date: 'Mon' },
    { status: 'Shipped', date: 'Tue' },
    { status: 'Delivered', date: 'Wed' },
  ]);
  align = signal<HxTimelineAlign>('left');
  layout = signal<HxTimelineLayout>('vertical');
}

describe('HxTimeline', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;
  const events = (id = 't') => [...el(id).querySelectorAll<HTMLElement>('li.hx-timeline-event')];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is an ordered list with one item per event', () => {
    expect(el('t').querySelector('ol')).toBeTruthy();
    expect(events().length).toBe(3);
    expect(el('empty').querySelectorAll('li').length).toBe(0);
  });

  it('renders the templates with the event and its index', () => {
    expect(
      events().map((e) => e.querySelector('.hx-timeline-event-content')?.textContent?.trim()),
    ).toEqual(['0:Ordered', '1:Shipped', '2:Delivered']);
    expect(
      events().map((e) => e.querySelector('.hx-timeline-event-opposite')?.textContent?.trim()),
    ).toEqual(['Mon', 'Tue', 'Wed']);
  });

  it('hides the separator from assistive technology and draws no connector after the last event', () => {
    for (const e of events()) {
      expect(e.querySelector('.hx-timeline-event-separator')?.getAttribute('aria-hidden')).toBe(
        'true',
      );
    }
    expect(events().map((e) => !!e.querySelector('.hx-timeline-event-connector'))).toEqual([
      true,
      true,
      false,
    ]);
  });

  it('draws the default marker, or the marker template instead', () => {
    expect(events()[0].querySelector('.hx-timeline-event-marker')).toBeTruthy();
    const custom = events('custom');
    expect(custom[0].querySelector('.hx-timeline-event-marker')).toBeNull();
    expect(custom.map((e) => e.querySelector('.mark')?.textContent)).toEqual(['O', 'S', 'D']);
  });

  it('reverses the events by align', async () => {
    const reversed = () => events().map((e) => e.classList.contains('hx-timeline-event-reversed'));
    expect(reversed()).toEqual([false, false, false]);
    host.align.set('right');
    fixture.detectChanges();
    expect(reversed()).toEqual([true, true, true]);
    host.align.set('alternate');
    fixture.detectChanges();
    expect(reversed()).toEqual([false, true, false]);
  });

  it('sets the layout class and follows the events', async () => {
    expect(el('t').classList).toContain('hx-timeline-vertical');
    host.layout.set('horizontal');
    host.events.update((list) => [...list, { status: 'Returned', date: 'Thu' }]);
    fixture.detectChanges();
    expect(el('t').classList).toContain('hx-timeline-horizontal');
    expect(events().length).toBe(4);
  });
});
