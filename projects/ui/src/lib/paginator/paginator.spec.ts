import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { type HxPageEvent, HxPaginator } from './paginator';

@Component({
  imports: [HxPaginator],
  template: `
    <hx-paginator [rows]="rows()" [totalRecords]="total()" [(first)]="first" [rowsPerPageOptions]="options()" [allLabel]="allLabel()" showCurrentPageReport (pageChange)="events.push($event)" />
  `,
})
class Host {
  rows = signal(10);
  total = signal(95);
  allLabel = signal('All');
  first = signal(0);
  options = signal<(number | 'all')[] | undefined>([10, 20, 50]);
  events: HxPageEvent[] = [];
}

describe('HxPaginator', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const el = () => fixture.debugElement.query(By.css('hx-paginator')).nativeElement as HTMLElement;
  const buttons = (cls: string) => [...el().querySelectorAll<HTMLButtonElement>(`.${cls}`)];
  const labels = () => buttons('hx-paginator-page').map((b) => b.textContent?.trim());
  const click = async (b: HTMLElement) => {
    b.click();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('is a labelled nav with a window of page links and the current page marked', () => {
    expect(el().querySelector('nav')?.getAttribute('aria-label')).toBe('Pagination');
    expect(labels()).toEqual(['1', '2', '3', '4', '5']);
    const current = el().querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('1');
    expect(buttons('hx-paginator-page')[0].getAttribute('aria-label')).toBe('Page 1');
  });

  it('shows the current page report', () => {
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('1 - 10 of 95');
  });

  it('goes to the next and previous page and emits the change', async () => {
    await click(buttons('hx-paginator-next')[0]);
    expect(host.first()).toBe(10);
    expect(host.events.at(-1)).toEqual({ first: 10, rows: 10, page: 1, pageCount: 10 });
    expect(el().querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2');
    await click(buttons('hx-paginator-prev')[0]);
    expect(host.first()).toBe(0);
  });

  it('jumps to the last page and keeps the window around the current page', async () => {
    await click(buttons('hx-paginator-last')[0]);
    expect(host.first()).toBe(90);
    expect(labels()).toEqual(['6', '7', '8', '9', '10']);
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('91 - 95 of 95');
  });

  it('disables first/previous on the first page and next/last on the last page', async () => {
    expect(buttons('hx-paginator-first')[0].disabled).toBe(true);
    expect(buttons('hx-paginator-prev')[0].disabled).toBe(true);
    expect(buttons('hx-paginator-next')[0].disabled).toBe(false);
    await click(buttons('hx-paginator-last')[0]);
    expect(buttons('hx-paginator-next')[0].disabled).toBe(true);
    expect(buttons('hx-paginator-last')[0].disabled).toBe(true);
  });

  it('goes to a clicked page link', async () => {
    await click(buttons('hx-paginator-page')[3]);
    expect(host.first()).toBe(30);
    expect(host.events.at(-1)?.page).toBe(3);
  });

  it('has an empty list as a single page', async () => {
    host.total.set(0);
    host.first.set(0);
    fixture.detectChanges();
    expect(labels()).toEqual(['1']);
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('0 - 0 of 0');
    expect(buttons('hx-paginator-next')[0].disabled).toBe(true);
  });

  it('offers a rows-per-page select only when options are given', () => {
    expect(el().querySelector('hx-select')).toBeTruthy();
    host.options.set(undefined);
    fixture.detectChanges();
    expect(el().querySelector('hx-select')).toBeNull();
  });

  it('keeps the first record on screen when the rows per page change', async () => {
    host.first.set(30);
    fixture.detectChanges();
    const paginator = fixture.debugElement.query(By.directive(HxPaginator)).componentInstance;
    paginator.setRows(20);
    fixture.detectChanges();
    expect(host.first()).toBe(20);
    expect(host.events.at(-1)).toEqual({ first: 20, rows: 20, page: 1, pageCount: 5 });
  });

  const paginator = () => fixture.debugElement.query(By.directive(HxPaginator)).componentInstance;

  it('offers an All size that shows one page with every record and leaves rows alone', () => {
    host.options.set([10, 'all']);
    fixture.detectChanges();
    paginator().setRows('all');
    fixture.detectChanges();
    expect(host.events.at(-1)).toEqual({ first: 0, rows: 95, page: 0, pageCount: 1, all: true });
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('1 - 95 of 95');
    expect(paginator().rows()).toBe(10);
    expect(el().querySelector('hx-select')?.textContent).toContain('All');
  });

  it('has no all key after All then a number', () => {
    host.options.set([10, 20, 'all']);
    fixture.detectChanges();
    paginator().setRows('all');
    paginator().setRows(20);
    fixture.detectChanges();
    expect(host.events.at(-1)).toEqual({ first: 0, rows: 20, page: 0, pageCount: 5 });
    expect('all' in (host.events.at(-1) ?? {})).toBe(false);
  });

  it('emits once when All is picked twice', () => {
    host.options.set([10, 'all']);
    fixture.detectChanges();
    paginator().setRows('all');
    const count = host.events.length;
    paginator().setRows('all');
    expect(host.events.length).toBe(count);
  });

  it('follows totalRecords under All and reports 1 row at least for no records', () => {
    host.options.set([10, 'all']);
    fixture.detectChanges();
    paginator().setRows('all');
    host.total.set(40);
    fixture.detectChanges();
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('1 - 40 of 40');
    host.total.set(0);
    fixture.detectChanges();
    expect(el().querySelector('.hx-paginator-report')?.textContent).toBe('0 - 0 of 0');
  });

  it('asks for one row at least when All is picked without records', () => {
    host.options.set([10, 'all']);
    host.total.set(0);
    fixture.detectChanges();
    paginator().setRows('all');
    expect(host.events.at(-1)?.rows).toBe(1);
  });

  it('uses a custom allLabel', () => {
    host.options.set([10, 'all']);
    fixture.detectChanges();
    host.allLabel.set('Everything');
    paginator().setRows('all');
    fixture.detectChanges();
    expect(el().querySelector('hx-select')?.textContent).toContain('Everything');
  });
});
