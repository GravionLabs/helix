import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTable, type HxTableSize } from './table';

@Component({
  imports: [HxTable],
  template: `
    <table hx-table id="t" [size]="size()" [striped]="striped()" [gridlines]="gridlines()" hoverable stickyHeader>
      <caption>Invoices</caption>
      <thead><tr><th scope="col">No.</th><th scope="col">Amount</th></tr></thead>
      <tbody>
        <tr aria-selected="true"><th scope="row">1001</th><td>120</td></tr>
        <tr><th scope="row">1002</th><td>80</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Total</th><td>200</td></tr></tfoot>
    </table>
    <table hx-table id="plain"><tbody><tr><td>x</td></tr></tbody></table>
  `,
})
class Host {
  size = signal<HxTableSize>('medium');
  striped = signal(false);
  gridlines = signal(false);
}

describe('HxTable', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is a native table with the class and no added roles', () => {
    expect(el('t').tagName).toBe('TABLE');
    expect(el('t').classList).toContain('hx-table');
    expect(el('t').hasAttribute('role')).toBe(false);
    expect(el('t').querySelector('caption')?.textContent).toBe('Invoices');
    expect(el('t').querySelectorAll('th[scope]').length).toBe(5);
  });

  it('plain by default; hoverable and stickyHeader switch classes on', () => {
    expect(el('plain').className).toBe('hx-table');
    expect(el('t').classList).toContain('hx-table-hoverable');
    expect(el('t').classList).toContain('hx-table-sticky');
    expect(el('t').classList).not.toContain('hx-table-striped');
  });

  it('follows striped, gridlines and size', () => {
    host.striped.set(true);
    host.gridlines.set(true);
    host.size.set('small');
    fixture.detectChanges();
    expect(el('t').classList).toContain('hx-table-striped');
    expect(el('t').classList).toContain('hx-table-gridlines');
    expect(el('t').classList).toContain('hx-table-sm');
    host.size.set('large');
    fixture.detectChanges();
    expect(el('t').classList).toContain('hx-table-lg');
    expect(el('t').classList).not.toContain('hx-table-sm');
  });

  it('leaves the selected row to aria-selected', () => {
    expect(el('t').querySelector('tr[aria-selected="true"]')?.textContent).toContain('1001');
  });
});
