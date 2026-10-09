import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DestroyRef,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { nextId } from '../internal/ids';

/**
 * Tabs with panels, in the WAI-ARIA tabs pattern.
 *
 * ```html
 * <hx-tabs [(value)]="tab">
 *   <hx-tab-list>
 *     <hx-tab value="a">Profile</hx-tab>
 *     <hx-tab value="b">Billing</hx-tab>
 *     <hx-tab value="c" disabled>Soon</hx-tab>
 *   </hx-tab-list>
 *   <hx-tab-panels>
 *     <hx-tab-panel value="a">Profile content</hx-tab-panel>
 *     <hx-tab-panel value="b"><ng-template hxTabContent>Billing content, created when first shown</ng-template></hx-tab-panel>
 *   </hx-tab-panels>
 * </hx-tabs>
 * ```
 *
 * `value` is the `value` of the active tab (the first enabled tab while it is `null`). A panel with an
 * `<ng-template hxTabContent>` is lazy: its content is created when the tab first becomes active and, with
 * `keepAlive`, kept afterwards; without `keepAlive` it is destroyed when the tab is left. Plain panel content is
 * created up front and only hidden.
 *
 * Roving tabindex: Tab enters the active tab, Left/Right (Home/End) move to the previous/next (first/last) enabled tab
 * and activate it. With `scrollable`, buttons at the ends of the list scroll tabs that overflow.
 */
@Component({
  selector: 'hx-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tabs' },
  template: '<ng-content />',
})
export class HxTabs {
  /** The `value` of the active tab. */
  readonly value = model<string | null>(null);
  /** Buttons at the ends of the tab list scroll tabs that overflow. */
  readonly scrollable = input(false, { transform: booleanAttribute });
  /** Keep the content of lazy panels after their tab is left. */
  readonly keepAlive = input(false, { transform: booleanAttribute });

  readonly id = nextId('hx-tabs');
  /** The first tab registered that is enabled, to start with. */
  readonly #first = signal<string | null>(null);
  readonly visited = signal<ReadonlySet<string>>(new Set());

  constructor() {
    effect(() => {
      const value = this.value();
      const first = this.#first();
      untracked(() => {
        if (value === null) {
          if (first !== null) this.value.set(first);
        } else if (!this.visited().has(value)) {
          this.visited.set(new Set([...this.visited(), value]));
        }
      });
    });
  }

  registerTab(value: string, disabled: boolean): void {
    if (!disabled && this.#first() === null) this.#first.set(value);
  }

  tabId(value: string): string {
    return `${this.id}-tab-${value}`;
  }

  panelId(value: string): string {
    return `${this.id}-panel-${value}`;
  }

  activate(value: string): void {
    this.value.set(value);
  }
}

/** The row of tabs. Handles the arrow keys and, with `scrollable`, the scroll buttons. */
@Component({
  selector: 'hx-tab-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tab-list', '[class.hx-tab-list-scrollable]': 'tabs.scrollable()' },
  template: `
    @if (tabs.scrollable() && overflowing()) {
      <button type="button" class="hx-tab-nav hx-tab-nav-prev" tabindex="-1" aria-label="Scroll tabs left" (click)="scroll(-1)">
        <span class="hx-tab-nav-icon-prev" aria-hidden="true"></span>
      </button>
    }
    <div #scroller class="hx-tab-scroller" (scroll)="measure()">
      <div class="hx-tab-tabs" role="tablist" (keydown)="onKeydown($event)"><ng-content /></div>
    </div>
    @if (tabs.scrollable() && overflowing()) {
      <button type="button" class="hx-tab-nav hx-tab-nav-next" tabindex="-1" aria-label="Scroll tabs right" (click)="scroll(1)">
        <span class="hx-tab-nav-icon-next" aria-hidden="true"></span>
      </button>
    }
  `,
})
export class HxTabList {
  protected readonly tabs = inject(HxTabs);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  protected readonly overflowing = signal(false);

  constructor() {
    afterNextRender(() => {
      this.measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.measure());
      observer.observe(this.#host.nativeElement);
      this.#destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected measure(): void {
    const el = this.scroller()?.nativeElement;
    if (el) this.overflowing.set(el.scrollWidth > el.clientWidth + 1);
  }

  protected scroll(direction: 1 | -1): void {
    const el = this.scroller()?.nativeElement;
    el?.scrollBy?.({ left: direction * el.clientWidth * 0.6, behavior: 'smooth' });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const tabs = [
      ...this.#host.nativeElement.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([aria-disabled="true"])',
      ),
    ];
    const at = tabs.indexOf(event.target as HTMLElement);
    if (at < 0) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (at + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click(); // automatic activation
  }
}

/** One tab. */
@Component({
  selector: 'hx-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-tab',
    role: 'tab',
    '[id]': 'tabs.tabId(value())',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': 'tabs.panelId(value())',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.tabindex]': 'selected() && !disabled() ? 0 : -1',
    '[class.hx-tab-active]': 'selected()',
    '[class.hx-tab-disabled]': 'disabled()',
    '(click)': 'onClick()',
    '(keydown.enter)': 'onClick()',
    '(keydown.space)': 'onSpace($event)',
  },
  template: '<ng-content />',
})
export class HxTab {
  protected readonly tabs = inject(HxTabs);
  /** Identifies the tab and its panel. */
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected selected(): boolean {
    return this.tabs.value() === this.value();
  }

  constructor() {
    effect(() => this.tabs.registerTab(this.value(), this.disabled()));
  }

  protected onClick(): void {
    if (!this.disabled()) this.tabs.activate(this.value());
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.onClick();
  }
}

/** The container of the panels. */
@Component({
  selector: 'hx-tab-panels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tab-panels' },
  template: '<ng-content />',
})
export class HxTabPanels {}

/** Marks the lazy content of a panel: `<ng-template hxTabContent>…</ng-template>`. */
@Directive({ selector: 'ng-template[hxTabContent]' })
export class HxTabContent {
  readonly template = inject(TemplateRef);
}

/** The content of one tab. */
@Component({
  selector: 'hx-tab-panel',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-tab-panel',
    role: 'tabpanel',
    tabindex: '0',
    '[id]': 'tabs.panelId(value())',
    '[attr.aria-labelledby]': 'tabs.tabId(value())',
    '[hidden]': '!active()',
  },
  template: `
    @if (lazy(); as lazy) {
      @if (render()) {
        <ng-container [ngTemplateOutlet]="lazy.template" />
      }
    } @else {
      <ng-content />
    }
  `,
})
export class HxTabPanel {
  protected readonly tabs = inject(HxTabs);
  /** The `value` of the tab this panel belongs to. */
  readonly value = input.required<string>();
  protected readonly lazy = contentChild(HxTabContent);

  protected active(): boolean {
    return this.tabs.value() === this.value();
  }

  protected render(): boolean {
    return this.active() || (this.tabs.keepAlive() && this.tabs.visited().has(this.value()));
  }
}
