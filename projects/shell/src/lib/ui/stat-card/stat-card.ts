import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { HxCard } from '@gravionlabs/helix-ui';

export type HelixStatSeverity = 'primary' | 'info' | 'success' | 'warn' | 'danger';

/**
 * A dashboard figure: a label, the value, an icon in a tinted box, and a trend ("+12 % since last month") whose
 * direction is shown by an arrow and colour and read out as "up" or "down".
 *
 * ```html
 * <helix-stat-card label="Orders" [value]="152" icon="pi pi-shopping-cart" [trend]="24" trendUnit="" trendLabel="new since last visit" />
 * <helix-stat-card label="Revenue" [value]="2100" [format]="{ style: 'currency', currency: 'EUR' }" [trend]="-3.2" trendLabel="since last week" severity="warn" />
 * ```
 */
@Component({
  selector: 'helix-stat-card',
  standalone: true,
  imports: [HxCard],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'helix-stat-card', '[class]': "'helix-stat-card--' + severity()" },
})
export class HelixStatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  /** Formats a numeric value with `Intl.NumberFormat`. */
  readonly format = input<Intl.NumberFormatOptions>();
  readonly locale = input<string>();
  /** Icon classes (`pi pi-users`). */
  readonly icon = input<string>();
  /** The colour of the icon box. */
  readonly severity = input<HelixStatSeverity>('primary');
  /** The change: positive is up, negative is down, 0 is flat. */
  readonly trend = input<number | undefined, unknown>(undefined, {
    transform: (v) => (v === null || v === undefined || v === '' ? undefined : numberAttribute(v)),
  });
  /** Appended to the trend figure. */
  readonly trendUnit = input('%');
  /** The text after the trend ("since last month"). */
  readonly trendLabel = input<string>();
  /** Fraction digits of the trend. */
  readonly trendDigits = input(1, { transform: numberAttribute });

  protected readonly formattedValue = computed(() => {
    const value = this.value();
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat(this.locale(), this.format()).format(value);
  });

  protected readonly direction = computed<'up' | 'down' | 'flat' | null>(() => {
    const trend = this.trend();
    if (trend === undefined || Number.isNaN(trend)) return null;
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat';
  });

  protected readonly trendText = computed(() => {
    const trend = this.trend();
    if (trend === undefined || Number.isNaN(trend)) return '';
    const digits = Math.min(Math.max(Math.round(this.trendDigits()), 0), 20);
    const figure = new Intl.NumberFormat(this.locale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
      signDisplay: 'exceptZero',
    }).format(trend);
    return `${figure}${this.trendUnit()}`;
  });
}
