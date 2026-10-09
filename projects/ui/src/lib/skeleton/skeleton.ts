import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type HxSkeletonShape = 'rectangle' | 'circle';
export type HxSkeletonAnimation = 'wave' | 'none';

/**
 * A placeholder shaped like the content that is still loading.
 *
 * ```html
 * <hx-skeleton width="10rem" height="1rem" />
 * <hx-skeleton shape="circle" size="4rem" />
 * ```
 *
 * It is hidden from assistive technology (`aria-hidden`), so it says nothing by itself: the container of the loading
 * content announces the state, e.g. `aria-busy="true"` on it, or a visually hidden "Loading…" in a live region.
 * The wave stops under `prefers-reduced-motion`.
 */
@Component({
  selector: 'hx-skeleton',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-skeleton',
    'aria-hidden': 'true',
    '[class.hx-skeleton-circle]': "shape() === 'circle'",
    '[class.hx-skeleton-wave]': "animation() === 'wave'",
    '[style.width]': 'boxWidth()',
    '[style.height]': 'boxHeight()',
    '[style.border-radius]': 'borderRadius() ?? null',
  },
})
export class HxSkeleton {
  readonly shape = input<HxSkeletonShape>('rectangle');
  /** Any CSS length; `100%` by default. */
  readonly width = input('100%');
  /** Any CSS length; `1rem` by default. */
  readonly height = input('1rem');
  /** Width and height at once, e.g. for a circle; wins over `width` and `height`. */
  readonly size = input<string>();
  /** Any CSS radius, replacing the one of the theme (a circle is always round). */
  readonly borderRadius = input<string>();
  readonly animation = input<HxSkeletonAnimation>('wave');

  protected readonly boxWidth = computed(() => this.size() ?? this.width());
  protected readonly boxHeight = computed(() => this.size() ?? this.height());
}
