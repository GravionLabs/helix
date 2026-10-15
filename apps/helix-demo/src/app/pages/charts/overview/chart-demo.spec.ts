import { TestBed } from '@angular/core/testing';
import { ChartDemo } from './chart-demo';

describe('ChartDemo fallback card', () => {
  function create() {
    const fixture = TestBed.createComponent(ChartDemo);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the fallback table with one row per month plus the header', () => {
    const el = create().nativeElement as HTMLElement;
    const table = el.querySelector('table');
    expect(table).not.toBeNull();
    expect(table!.querySelectorAll('tr')).toHaveLength(7);
    expect(table!.querySelectorAll('tr')[1].textContent).toContain('Jan');
    expect(table!.querySelectorAll('tr')[1].textContent).toContain('65');
  });

  it('starts with nothing picked', () => {
    expect(create().componentInstance.picked()).toBe('none');
  });

  it('updates picked with dataset label and month when a bar is selected', () => {
    const cmp = create().componentInstance;
    cmp.pick({ element: { datasetIndex: 1, index: 4 } } as never);
    expect(cmp.picked()).toBe('Costs, May');
  });
});
