import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HX_CHART_LOADER, HxChart, type HxChartSelectEvent, type HxChartType } from './chart';

class FakeChart {
  static instances: FakeChart[] = [];
  static elements: unknown[] = [];
  updates = 0;
  destroyed = false;
  constructor(
    public canvas: HTMLCanvasElement,
    public config: { type: string; data: any; options: any; plugins: unknown[] },
  ) {
    this.data = config.data;
    this.options = config.options;
    FakeChart.instances.push(this);
  }
  data: any;
  options: any;
  update() {
    this.updates++;
  }
  destroy() {
    this.destroyed = true;
  }
  getElementsAtEventForMode() {
    return FakeChart.elements;
  }
}

@Component({
  imports: [HxChart],
  template: `
    <hx-chart
      id="c"
      [type]="type()"
      [data]="data()"
      [options]="options()"
      height="12rem"
      ariaLabel="Sales"
      [themeDelay]="0"
      (dataSelect)="selected.push($event)"
    >
      <table hxChartFallback><tr><td>Jan 5</td></tr></table>
    </hx-chart>
    <hx-chart id="plain" ariaLabelledBy="title" />
  `,
})
class Host {
  type = signal<HxChartType>('bar');
  data = signal({
    labels: ['Jan', 'Feb'],
    datasets: [
      { label: 'A', data: [1, 2] },
      { label: 'B', data: [3, 4], backgroundColor: 'red' },
    ],
  });
  options = signal<Record<string, unknown>>({});
  selected: HxChartSelectEvent[] = [];
}

describe('HxChart', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;
  const canvas = (id: string) => el(id).querySelector('canvas') as HTMLCanvasElement;
  const chart = () => FakeChart.instances[0];
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    FakeChart.instances = [];
    FakeChart.elements = [];
    document.documentElement.style.setProperty('--h-primary-color', 'rgb(1, 2, 3)');
    document.documentElement.style.setProperty('--h-orange-500', 'rgb(9, 9, 9)');
    document.documentElement.style.setProperty('--h-text-color', 'rgb(10, 10, 10)');
    document.documentElement.style.setProperty('--h-text-muted-color', 'rgb(20, 20, 20)');
    document.documentElement.style.setProperty('--h-content-border-color', 'rgb(30, 30, 30)');
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [{ provide: HX_CHART_LOADER, useValue: async () => ({ default: FakeChart }) }],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('class');
  });

  it('loads chart.js and creates a chart on the canvas with the type', () => {
    expect(FakeChart.instances.length).toBe(2);
    expect(chart().canvas).toBe(canvas('c'));
    expect(chart().config.type).toBe('bar');
  });

  it('the canvas is a named img with the fallback content inside', () => {
    expect(canvas('c').getAttribute('role')).toBe('img');
    expect(canvas('c').getAttribute('aria-label')).toBe('Sales');
    expect(canvas('c').querySelector('table')?.textContent).toContain('Jan 5');
    expect(canvas('plain').getAttribute('aria-labelledby')).toBe('title');
    expect(canvas('plain').hasAttribute('aria-label')).toBe(false);
  });

  it('gives datasets without colours the palette and leaves their own colours alone; the input is not changed', () => {
    const [a, b] = chart().config.data.datasets;
    expect(a.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(a.borderColor).toBe('rgb(1, 2, 3)');
    expect(b.backgroundColor).toBe('red');
    expect(host.data().datasets[0]).not.toHaveProperty('backgroundColor');
  });

  it('colours every point of a pie', async () => {
    host.type.set('pie');
    host.data.set({ labels: ['x', 'y'], datasets: [{ data: [1, 2] } as any] });
    await settle();
    const last = FakeChart.instances.at(-1) as FakeChart;
    expect(last.config.type).toBe('pie');
    expect(last.config.data.datasets[0].backgroundColor).toEqual(['rgb(1, 2, 3)', 'rgb(9, 9, 9)']);
  });

  it('takes text, grid and legend colours from the tokens and lets the options win', async () => {
    const o = chart().config.options;
    expect(o.color).toBe('rgb(20, 20, 20)');
    expect(o.scales.x.ticks.color).toBe('rgb(20, 20, 20)');
    expect(o.scales.y.grid.color).toBe('rgb(30, 30, 30)');
    expect(o.plugins.legend.labels.color).toBe('rgb(10, 10, 10)');
    expect(o.maintainAspectRatio).toBe(false); // it has a height
    host.options.set({ plugins: { legend: { display: false, labels: { color: 'hotpink' } } } });
    await settle();
    expect(chart().options.plugins.legend.display).toBe(false);
    expect(chart().options.plugins.legend.labels.color).toBe('hotpink');
    expect(chart().options.scales.x.ticks.color).toBe('rgb(20, 20, 20)');
  });

  it('updates the same chart when the data changes, and recreates it when the type changes', async () => {
    host.data.set({ labels: ['Mar'], datasets: [{ data: [7] }] } as any);
    await settle();
    expect(FakeChart.instances.length).toBe(2);
    expect(chart().updates).toBeGreaterThan(0);
    expect(chart().data.labels).toEqual(['Mar']);
    host.type.set('line');
    await settle();
    expect(chart().destroyed).toBe(true);
    expect(FakeChart.instances.length).toBe(3);
    expect(FakeChart.instances[2].config.type).toBe('line');
  });

  it('redraws with the new colours when the theme changes on <html>', async () => {
    const before = chart().updates;
    document.documentElement.style.setProperty('--h-text-muted-color', 'rgb(99, 99, 99)');
    document.documentElement.classList.add('app-dark');
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(chart().updates).toBeGreaterThan(before);
    expect(chart().options.scales.x.ticks.color).toBe('rgb(99, 99, 99)');
  });

  it('emits dataSelect with the element and the dataset under a click', async () => {
    canvas('c').click();
    expect(host.selected).toEqual([]); // nothing under the pointer
    FakeChart.elements = [{ index: 1 }];
    canvas('c').click();
    expect(host.selected.length).toBe(1);
    expect(host.selected[0].element).toEqual({ index: 1 });
    expect(host.selected[0].dataset).toEqual([{ index: 1 }]);
  });

  it('destroys the chart with the component', () => {
    const instance = chart();
    fixture.destroy();
    expect(instance.destroyed).toBe(true);
  });
});
