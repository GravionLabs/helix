import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  InjectionToken,
  inject,
  input,
  NgZone,
  numberAttribute,
  output,
  PLATFORM_ID,
  untracked,
  viewChild,
} from '@angular/core';

export type HxChartType =
  | 'bar'
  | 'line'
  | 'scatter'
  | 'bubble'
  | 'pie'
  | 'doughnut'
  | 'polarArea'
  | 'radar';

/** What `(dataSelect)` carries: the click and what chart.js found under it. */
export interface HxChartSelectEvent {
  originalEvent: Event;
  /** The nearest element under the pointer (chart.js `{ datasetIndex, index, element }`). */
  element: unknown;
  /** The elements of that dataset. */
  dataset: unknown[];
}

/** The part of chart.js this component uses; the real module is `chart.js/auto`. */
export interface HxChartModule {
  default: new (canvas: HTMLCanvasElement, config: unknown) => HxChartInstance;
}

export interface HxChartInstance {
  data: unknown;
  options: unknown;
  update(mode?: string): void;
  destroy(): void;
  getElementsAtEventForMode(
    event: Event,
    mode: string,
    options: object,
    useFinalPosition: boolean,
  ): unknown[];
}

/**
 * Loads chart.js. The default is a dynamic `import('chart.js/auto')`, so chart.js is only fetched by apps that show
 * a chart; provide another function to register a smaller set of chart.js parts or to replace it in tests.
 */
export const HX_CHART_LOADER = new InjectionToken<() => Promise<HxChartModule>>('HX_CHART_LOADER', {
  providedIn: 'root',
  factory: () => () => import('chart.js/auto') as unknown as Promise<HxChartModule>,
});

/** Colours of the datasets that do not set their own, as tokens in the order they are used. */
const PALETTE = [
  '--h-primary-color',
  '--h-orange-500',
  '--h-green-500',
  '--h-purple-500',
  '--h-sky-500',
  '--h-red-500',
  '--h-yellow-500',
  '--h-teal-500',
];

type Json = Record<string, unknown>;

/** The parts of chart.js data and datasets that are read here; everything else is passed on untouched. */
interface ChartDataLike extends Json {
  datasets?: unknown;
}
interface DatasetLike extends Json {
  data?: unknown;
  backgroundColor?: unknown;
  borderColor?: unknown;
}

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** `defaults` underneath, `overrides` on top; objects merge, everything else is replaced. */
function merge(defaults: Json, overrides: Json): Json {
  const out: Json = { ...defaults };
  for (const [key, value] of Object.entries(overrides)) {
    const base = out[key];
    out[key] = isObject(base) && isObject(value) ? merge(base, value) : value;
  }
  return out;
}

/**
 * A chart.js chart whose colours, grid and font come from the Helix tokens.
 *
 * ```html
 * <hx-chart type="bar" [data]="data" [options]="options" height="20rem" ariaLabel="Sales per month">
 *   <table hxChartFallback>…the same numbers as text…</table>
 * </hx-chart>
 * ```
 *
 * chart.js is an optional peer dependency, loaded with a dynamic import (see `HX_CHART_LOADER`) the first time a
 * chart is shown. Datasets without colours get the Helix palette; text, grid and legend colours come from
 * `--h-text-muted-color` and `--h-content-border-color` of the element. Your `options` win over these defaults.
 * The chart is redrawn when `class` or `style` of `<html>` change (dark mode, the primary colour).
 *
 * The canvas is an `img` named by `ariaLabel` / `ariaLabelledBy`; content marked `hxChartFallback` becomes the
 * canvas fallback content, which assistive technology reads: put the numbers there as text or as a table.
 */
@Component({
  selector: 'hx-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-chart' },
  template: `
    <div class="hx-chart-frame" [style.width]="width() ?? null" [style.height]="height() ?? null">
      <canvas
        #canvas
        class="hx-chart-canvas"
        role="img"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        (click)="onClick($event)"
      ><ng-content select="[hxChartFallback]" /></canvas>
    </div>
  `,
})
export class HxChart {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly #zone = inject(NgZone);
  readonly #loader = inject(HX_CHART_LOADER);
  readonly #platform = inject(PLATFORM_ID);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly type = input<HxChartType>('bar');
  /** chart.js data: `{ labels, datasets }`. Pass a new object to update the chart. */
  readonly data = input<ChartDataLike>({});
  /** chart.js options, on top of the token defaults. Pass a new object to update the chart. */
  readonly options = input<Json>({});
  /** Extra chart.js plugins for this chart. */
  readonly plugins = input<readonly unknown[]>([]);
  /** CSS width of the frame, e.g. `30rem`; the chart fills its container by default. */
  readonly width = input<string>();
  /** CSS height of the frame; without it chart.js keeps its aspect ratio. */
  readonly height = input<string>();
  /** Resize with the container. */
  readonly responsive = input(true, { transform: (v: unknown) => v !== false && v !== 'false' });
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  /** Delay of a redraw after the theme changed, in ms; the style change is usually followed by more. */
  readonly themeDelay = input(50, { transform: numberAttribute });

