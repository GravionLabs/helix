import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type HxKbdSize = 'md' | 'sm';
/** `'+'` joins the caps with a plus sign; `'none'` puts them side by side. */
export type HxKbdSeparator = '+' | 'none';

/** True on macOS, where shortcuts are written without a separator (`⌘⇧P`). */
function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac|iphone|ipad/i.test(nav.userAgentData?.platform ?? nav.platform ?? '');
}

/**
 * A keyboard shortcut as key caps, one `<kbd>` per key. The component does not translate or rename keys: pass the
 * labels for the platform of the user (`'⌘'` on macOS, `'Ctrl'` elsewhere).
 *
 * The caps are text, so a screen reader reads the shortcut. Announcing it on the control that runs it is the
 * caller's job: set `aria-keyshortcuts` on that host (for example `aria-keyshortcuts="Control+Shift+P"`).
 *
 * ```html
 * <hx-kbd [keys]="['Ctrl', 'Shift', 'P']" />
 * <hx-kbd [keys]="['⌘', 'K']" size="sm" separator="none" />
 * ```
 */
@Component({
  selector: 'hx-kbd',
  template: `
    @for (key of keys(); track $index) {
      @if ($index > 0 && plus()) {
        <span class="hx-kbd-separator" aria-hidden="true">+</span>
      }
      <kbd class="hx-kbd-key">{{ key }}</kbd>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-kbd',
    '[class.hx-kbd-sm]': "size() === 'sm'",
  },
})
export class HxKbd {
  /** The key labels, in order. */
  readonly keys = input<readonly string[]>([]);
  readonly size = input<HxKbdSize>('md');
  /** Default: none on macOS, `'+'` elsewhere. */
  readonly separator = input<HxKbdSeparator | undefined>(undefined);

  protected readonly plus = computed(() => (this.separator() ?? (isMac() ? 'none' : '+')) === '+');
}
