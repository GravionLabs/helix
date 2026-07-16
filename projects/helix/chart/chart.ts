import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, inject, InjectionToken, NgModule, NgZone, untracked, ViewEncapsulation, input, output } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent } from '@gravionlabs/helix/basecomponent';
import { ChartStyle } from './style/chartstyle';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import type { ChartPassThrough } from '@gravionlabs/helix/types/chart';

const CHART_INSTANCE = new InjectionToken<UIChart>('CHART_INSTANCE');

/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'h-chart',
    standalone: true,
    imports: [CommonModule, SharedModule, BindModule],
    templateUrl: './chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    },
    providers: [ChartStyle, { provide: CHART_INSTANCE, useExisting: UIChart }],
    hostDirectives: [Bind]
})
export class UIChart extends BaseComponent<ChartPassThrough> {
    componentName = 'Chart';

    $pcChart: UIChart | undefined = inject(CHART_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Type of the chart.
     * @group Props
     */
    readonly type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>();
    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    readonly plugins = input<any[]>([]);
    /**
     * Width of the chart.
     * @group Props
     */
    readonly width = input<string>();
    /**
     * Height of the chart.
     * @group Props
     */
    readonly height = input<string>();
    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    readonly responsive = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Data to display.
     * @group Props
     */
    readonly data = input<any>();
    /**
     * Options to customize the chart.
     * @group Props
     */
    readonly options = input<any>({});
    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    readonly onDataSelect = output<any>();

    isBrowser: boolean = false;

    initialized: boolean | undefined;

    chart: any;

    _componentStyle = inject(ChartStyle);

    constructor(
        public el: ElementRef,
        private zone: NgZone
    ) {
        super();
        effect(() => {
            this.data();
            this.options();
            untracked(() => this.reinit());
        });
    }

    onAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }

    onCanvasClick(event: Event) {
        if (this.chart) {
            const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);

            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options() || {};
            opts.responsive = this.responsive();

            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height() || this.width())) {
                opts.maintainAspectRatio = false;
            }

            this.zone.runOutsideAngular(() => {
                this.chart = new Chart(this.el.nativeElement.children[0], {
                    type: this.type(),
                    data: this.data(),
                    options: this.options(),
                    plugins: this.plugins()
                });
            });
        }
    }

    getCanvas() {
        return this.el.nativeElement.children[0];
    }

    getBase64Image() {
        return this.chart.toBase64Image();
    }

    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }

    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }

    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }

    onDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
}

@NgModule({
    imports: [UIChart, SharedModule],
    exports: [UIChart, SharedModule]
})
export class ChartModule {}