  /** A data point or dataset was clicked. */
  readonly dataSelect = output<HxChartSelectEvent>();

  #chart: HxChartInstance | undefined;
  #chartType: HxChartType | undefined;
  #ready = false;
  #loading = false;
  #observer: MutationObserver | undefined;
  #timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    afterNextRender(() => {
      this.#ready = true;
      void this.#render();
      this.#watchTheme();
    });
    effect(() => {
      this.type();
      this.data();
      this.options();
      this.plugins();
      this.responsive();
      this.width();
      this.height();
      untracked(() => {
        if (this.#ready) void this.#render();
      });
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.#timer);
      this.#observer?.disconnect();
      this.#chart?.destroy();
      this.#chart = undefined;
      this.#ready = false;
    });
  }

  /** The chart.js instance, once it exists; `undefined` before chart.js has loaded. */
  get chart(): HxChartInstance | undefined {
    return this.#chart;
  }

  /** Redraws the chart, e.g. after the theme changed in a way the component cannot see. */
  refresh(): void {
    if (this.#chart) {
      this.#apply(this.#chart);
      this.#chart.update();
    }
  }

  protected onClick(event: MouseEvent): void {
    const chart = this.#chart;
    if (!chart) return;
    const element = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    const dataset = chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);
    if (element?.[0] && dataset)
      this.dataSelect.emit({ originalEvent: event, element: element[0], dataset });
  }

  async #render(): Promise<void> {
    if (!isPlatformBrowser(this.#platform)) return;
    const type = this.type();
    if (this.#chart && this.#chartType === type) {
      this.#apply(this.#chart);
      this.#chart.update();
      return;
    }
    if (this.#loading) return;
    this.#loading = true;
    try {
      const module = await this.#loader();
      if (!this.#ready) return; // destroyed while chart.js loaded
      this.#chart?.destroy();
      const Chart = module.default;
      this.#zone.runOutsideAngular(() => {
        this.#chart = new Chart(this.canvas().nativeElement, {
          type: this.type(),
          data: this.#themedData(),
          options: this.#themedOptions(),
          plugins: [...this.plugins()],
        });
      });
      this.#chartType = this.type();
    } catch (error) {
      console.error(
        'hx-chart: chart.js could not be loaded. Is the peer dependency "chart.js" installed?',
        error,
      );
      return;
    } finally {
      this.#loading = false;
    }
    // inputs may have changed while chart.js loaded
    if (this.#chart && this.#chartType !== this.type()) await this.#render();
  }

  #apply(chart: HxChartInstance): void {
    chart.data = this.#themedData();
    chart.options = this.#themedOptions();
  }

  #token(name: string): string {
    return getComputedStyle(this.#host).getPropertyValue(name).trim();
  }

  /** The datasets with palette colours where they set none. The input is not changed. */
  #themedData(): Json {
    const data = this.data();
    const datasets = data.datasets;
    if (!Array.isArray(datasets)) return data;
    const palette = PALETTE.map((name) => this.#token(name)).filter(Boolean);
    if (palette.length === 0) return data;
    const perPoint = ['pie', 'doughnut', 'polarArea'].includes(this.type());
    return {
      ...data,
      datasets: datasets.map((dataset: DatasetLike, i: number) => {
        if (!isObject(dataset)) return dataset;
        const color = palette[i % palette.length];
        const count = Array.isArray(dataset.data) ? dataset.data.length : 0;
        const points = Array.from({ length: count }, (_, n) => palette[n % palette.length]);
        const filled = this.type() === 'line' || this.type() === 'radar';
        return {
          ...dataset,
          backgroundColor:
            dataset.backgroundColor ??
            (perPoint ? points : filled ? `color-mix(in srgb, ${color}, transparent 80%)` : color),
          borderColor:
            dataset.borderColor ?? (perPoint ? this.#token('--h-content-background') : color),
        };
      }),
    };
  }

  #themedOptions(): Json {
    const text = this.#token('--h-text-color');
    const muted = this.#token('--h-text-muted-color');
    const grid = this.#token('--h-content-border-color');
    const axis = { ticks: { color: muted }, grid: { color: grid }, border: { color: grid } };
    const radial = {
      ticks: { color: muted, backdropColor: 'transparent' },
      grid: { color: grid },
      angleLines: { color: grid },
      pointLabels: { color: text },
    };
    const type = this.type();
    const scales =
      type === 'radar' || type === 'polarArea'
        ? { r: radial }
        : type === 'pie' || type === 'doughnut'
          ? {}
          : { x: axis, y: axis };
    const defaults: Json = {
      responsive: this.responsive(),
      maintainAspectRatio: !(this.height() || this.width()),
      color: muted,
      borderColor: grid,
      plugins: { legend: { labels: { color: text } } },
      scales,
    };
    return merge(defaults, this.options());
  }

  #watchTheme(): void {
    if (typeof MutationObserver === 'undefined') return;
    this.#observer = new MutationObserver(() => {
      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => this.refresh(), this.themeDelay());
    });
    this.#observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
  }
}
