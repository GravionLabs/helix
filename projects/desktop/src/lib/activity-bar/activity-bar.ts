import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  output,
  type TemplateRef,
  viewChildren,
} from '@angular/core';
import type { HelixView } from '../view';

/** A badge on an item: a count, or a dot when `true`. */
export type HxActivityBarBadge = number | string | true;

/**
 * An item of the activity bar. A view (`kind` absent or `'view'`) is a toggle with `aria-pressed`; an
 * action is a plain button.
 */
export interface HxActivityBarItem extends Pick<HelixView, 'id' | 'label' | 'icon' | 'position'> {
  readonly kind?: 'view' | 'action';
  readonly badge?: HxActivityBarBadge | null;
}

/**
 * The narrow icon rail at the far left. It selects the sidebar view, opens tab views and holds actions.
 *
 * ```html
 * <hx-activity-bar [items]="items" [activeId]="activeId()" [expanded]="open()" (selected)="select($event)" />
 * ```
 *
 * The active view is marked only while the sidebar is `expanded`. The rail is one tab stop (roving
 * tabindex); the arrow keys, Home and End move the focus between the items. An icon given as a name is
 * rendered as `<span class="{name}">`, so the app's icon font or registry draws it; a template is drawn as is.
 * Both sit in a box of one size.
 */
@Component({
  selector: 'hx-activity-bar',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-activity-bar',
    role: 'toolbar',
    'aria-orientation': 'vertical',
    '[attr.aria-label]': 'label()',
    '(keydown)': 'onKeydown($event)',
  },
  templateUrl: './activity-bar.html',
})
export class HxActivityBar {
  /** The views and actions; `position` puts them at the top or the bottom (settings). */
  readonly items = input.required<readonly HxActivityBarItem[]>();
  /** The id of the active view. */
  readonly activeId = input<string | null>(null);
  /** Whether the sidebar is open; the active view is marked only then. */
  readonly expanded = input(true);
  /** The accessible name of the rail. */
  readonly label = input('Activity bar');

  /** Emits the id of the selected view or the activated action. */
  readonly selected = output<string>();

  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('button');

  protected readonly groups = computed(() => {
    const items = this.items();
    return [
      { name: 'top', items: items.filter((i) => i.position !== 'bottom') },
      { name: 'bottom', items: items.filter((i) => i.position === 'bottom') },
    ].filter((g) => g.items.length > 0);
  });

  private readonly ordered = computed(() => this.groups().flatMap((g) => g.items));

  /** The one item in the tab order: the active view when marked, else the first. */
  protected readonly tabStopId = computed(() => {
    const ordered = this.ordered();
    const active = this.expanded() ? ordered.find((i) => i.id === this.activeId()) : undefined;
    return (active ?? ordered[0])?.id ?? null;
  });

  protected isView(item: HxActivityBarItem): boolean {
    return item.kind !== 'action';
  }

  protected isActive(item: HxActivityBarItem): boolean {
    return this.isView(item) && this.expanded() && item.id === this.activeId();
  }

  protected asTemplate(icon: HxActivityBarItem['icon']): TemplateRef<unknown> | null {
    return typeof icon === 'string' ? null : icon;
  }

  protected select(item: HxActivityBarItem): void {
    this.selected.emit(item.id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const buttons = this.buttons().map((b) => b.nativeElement);
    if (buttons.length === 0) return;
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (current + 1) % buttons.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (current - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = buttons.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    buttons[next]?.focus();
  }
}
